import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("activity_feed")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    // Look up profile usernames for all unique user_ids
    const userIds = [...new Set((data || []).map((e) => e.user_id).filter(Boolean))];
    let profileMap = {};

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);

      if (profiles) {
        profiles.forEach((p) => {
          profileMap[p.id] = p.username;
        });
      }
    }

    // Override display_name with profile username (never expose email)
    const events = (data || []).map((event) => ({
      ...event,
      display_name: profileMap[event.user_id] || event.display_name || "A collector",
    }));

    return NextResponse.json({ events });
  } catch (err) {
    console.error("Activity feed error:", err);
    return NextResponse.json({ events: [] });
  }
}
