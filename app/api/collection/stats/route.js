import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const supabase = createServerClient();

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's linked cards with details
    const { data: userCards } = await supabase
      .from("user_cards")
      .select(`
        card_template:card_templates (
          type,
          song_id,
          perspective_id
        )
      `)
      .eq("user_id", user.id)
      .eq("linked", true);

    // Get user's ultra rares
    const { data: userUltraRares } = await supabase
      .from("user_ultra_rares")
      .select("*")
      .eq("user_id", user.id)
      .eq("owned", true);

    // Calculate stats
    const singles = userCards?.filter((c) => c.card_template.type === "single") || [];
    const boosters = userCards?.filter((c) => c.card_template.type === "booster") || [];

    // Count completed sets (all 3 perspectives for a song)
    const singleSongPerspectives = {};
    singles.forEach((c) => {
      const key = c.card_template.song_id;
      if (!singleSongPerspectives[key]) singleSongPerspectives[key] = new Set();
      singleSongPerspectives[key].add(c.card_template.perspective_id);
    });
    const completedSingles = Object.values(singleSongPerspectives).filter(
      (s) => s.size >= 3
    ).length;

    const boosterSongPerspectives = {};
    boosters.forEach((c) => {
      const key = c.card_template.song_id;
      if (!boosterSongPerspectives[key]) boosterSongPerspectives[key] = new Set();
      boosterSongPerspectives[key].add(c.card_template.perspective_id);
    });
    const completedBoosters = Object.values(boosterSongPerspectives).filter(
      (s) => s.size >= 3
    ).length;

    return NextResponse.json({
      totalLinked: userCards?.length || 0,
      singlesLinked: singles.length,
      boostersLinked: boosters.length,
      ultraRaresOwned: userUltraRares?.length || 0,
      completedSingles,
      completedBoosters,
      totalSingles: 10,
      totalBoosters: 22,
      totalUltraRares: 30,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
