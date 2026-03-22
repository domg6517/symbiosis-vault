import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

const RARITY_POINTS = { common: 1, rare: 2, super_rare: 5 };

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

    const { data: cards, error } = await supabase
      .from("user_cards")
      .select("card_template:card_templates (song_id, rarity)")
      .eq("user_id", userId)
      .eq("linked", true);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const totalCards = cards?.length || 0;
    const uniqueSongs = new Set((cards || []).map((c) => c.card_template?.song_id)).size;
    const points = (cards || []).reduce((sum, c) => sum + (RARITY_POINTS[c.card_template?.rarity] || 1), 0);

    let rank = null;
    if (totalCards > 0) {
      const { data: allCards } = await supabase
        .from("user_cards")
        .select("user_id, card_template:card_templates (rarity)")
        .eq("linked", true);

      const userPoints = {};
      (allCards || []).forEach((c) => {
        const uid = c.user_id;
        userPoints[uid] = (userPoints[uid] || 0) + (RARITY_POINTS[c.card_template?.rarity] || 1);
      });

      rank = Object.values(userPoints).filter((p) => p > points).length + 1;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar_url, instagram, twitter, tiktok")
      .eq("id", userId)
      .single();

    return NextResponse.json({
      user_id: userId,
      display: profile?.username || "Collector",
      display_name: profile?.username || "",
      pfp_url: profile?.avatar_url || "",
      instagram: profile?.instagram || "",
      twitter: profile?.twitter || "",
      tiktok: profile?.tiktok || "",
      totalCards,
      uniqueSongs,
      points,
      rank,
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
