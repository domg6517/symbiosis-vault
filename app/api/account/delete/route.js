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

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { allowed } = rateLimit("del:" + user.id, 3, 60000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const userId = user.id;

    // Delete user data in order (respecting foreign keys)
    // 1. Activity feed entries
    try {
      await supabase.from("activity_feed").delete().eq("user_id", userId);
    } catch (e) {
      console.error("Delete activity_feed error:", e);
    }

    // 2. User badges
    try {
      await supabase.from("user_badges").delete().eq("user_id", userId);
    } catch (e) {
      console.error("Delete user_badges error:", e);
    }

    // 3. User ultra rares
    try {
      await supabase.from("user_ultra_rares").delete().eq("user_id", userId);
    } catch (e) {
      console.error("Delete user_ultra_rares error:", e);
    }

    // 4. User cards
    try {
      await supabase.from("user_cards").delete().eq("user_id", userId);
    } catch (e) {
      console.error("Delete user_cards error:", e);
    }

    // 5. Terms acceptance log
    try {
      await supabase.from("terms_acceptance_log").delete().eq("user_id", userId);
    } catch (e) {
      console.error("Delete terms_acceptance_log error:", e);
    }

    // 6. Profile
    try {
      await supabase.from("profiles").delete().eq("id", userId);
    } catch (e) {
      console.error("Delete profiles error:", e);
    }

    // 7. Delete PFP from storage
    try {
      const { data: files } = await supabase.storage
        .from("card-media")
        .list("avatars/" + userId);
      if (files && files.length > 0) {
        const paths = files.map((f) => "avatars/" + userId + "/" + f.name);
        await supabase.storage.from("card-media").remove(paths);
      }
    } catch (e) {
      console.error("Delete storage error:", e);
    }

    // 8. Delete auth user (requires service role)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Delete auth user error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete account. Please contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
