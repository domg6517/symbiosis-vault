import { NextResponse } from "next/server";
import { createServerClient } from "../../../../lib/supabase";
import { rateLimit, getClientIP } from "../../../../lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const ip = getClientIP(request);
  const { allowed } = rateLimit("profile-update:" + ip, 10, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { userId, username, email, instagram, twitter, tiktok } = body;

    if (!userId || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const trimmed = username.trim();
    if (trimmed.length < 2) {
      return NextResponse.json({ error: "Username too short" }, { status: 400 });
    }

    // Server-side uniqueness check (bypasses RLS)
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", trimmed)
      .neq("id", userId)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    // Update profile (bypasses RLS)
    const { error: updateError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        username: trimmed,
        email: email || null,
        instagram: instagram || null,
        twitter: twitter || null,
        tiktok: tiktok || null,
      }, { onConflict: "id" });

    if (updateError) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    // Also update auth user metadata â include socials so session stays in sync
    const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        display_name: trimmed,
        instagram: instagram || null,
        twitter: twitter || null,
        tiktok: tiktok || null,
      }
    });

    return NextResponse.json({ success: true, username: trimmed });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
