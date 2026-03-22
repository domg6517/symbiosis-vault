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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const { data: userCards, error } = await supabase
      .from("user_cards")
      .select(`
        id,
        linked,
        linked_at,
        card_template:card_templates (
          id,
          chip_id,
          rarity,
          type,
          song:songs (
            id,
            title,
            song_number
          ),
          perspective:perspectives (
            id,
            name
          ),
          content:card_content (
            content_type,
            file_url
          )
        )
      `)
      .eq("user_id", userId)
      .eq("linked", true)
      .order("linked_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const cards = (userCards || []).map((uc) => {
      const content = uc.card_template.content || [];
      const imageContent = content.find((c) => c.content_type === "image");
      return {
        chipId: uc.card_template.chip_id,
        songId: uc.card_template.song.id,
        songTitle: uc.card_template.song.title,
        songNum: uc.card_template.song.song_number,
        perspective: uc.card_template.perspective.name,
        rarity: uc.card_template.rarity,
        linked: uc.linked,
        type: uc.card_template.type,
        linkedAt: uc.linked_at,
        imageUrl: imageContent?.file_url || null,
      };
    });

    return NextResponse.json({ cards });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
