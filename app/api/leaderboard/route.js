import { createServerClient } from "../../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  const supabase = createServerClient(request);

  // Fetch all linked cards
  const { data: cards, error } = await supabase
    .from("user_cards")
    .select("user_id, song_id, chip_id, perspective, linked_at");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Group by user_id
  const userMap = {};
  (cards || []).forEach((row) => {
    if (!userMap[row.user_id]) {
      userMap[row.user_id] = { totalCards: 0, uniqueSongs: new Set(), cards: [] };
    }
    userMap[row.user_id].totalCards++;
    userMap[row.user_id].uniqueSongs.add(row.song_id);
    userMap[row.user_id].cards.push({
      song_id: row.song_id,
      perspective: row.perspective,
      chip_id: row.chip_id,
    });
  });

  // Fetch user metadata for all users in the leaderboard
  const userIds = Object.keys(userMap);
  const userMeta = {};

  // Use Supabase admin to get user details
  for (const uid of userIds) {
    try {
      const { data } = await supabase.auth.admin.getUserById(uid);
      if (data?.user?.user_metadata) {
        userMeta[uid] = data.user.user_metadata;
      }
    } catch (e) {
      // Fallback if admin API not available
    }
  }

  // Build leaderboard sorted by total cards
  const leaderboard = Object.entries(userMap)
    .map(([uid, info]) => ({
      rank: 0,
      user_id: uid,
      display: userMeta[uid]?.display_name || "Collector " + uid.substring(0, 6).toUpperCase(),
      display_name: userMeta[uid]?.display_name || "",
      pfp_url: userMeta[uid]?.pfp_url || "",
      instagram: userMeta[uid]?.instagram || "",
      twitter: userMeta[uid]?.twitter || "",
      tiktok: userMeta[uid]?.tiktok || "",
      totalCards: info.totalCards,
      uniqueSongs: info.uniqueSongs.size,
      cards: info.cards,
    }))
    .sort((a, b) => b.totalCards - a.totalCards || b.uniqueSongs - a.uniqueSongs);

  // Assign ranks
  leaderboard.forEach((entry, i) => {
    entry.rank = i + 1;
  });

  return NextResponse.json({ leaderboard });
}
