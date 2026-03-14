import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";
import { rateLimit, getClientIP } from "../../../../lib/rateLimit";

export async function POST(request) {
  try {
    const supabase = createServerClient();

    const authHeader = request.headers.get("authorization");
    const ip = getClientIP(request);

    // Rate limit: 5 per minute per IP (covers both auth and unauth)
    const { allowed } = rateLimit("terms:" + ip, 5, 60000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const { version } = body;

    if (!version) {
      return NextResponse.json({ error: "Version is required" }, { status: 400 });
    }

    let userId = null;
    if (authHeader) {
      const authToken = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(authToken);
      if (user) userId = user.id;
    }

    // Log terms acceptance
    await supabase.from("terms_acceptance_log").insert({
      user_id: userId,
      terms_version: version,
      accepted_at: new Date().toISOString(),
      ip_address: ip,
      user_agent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Terms acceptance log error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
