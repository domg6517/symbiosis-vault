import { NextResponse } from "next/server";
import { createServerClient } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, email, instagram, twitter, tiktok, pfp_url")
      .eq("id", userId)
      .single();

    if (error) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: data });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
