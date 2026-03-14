import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const supabase = createServerClient();

    // Auth check - require valid session
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const authToken = authHeader.replace("Bearer ", "");
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(authToken);
    if (authError || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Fetch profile from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    // Fetch auth user metadata (social links, pfp) using admin
    let metadata = {};
    try {
      const { data: authData } = await supabase.auth.admin.getUserById(userId);
      if (authData?.user?.user_metadata) {
        metadata = authData.user.user_metadata;
      }
    } catch (e) {
      console.error("Fetch auth metadata error:", e);
    }

    // Fetch badges
    let badges = [];
    try {
      const { data: badgeData } = await supabase
        .from("user_badges")
        .select("awarded_at, badge:badges (slug, label, description, icon)")
        .eq("user_id", userId);
      if (badgeData) badges = badgeData;
    } catch (e) {
      console.error("Fetch badges error:", e);
    }

    return NextResponse.json({
      user_id: userId,
      username: profile?.username || metadata.display_name || "Collector",
      pfp_url: metadata.pfp_url || "",
      instagram: metadata.instagram || "",
      twitter: metadata.twitter || "",
      tiktok: metadata.tiktok || "",
      badges: badges,
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
