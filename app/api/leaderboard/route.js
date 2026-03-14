import { createServerClient } from "../../../lib/supabase";
import { NextResponse } from "next/server";
import { rateLimit, getClientIP } from "../../../lib/rateLimit";

const RARITY_POINTS = {
  common: 1,
  rare: 2,
  super_rare: 5,
};

export async function GET(request) {
  const supabase = createServerClient();

  // Auth check - require valid session
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { allowed } = rateLimit("lb:" + user.id, 5, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }


  // Fetch all linked cards with rarity from card_templates
  const { data: cards, error } = await supabase
    .from("user_cards")
    .select("user_id, linked, card_template:card_templates (chip_id, song_id, rarity, perspective:perspectives (name))");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Only linked cards
  const linkedCards = (cards || []).filter((c) => c.linked);

  // Group by user_id
  const userMap = {};
  linkedCards.forEach((row) => {
    const uid = row.user_id;
    if (!userMap[uid]) {
      userMap[uid] = { totalCards: 0, points: 0, uniqueSongs: new Set(), cards: [] };
    }
    const rarity = row.card_template?.rarity || "common";
    const pts = RARITY_POINTS[rarity] || 1;
    userMap[uid].totalCards++;
    userMap[uid].points += pts;
    userMap[uid].uniqueSongs.add(row.card_template?.song_id);
    userMap[uid].cards.push({
      song_id: row.card_template?.song_id,
      perspective: row.card_template?.perspective?.name,
      chip_id: row.card_template?.chip_id,
      rarity,
    });
  });

  // Fetch user metadata + profile usernames
  const userIds = Object.keys(userMap);
  const userMeta = {};
  const profileMap = {};

  // Get profiles for usernames
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", userIds);
    if (profiles) {
      profiles.forEach((p) => { profileMap[p.id] = p.username; });
    }
  }

  for (const uid of userIds) {
    try {
      const { data } = await supabase.auth.admin.getUserById(uid);
      if (data?.user?.user_metadata) {
        userMeta[uid] = data.user.user_metadata;
      }
    } catch (e) {}
  }

  // Build leaderboard sorted by POINTS (not just total cards)
  const leaderboard = Object.entries(userMap)
    .map(([uid, info]) => ({
      rank: 0,
      user_id: uid,
      display: userMeta[uid]?.display_name || profileMap[uid] || "Collector " + uid.substring(0, 6).toUpperCase(),
      display_name: userMeta[uid]?.display_name || "",
      pfp_url: userMeta[uid]?.pfp_url || "",
      instagram: userMeta[uid]?.instagram || "",
      twitter: userMeta[uid]?.twitter || "",
      tiktok: userMeta[uid]?.tiktok || "",
      totalCards: info.totalCards,
      points: info.points,
      uniqueSongs: info.uniqueSongs.size,
      cards: info.cards,
    }))
    .sort((a, b) => b.points - a.points || b.totalCards - a.totalCards || b.uniqueSongs - a.uniqueSongs);

  leaderboard.forEach((entry, i) => { entry.rank = i + 1; });

  return NextResponse.json({ leaderboard });
}
