import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const supabase = createServerClient();

    const authHeader = request.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { ultraRareId } = await request.json();
    if (!ultraRareId) return NextResponse.json({ error: "ultraRareId is required" }, { status: 400 });

    const { data: ownership } = await supabase
      .from("user_ultra_rares")
      .select("id, owned")
      .eq("user_id", user.id)
      .eq("ultra_rare_id", ultraRareId)
      .eq("owned", true)
      .single();

    if (!ownership) {
      return NextResponse.json({ error: "You do not own this 1/1." }, { status: 403 });
    }

    await supabase
      .from("user_ultra_rares")
      .update({ owned: false, owned_at: null })
      .eq("id", ownership.id);

    try { await supabase.rpc("recalculate_badges", { p_user_id: user.id }); } catch (e) {}

    // Log to activity feed
    try {
      let displayName = "Collector";
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
      if (profile?.username) displayName = profile.username;

      const { data: urData } = await supabase
        .from("ultra_rares")
        .select("chip_id, song:songs(title), perspective:perspectives(name)")
        .eq("id", ultraRareId)
        .single();

      if (urData) {
        await supabase.from("activity_feed").insert({
          user_id: user.id,
          event_type: "card_unlinked",
          card_chip_id: urData.chip_id,
          card_perspective: urData.perspective?.name || null,
          card_rarity: "ultra_rare",
          card_type: "single",
          card_song_title: urData.song?.title || null,
          display_name: displayName,
        });
      }
    } catch (e) { /* non-critical */ }

    return NextResponse.json({ success: true, message: "1/1 disconnected. The chip is available again." });
  } catch (err) {
    console.error("Ultra rare disconnect error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
