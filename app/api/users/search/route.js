import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
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
