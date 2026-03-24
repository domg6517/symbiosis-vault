import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const supabase = createServerClient();

    const authHeader = request.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get this user's linked ultra rare cards from user_cards
    const { data: userCards, error } = await supabase
      .from("user_cards")
      .select(`
        id,
        card_template:card_templates (
          rarity,
          perspective_id,
          song:songs (
            song_number
          )
        )
      `)
      .eq("user_id", user.id)
      .eq("linked", true);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Build response in the format CollectionScreen expects:
    // { id: "UR-{songNum}-{perspId}", isOwnedByMe: true, owned: true }
    const ultraRares = (userCards || [])
      .filter((uc) => uc.card_template?.rarity === "ultra_rare")
      .map((uc) => ({
        id: `UR-${uc.card_template.song.song_number}-${uc.card_template.perspective_id}`,
        isOwnedByMe: true,
        owned: true,
      }));

    return NextResponse.json({ ultraRares });
  } catch (err) {
    console.error("Ultra rare list error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
