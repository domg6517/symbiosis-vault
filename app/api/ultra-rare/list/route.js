import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request) {
  try {
    const supabase = createServerClient();
    let currentUserId = null;
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) currentUserId = user.id;
    }
    const { data: ultraRares, error } = await supabase
      .from("ultra_rares")
      .select("id, song_id, perspective_id, image_url, song:songs(id, title, song_number), perspective:perspectives(id, name)")
      .order("song_id")
      .order("perspective_id");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const { data: ownership, error: ownershipError } = await supabase
      .from("user_ultra_rares")
      .select("ultra_rare_id, user_id, owned, owned_at")
      .eq("owned", true);
    console.log("ownership count:", (ownership || []).length, JSON.stringify(ownership));
    if (ownershipError) console.error("ownershipError:", ownershipError);
    const ownerIds = [...new Set((ownership || []).map(o => o.user_id))];
    let profilesMap = {};
    if (ownerIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", ownerIds);
      (profiles || []).forEach(p => {
        profilesMap[p.id] = p;
      });
    }
    const ownerMap = {};
    (ownership || []).forEach(o => {
      const profile = profilesMap[o.user_id];
      ownerMap[o.ultra_rare_id] = {
        userId: o.user_id,
        username: profile?.username || "Collector",
        isCurrentUser: o.user_id === currentUserId,
      };
    });
    console.log("ownerMap keys:", Object.keys(ownerMap));
    const result = (ultraRares || []).map(ur => ({
      id: ur.id,
      songId: ur.song_id,
      songTitle: ur.song?.title,
      songNum: ur.song?.song_number,
      perspective: ur.perspective?.name,
      perspectiveId: ur.perspective_id,
      imageUrl: ur.image_url,
      owner: ownerMap[ur.id] || null,
      isOwnedByMe: ownerMap[ur.id]?.isCurrentUser || false,
    }));
    return NextResponse.json({ ultraRares: result });
  } catch (err) {
    console.error("Ultra rare list error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
