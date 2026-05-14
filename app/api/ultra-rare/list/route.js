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

    // Fetch ALL ultra_rare card templates with song, perspective, and content
    const { data: templates, error: tplError } = await supabase
      .from("card_templates")
      .select(`
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
      `)
      .eq("rarity", "ultra_rare");

    if (tplError) {
      return NextResponse.json({ error: tplError.message }, { status: 500 });
    }

    // Fetch ownership: which templates are currently linked by someone
    const templateIds = (templates || []).map((t) => t.id);
    let ownershipMap = {}; // template_id -> { user_id, username }

    if (templateIds.length > 0) {
      const { data: ownedCards } = await supabase
        .from("user_cards")
        .select("user_id, card_template_id")
        .in("card_template_id", templateIds)
        .eq("linked", true);

      if (ownedCards && ownedCards.length > 0) {
        const userIds = [...new Set(ownedCards.map((uc) => uc.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, username")
          .in("id", userIds);

        const profileMap = {};
        if (profiles) {
          for (const p of profiles) {
            profileMap[p.id] = p.username;
          }
        }

        for (const oc of ownedCards) {
          ownershipMap[oc.card_template_id] = {
            user_id: oc.user_id,
            username: profileMap[oc.user_id] || null,
          };
        }
      }
    }

    // Build full catalog: all templates + ownership info
    const ultraRares = [];
    for (const ct of templates || []) {
      const content = ct.content || [];
      const imageContent = content.find((c) => c.content_type === "image");
      const ownerData = ownershipMap[ct.id] || null;

      ultraRares.push({
        chipId: ct.chip_id || null,
        songId: ct.song?.id || null,
        songTitle: ct.song?.title || null,
        songNum: ct.song?.song_number || null,
        perspective: ct.perspective?.name || null,
        owner: ownerData ? { username: ownerData.username } : null,
        isOwnedByMe: ownerData ? ownerData.user_id === currentUserId : false,
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
