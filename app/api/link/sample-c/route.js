import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";
import { rateLimit } from "../../../../lib/rateLimit";
import { notifyDiscord, cardLinkedEmbed, ultraRareClaimedEmbed, badgeEarnedEmbed } from "../../../../lib/discord";

export const dynamic = "force-dynamic";

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

    // --- Try regular card_templates first ---
    const { data: cardTemplate } = await supabase
      .from("card_templates")
      .select("id, chip_id, rarity, type, song:songs(id, title, song_number, type), perspective:perspectives(id, name)")
      .eq("chip_id", chipId)
      .single();

    if (cardTemplate) {
      const isUltra = cardTemplate.rarity === "ultra_rare";

      const { data: alreadyLinked } = await supabase
        .from("user_cards")
        .select("id, user_id")
        .eq("card_template_id", cardTemplate.id)
        .eq("linked", true)
        .single();

      if (alreadyLinked && alreadyLinked.user_id !== user.id) {
        return NextResponse.json(
          { error: isUltra ? "This 1/1 belongs to another collector." : "This card is connected to another account.", card: formatCard(cardTemplate) },
          { status: 409 }
        );
      }

      const { data: existing } = await supabase
        .from("user_cards")
        .select("id, linked")
        .eq("user_id", user.id)
        .eq("card_template_id", cardTemplate.id)
        .single();

      if (existing?.linked) {
        return NextResponse.json({ error: isUltra ? "You already own this 1/1!" : "Already collected!", card: formatCard(cardTemplate) }, { status: 409 });
      }

      if (existing) {
        await supabase.from("user_cards").update({ linked: true, linked_at: new Date().toISOString(), unlinked_at: null }).eq("id", existing.id);
      } else {
        await supabase.from("user_cards").insert({ user_id: user.id, card_template_id: cardTemplate.id, linked: true });
      }

      // Fetch display name (used by both activity feed and Discord)
      let displayName = "Collector";
      try {
        const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
        if (profile?.username) displayName = profile.username;
      } catch (_) {}

      // Badge diff: snapshot before, recalculate, snapshot after, find new ones
      let badgesBefore = [];
      try {
        const { data } = await supabase.from("user_badges").select("badge_id").eq("user_id", user.id);
        badgesBefore = (data || []).map((b) => b.badge_id);
      } catch (_) {}

      try { await supabase.rpc("recalculate_badges", { p_user_id: user.id }); } catch (e) {}

      try {
        const { data: badgesAfter } = await supabase
          .from("user_badges")
          .select("badge_id, badge:badges(icon, label)")
          .eq("user_id", user.id);
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
      } catch (_) {}

      // Discord notification
      try {
        if (isUltra) {
          await notifyDiscord(ultraRareClaimedEmbed({
            username: displayName, chipId: cardTemplate.chip_id,
            perspective: cardTemplate.perspective.name, songTitle: cardTemplate.song.title,
          }));
        } else {
          await notifyDiscord(cardLinkedEmbed({
            username: displayName, chipId: cardTemplate.chip_id,
            perspective: cardTemplate.perspective.name,
            rarity: cardTemplate.rarity, songTitle: cardTemplate.song.title,
          }));
        }
      } catch (_) {}

      const { data: songCards } = await supabase
        .from("user_cards")
        .select("card_template:card_templates(song_id, perspective_id)")
        .eq("user_id", user.id)
        .eq("linked", true);
      const songPerspectives = new Set();
      songCards?.forEach((c) => {
        if (c.card_template.song_id === cardTemplate.song.id) songPerspectives.add(c.card_template.perspective_id);
      });

      return NextResponse.json({
        message: isUltra ? "1/1 claimed!" : "Card linked successfully!",
        card: formatCard(cardTemplate),
        setComplete: songPerspectives.size >= 3,
        cardType: isUltra ? "ultra_rare" : "regular",
      });
    }

    // --- Try ultra_rares (1/1 chips not in card_templates) ---
    const { data: ultraRare } = await supabase
      .from("ultra_rares")
      .select("id, song_id, perspective_id, image_url, song:songs(id, title, song_number), perspective:perspectives(id, name)")
      .eq("chip_id", chipId)
      .single();

    if (!ultraRare) {
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      rateLimit("chip-miss:" + ip, 5, 300000);
      return NextResponse.json({ error: "Card not found. This NFC chip is not registered." }, { status: 404 });
    }

    const { data: existingOwner } = await supabase
      .from("user_ultra_rares")
      .select("id, user_id, owned")
      .eq("ultra_rare_id", ultraRare.id)
      .eq("owned", true)
      .single();

    if (existingOwner && existingOwner.user_id !== user.id) {
      let ownerName = "another collector";
      const { data: ownerProfile } = await supabase.from("profiles").select("username, display_name").eq("id", existingOwner.user_id).single();
      if (ownerProfile?.display_name) ownerName = ownerProfile.display_name;
      else if (ownerProfile?.username) ownerName = ownerProfile.username;
      return NextResponse.json(
        { error: "This 1/1 is already claimed.", ownerName, card: formatUltraRare(ultraRare) },
        { status: 409 }
      );
    }

    if (existingOwner && existingOwner.user_id === user.id) {
      return NextResponse.json({ error: "You already own this 1/1!", card: formatUltraRare(ultraRare) }, { status: 409 });
    }

    const { data: existingRow } = await supabase
      .from("user_ultra_rares")
      .select("id")
      .eq("user_id", user.id)
      .eq("ultra_rare_id", ultraRare.id)
      .single();

    if (existingRow) {
      await supabase.from("user_ultra_rares").update({ owned: true, owned_at: new Date().toISOString() }).eq("id", existingRow.id);
    } else {
      await supabase.from("user_ultra_rares").insert({ user_id: user.id, ultra_rare_id: ultraRare.id, owned: true, owned_at: new Date().toISOString() });
    }

    // Fetch display name
    let displayNameUR = "Collector";
    try {
      const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
      if (profile?.username) displayNameUR = profile.username;
    } catch (_) {}

    // Badge diff for ultra_rares path
    let badgesBeforeUR = [];
    try {
      const { data } = await supabase.from("user_badges").select("badge_id").eq("user_id", user.id);
      badgesBeforeUR = (data || []).map((b) => b.badge_id);
    } catch (_) {}

    try { await supabase.rpc("recalculate_badges", { p_user_id: user.id }); } catch (e) {}

    try {
      const { data: badgesAfterUR } = await supabase
        .from("user_badges")
        .select("badge_id, badge:badges(icon, label)")
        .eq("user_id", user.id);
      const newBadgesUR = (badgesAfterUR || []).filter((b) => !badgesBeforeUR.includes(b.badge_id));
      for (const b of newBadgesUR) {
        await notifyDiscord(badgeEarnedEmbed({ username: displayNameUR, badgeIcon: b.badge.icon, badgeLabel: b.badge.label }));
      }
    } catch (_) {}

    // Activity feed
    try {
      await supabase.from("activity_feed").insert({
        user_id: user.id, event_type: "card_linked",
        card_chip_id: chipId, card_perspective: ultraRare.perspective.name,
        card_rarity: "super_rare", card_type: "ultra_rare",
        card_song_title: ultraRare.song.title, display_name: displayNameUR,
      });
    } catch (_) {}

    // Discord — ultra rare notification
    try {
      await notifyDiscord(ultraRareClaimedEmbed({
        username: displayNameUR, chipId,
        perspective: ultraRare.perspective.name, songTitle: ultraRare.song.title,
      }));
    } catch (_) {}

    return NextResponse.json({
      message: "1/1 claimed!",
      card: formatUltraRare(ultraRare),
      cardType: "ultra_rare",
    });
  } catch (err) {
    console.error("Sample C link error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function formatCard(template) {
  return {
    chipId: template.chip_id,
    songId: template.song.id,
    songTitle: template.song.title,
    songNum: template.song.song_number,
    perspective: template.perspective.name,
    rarity: template.rarity,
    type: template.type,
  };
}

function formatUltraRare(ur) {
  return {
    id: ur.id,
    songId: ur.song.id,
    songTitle: ur.song.title,
    songNum: ur.song.song_number,
    perspective: ur.perspective.name,
    rarity: "super_rare",
    type: "ultra_rare",
    imageUrl: ur.image_url,
  };
}
