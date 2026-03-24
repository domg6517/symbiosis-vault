import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const supabase = createServerClient();

    const authHeader = request.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { ultraRareId } = await request.json();
    if (!ultraRareId) return NextResponse.json({ error: "Missing ultraRareId" }, { status: 400 });

    // Parse "UR-00C-2" → songNum="00C", perspId=2
    const parts = ultraRareId.split("-");
    // Format: UR-{songNum}-{perspId}, but songNum itself may contain dashes (e.g. "00C")
    // Safe parse: last segment is perspId, everything between first and last is songNum
    const perspId = parseInt(parts[parts.length - 1], 10);
    const songNum = parts.slice(1, parts.length - 1).join("-");

    if (!songNum || isNaN(perspId)) {
      return NextResponse.json({ error: "Invalid ultraRareId format" }, { status: 400 });
    }

    // Find the card_template for this ultra rare
    const { data: templates, error: tErr } = await supabase
      .from("card_templates")
      .select("id, song:songs!inner(id, song_number)")
      .eq("rarity", "ultra_rare")
      .eq("perspective_id", perspId)
      .eq("songs.song_number", songNum)
      .limit(1);

    if (tErr || !templates?.length) {
      return NextResponse.json({ error: "Ultra rare card template not found" }, { status: 404 });
    }

    const templateId = templates[0].id;
    const songId = templates[0].song.id;

    // Unlink the user_card
    const { error: unlinkErr } = await supabase
      .from("user_cards")
      .update({ linked: false, linked_at: null })
      .eq("user_id", user.id)
      .eq("card_template_id", templateId)
      .eq("linked", true);

    if (unlinkErr) return NextResponse.json({ error: unlinkErr.message }, { status: 500 });

    // Log to activity feed
    try {
      await supabase.from("activity_feed").insert({
        user_id: user.id,
        action: "disconnect",
        song_id: songId,
        card_rarity: "ultra_rare",
      });
    } catch (_) {}

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Ultra rare disconnect error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
