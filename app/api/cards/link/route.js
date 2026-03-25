import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";
import { rateLimit } from "../../../../lib/rateLimit";
import { logAuditEvent } from "../../../../lib/auditLog";
import { notifyDiscord, cardLinkedEmbed, ultraRareClaimedEmbed, badgeEarnedEmbed } from "../../../../lib/discord";

export async function POST(request) {
  try {
    const supabase = createServerClient();

    const authHeader = request.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!user.email_confirmed_at) {
      return NextResponse.json({ error: "Please verify your email before linking cards." }, { status: 403 });
    }

    const { allowed } = rateLimit("link:" + user.id, 10, 60000);
    if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const { chipId } = await request.json();
    if (!chipId) return NextResponse.json({ error: "chipId is required" }, { status: 400 });

    const { data: cardTemplate, error: findError } = await supabase
      .from("card_templates")
      .select(`id, chip_id, rarity, type, song:songs (id, title, song_number, type), perspective:perspectives (id, name)`)
      .eq("chip_id", chipId)
      .single();

    if (findError || !cardTemplate) {
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      const { allowed: ipAllowed } = rateLimit("chip-miss:" + ip, 5, 300000);
      if (!ipAllowed) return NextResponse.json({ error: "Too many invalid attempts. Please try again later." }, { status: 429 });
      return NextResponse.json({ error: "Card not found. This NFC chip is not registered." }, { status: 404 });
    }

    const { data: alreadyLinked } = await supabase
      .from("user_cards").select("id, user_id")
      .eq("card_template_id", cardTemplate.id).eq("linked", true).single();

    if (alreadyLinked && alreadyLinked.user_id !== user.id) {
      return NextResponse.json({ error: "This card is connected to another account." }, { status: 409 });
    }

    const { data: existing } = await supabase
      .from("user_cards").select("id, linked")
      .eq("user_id", user.id).eq("card_template_id", cardTemplate.id).single();

    if (existing && existing.linked) {
      return NextResponse.json({ error: "Already collected!", card: formatCard(cardTemplate) }, { status: 409 });
    }

    if (existing) {
      await supabase.from("user_cards")
        .update({ linked: true, linked_at: new Date().toISOString(), unlinked_at: null })
        .eq("id", existing.id);
    } else {
      await supabase.from("user_cards").insert({ user_id: user.id, card_template_id: cardTemplate.id, linked: true });
    }

    // Fetch display name early
    let displayName = "Collector";
    try {
      const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
      if (profile?.username) displayName = profile.username;
    } catch (_) {}

    // Fetch card image from card_content
    let cardImageUrl = data?.file_url ? encodeURI(data.file_url) : null = null;
    try {
      const { data: cc } = await supabase
        .from("card_content").select("file_url")
        .eq("card_template_id", cardTemplate.id).eq("content_type", "image").single();
      cardImageUrl = data?.file_url ? encodeURI(data.file_url) : null = cc?.file_url || null;
    } catch (_) {}

    // Badge diff
    console.log("[DISCORD_DEBUG] Pre-badge section. user=" + user?.id?.substring(0,8));
    let badgesBefore = [];
    try {
      const { data } = await supabase.from("user_badges").select("badge_id").eq("user_id", user.id);
      badgesBefore = (data || []).map((b) => b.badge_id);
    } catch (_) {}

    try { await supabase.rpc("recalculate_badges", { p_user_id: user.id }); } catch (e) { console.error("Badge recalculation error:", e); }

    try {
      const { data: badgesAfter } = await supabase
        .from("user_badges").select("badge_id, badge:badges(icon, label)").eq("user_id", user.id);
      const newBadges = (badgesAfter || []).filter((b) => !badgesBefore.includes(b.badge_id));
      for (const b of newBadges) {
        await notifyDiscord(badgeEarnedEmbed({ username: displayName, badgeIcon: b.badge.icon, badgeLabel: b.badge.label }));
      }
    } catch (_) {}

    // Activity feed
    try {
      await supabase.from("activity_feed").insert({
        user_id: user.id, event_type: "card_linked",
        card_chip_id: cardTemplate.chip_id, card_perspective: cardTemplate.perspective.name,
        card_rarity: cardTemplate.rarity, card_type: cardTemplate.type,
        card_song_title: cardTemplate.song.title, display_name: displayName,
      });
      console.log("Activity logged successfully for card link");
    } catch (activityErr) { console.error("Activity log error:", JSON.stringify(activityErr)); }

    // Check set completion / ultra rare unlock
    const { data: songCards } = await supabase
      .from("user_cards").select("card_template:card_templates (song_id, perspective_id)")
      .eq("user_id", user.id).eq("linked", true);

    const songPerspectives = new Set();
    songCards?.forEach((c) => {
      if (c.card_template.song_id === cardTemplate.song.id) songPerspectives.add(c.card_template.perspective_id);
    });

    let ultraRareUnlocked = null;
    const isUltraRareChip = cardTemplate.rarity === "ultra_rare";

    if (isUltraRareChip || (songPerspectives.size >= 3 && cardTemplate.type === "single")) {
      const ultraRareId = `UR-${cardTemplate.song.song_number}-${cardTemplate.perspective.id}`;
      const { data: ur } = await supabase.from("ultra_rares").select("id").eq("id", ultraRareId).single();
      if (ur) {
        const { data: existingUr } = await supabase
          .from("user_ultra_rares").select("id, owned")
          .eq("user_id", user.id).eq("ultra_rare_id", ur.id).single();
        if (!existingUr) {
          await supabase.from("user_ultra_rares").insert({ user_id: user.id, ultra_rare_id: ur.id, owned: true, owned_at: new Date().toISOString() });
          ultraRareUnlocked = ur.id;
        } else if (!existingUr.owned) {
          await supabase.from("user_ultra_rares").update({ owned: true, owned_at: new Date().toISOString() }).eq("id", existingUr.id);
          ultraRareUnlocked = ur.id;
        }
      }
    }

    // Discord notification
    try {
      console.log("[DISCORD_DEBUG] Reached card notification. chip=" + cardTemplate?.chip_id + " rarity=" + cardTemplate?.rarity + " ultra=" + ultraRareUnlocked);
      if (ultraRareUnlocked) {
        await notifyDiscord(ultraRareClaimedEmbed({
          username: displayName, chipId: cardTemplate.chip_id,
          perspective: cardTemplate.perspective.name, songTitle: cardTemplate.song.title,
          imageUrl: cardImageUrl = data?.file_url ? encodeURI(data.file_url) : null,
        }));
      } else {
        await notifyDiscord(cardLinkedEmbed({
          username: displayName, chipId: cardTemplate.chip_id,
          perspective: cardTemplate.perspective.name, rarity: cardTemplate.rarity,
          songTitle: cardTemplate.song.title, imageUrl: cardImageUrl = data?.file_url ? encodeURI(data.file_url) : null,
        }));
      }
    } catch (_) {}

    return NextResponse.json({
      message: "Card linked successfully!",
      card: formatCard(cardTemplate),
      setComplete: songPerspectives.size >= 3,
      ultraRareUnlocked,
    });
  } catch (err) {
    console.error("Link card error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function formatCard(template) {
  return {
    chipId: template.chip_id, songId: template.song.id, songTitle: template.song.title,
    songNum: template.song.song_number, perspective: template.perspective.name,
    rarity: template.rarity, type: template.type,
  };
}
