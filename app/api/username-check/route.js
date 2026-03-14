import { NextResponse } from "next/server";
import { rateLimit, getClientIP } from "../../../lib/rateLimit";
import { createServerClient } from "../../../lib/supabase";

export async function GET(request) {
  const ip = getClientIP(request);
  const { allowed } = rateLimit("ucheck:" + ip, 10, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username || username.trim().length < 2) {
      return NextResponse.json({ error: "Username too short" }, { status: 400 });
    }

    const trimmed = username.trim();
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", trimmed)
      .limit(1);

    if (error) {
      return NextResponse.json({ error: "Query failed" }, { status: 500 });
    }

    const taken = data && data.length > 0;
    return NextResponse.json({ available: !taken, username: trimmed });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
