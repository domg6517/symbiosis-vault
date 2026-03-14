import { createServerClient } from "../../../lib/supabase";
import { NextResponse } from "next/server";
import { rateLimit } from "../../../lib/rateLimit";

const RARITY_POINTS = {
  common: 1,
  rare: 2,
  super_rare: 5,
};

// In-memory cache to avoid recomputing every request
let cachedResult = null;
let cacheTimestamp = 0;
const CACHE_TTL = 15000; // 15 seconds

export async function GET(request) {
  const supabase = createServerClient();

  // Auth check
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const authToken = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { allowed } = rateLimit("lb:" + user.id, 5, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Return cached result if fresh
  if (cachedResult && Date.now() - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json({ leaderboard: cachedResult });
  }

  // Fetch all linked cards with rarity + perspective in a single query
  const { data: cards, error } = await supabase
    .from("user_cards")
    .select("user_id, linked, card_template:card_templates (chip_id, song_id, rarity, perspective:perspectives (name))")
    .eq("linked", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Group by user_id
  const userMap = {};
  (cards || []).forEach((row) => {
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

  const userIds = Object.keys(userMap);

  // Single batch query for all profile data (replaces N+1 admin.getUserById calls)
  const profileMap = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, pfp_url, instagram, twitter, tiktok")
      .in("id", userIds);

    if (profiles) {
      profiles.forEach((p) => {
        profileMap[p.id] = p;
      });
    }
  }

  // Build leaderboard sorted by points
  const leaderboard = Object.entries(userMap)
    .map(([uid, info]) => {
      const p = profileMap[uid] || {};
      return {
        rank: 0,
        user_id: uid,
        display: p.username || "Collector " + uid.substring(0, 6).toUpperCase(),
        display_name: p.username || "",
        pfp_url: p.pfp_url || "",
        instagram: p.instagram || "",
        twitter: p.twitter || "",
        tiktok: p.tiktok || "",
        totalCards: info.totalCards,
        points: info.points,
        uniqueSongs: info.uniqueSongs.size,
        cards: info.cards,
      };
    })
    .sort((a, b) => b.points - a.points || b.totalCards - a.totalCards || b.uniqueSongs - a.uniqueSongs);

  leaderboard.forEach((entry, i) => {
    entry.rank = i + 1;
  });

  // Cache result
  cachedResult = leaderboard;
  cacheTimestamp = Date.now();

  return NextResponse.json({ leaderboard });
}
