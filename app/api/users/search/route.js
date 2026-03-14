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
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.trim().length < 1) {
      return NextResponse.json({ users: [] });
    }

    const query = q.trim();

    const { data, error } = await supabase
      .from("profiles")
      .select("id, username")
      .ilike("username", `%${query}%`)
      .limit(10);

    if (error) throw error;

    const users = (data || []).map((p) => ({
      user_id: p.id,
      display_name: p.username,
    }));

    return NextResponse.json({ users });
  } catch (err) {
    console.error("User search error:", err);
    return NextResponse.json({ users: [] });
  }
}
