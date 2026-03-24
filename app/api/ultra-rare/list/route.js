import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const supabase = createServerClient();

    // Optional auth for isOwnedByMe check
    let currentUserId = null;
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) currentUserId = user.id;
    }

    // Get all ultra rare records with song + perspective info
    const { data: ultraRares, error } = await supabase
      .from("ultra_rares")
      .select(`
        chip_id,
        image_url,
        song:songs (id, title, song_number),
        perspective:perspectives (id, name)
      `);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const chipIds = (ultraRares || []).map((ur) => ur.chip_id);

    // Build owner map: chip_id -> { userId, username }
    let ownerMap = {};
    if (chipIds.length > 0) {
      const { data: templates } = await supabase
        .from("card_templates")
        .select("id, chip_id")
        .in("chip_id", chipIds);

      if (templates && templates.length > 0) {
        const templateIds = templates.map((t) => t.id);
        const chipByTemplateId = {};
        templates.forEach((t) => { chipByTemplateId[t.id] = t.chip_id; });

        const { data: userCards } = await supabase
          .from("user_cards")
          .select("card_template_id, user_id")
          .in("card_template_id", templateIds)
          .eq("linked", true);

        if (userCards && userCards.length > 0) {
          const ownerIds = [...new Set(userCards.map((uc) => uc.user_id))];
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, username")
            .in("id", ownerIds);

          const profileMap = {};
          if (profiles) profiles.forEach((p) => { profileMap[p.id] = p.username; });

          userCards.forEach((uc) => {
            const chipId = chipByTemplateId[uc.card_template_id];
            if (chipId) {
              ownerMap[chipId] = {
                userId: uc.user_id,
                username: profileMap[uc.user_id] || "Collector",
              };
            }
          });
        }
      }
    }

    const result = (ultraRares || []).map((ur) => ({
      chipId: ur.chip_id,
      imageUrl: ur.image_url,
      songId: ur.song?.id,
      songTitle: ur.song?.title,
      songNum: ur.song?.song_number,
      perspective: ur.perspective?.name,
      owner: ownerMap[ur.chip_id] || null,
      isOwnedByMe: currentUserId
        ? ownerMap[ur.chip_id]?.userId === currentUserId
        : false,
    }));

    return NextResponse.json({ ultraRares: result });
  } catch (err) {
    console.error("Ultra rare list error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
