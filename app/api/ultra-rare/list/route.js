import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const supabase = createServerClient();

    // Optional auth — used to determine isOwnedByMe
    let currentUserId = null;
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const {
        data: { user },
      } = await supabase.auth.getUser(token);
      if (user) currentUserId = user.id;
    }

    // Fetch all linked ultra_rare user_cards with template + content
    const { data: urCards, error } = await supabase
      .from("user_cards")
      .select(`
        user_id,
        linked,
        card_template:card_templates (
          id,
          chip_id,
          rarity,
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
      .eq("linked", true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter to only ultra_rare cards in JS (Supabase can't filter on related table columns)
    const validCards = (urCards || []).filter(
      (uc) => uc.card_template && uc.card_template.rarity === "ultra_rare"
    );

    // Collect unique user_ids to fetch profiles in one query
    const userIds = [...new Set(validCards.map((uc) => uc.user_id))];

    let profileMap = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);

      if (profiles) {
        for (const p of profiles) {
          profileMap[p.id] = p.username;
        }
      }
    }

    // Build array in the shape CollectionScreen expects
    const ultraRares = [];
    for (const uc of validCards) {
      const ct = uc.card_template;
      const content = ct.content || [];
      const imageContent = content.find((c) => c.content_type === "image");

      ultraRares.push({
        chipId: ct.chip_id || null,
        songId: ct.song?.id || null,
        perspective: ct.perspective?.name || null,
        owner: {
          username: profileMap[uc.user_id] || null,
        },
        isOwnedByMe: currentUserId ? uc.user_id === currentUserId : false,
        imageUrl: imageContent?.file_url || null,
      });
    }

    return NextResponse.json({ ultraRares });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
