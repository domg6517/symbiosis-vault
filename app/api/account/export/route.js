import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";
import { rateLimit } from "../../../../lib/rateLimit";

export async function POST(request) {
  try {
    const supabase = createServerClient();

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const authToken = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 1 request per day per user
    const { allowed } = rateLimit("export-req:" + user.id, 1, 86400000);
    if (!allowed) {
      return NextResponse.json(
        { error: "You have already submitted a data export request. We will process it within 30 days." },
        { status: 429 }
      );
    }

    const userId = user.id;

    // Log the export request
    await supabase.from("data_export_requests").insert({
      user_id: userId,
      email: user.email,
      status: "pending",
      requested_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Your data export request has been submitted. We will process it and send it to your registered email within 30 days, as required by GDPR.",
    });
  } catch (err) {
    console.error("Data export request error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
