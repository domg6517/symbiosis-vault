import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

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

    const { chipId } = await request.json();
    if (!chipId) {
      return NextResponse.json(
        { error: "chipId is required" },
        { status: 400 }
      );
    }

    // Find card template with perspective and song info for activity logging
    const { data: cardTemplate } = await supabase
      .from("card_templates")
      .select(`
        id,
        chip_id,
        rarity,
        type,
        song:songs (title),
        perspective:perspectives (id, name)
      `)
      .eq("chip_id", chipId)
      .single();

    if (!cardTemplate) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Unlink the card
    const { error } = await supabase
      .from("user_cards")
      .update({
        linked: false,
        unlinked_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("card_template_id", cardTemplate.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Recalculate all badges for this user (may revoke badges they no longer qualify for)
    try {
      await supabase.rpc("recalculate_badges", { p_user_id: user.id });
    } catch (badgeErr) {
      console.error("Badge recalculation error:", badgeErr);
    }

    // Log activity to feed
    try {
      let displayName = "Collector";
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
      if (profile?.username) {
        displayName = profile.username;
      }

      await supabase.from("activity_feed").insert({
        user_id: user.id,
        event_type: "card_unlinked",
        card_chip_id: cardTemplate.chip_id,
        card_perspective: cardTemplate.perspective?.name || null,
        card_rarity: cardTemplate.rarity,
        card_type: cardTemplate.type,
        card_song_title: cardTemplate.song?.title || null,
        display_name: displayName,
      });
    } catch (activityErr) {
      console.error("Activity log error:", activityErr);
    }

    return NextResponse.json({
      message: "Card unlinked successfully",
      chipId,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
