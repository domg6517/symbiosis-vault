import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";
import { rateLimit } from "../../../../lib/rateLimit";

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
      const { data: alreadyLinked } = await supabase
        .from("user_cards")
        .select("id, user_id")
        .eq("card_template_id", cardTemplate.id)
        .eq("linked", true)
        .single();

      if (alreadyLinked && alreadyLinked.user_id !== user.id) {
        return NextResponse.json(
          { error: "This card is connected to another account.", card: formatCard(cardTemplate) },
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
        return NextResponse.json({ error: "Already collected!", card: formatCard(cardTemplate) }, { status: 409 });
      }

      if (existing) {
        await supabase.from("user_cards").update({ linked: true, linked_at: new Date().toISOString(), unlinked_at: null }).eq("id", existing.id);
      } else {
        await supabase.from("user_cards").insert({ user_id: user.id, card_template_id: cardTemplate.id, linked: true });
      }

      try { await supabase.rpc("recalculate_badges", { p_user_id: user.id }); } catch (e) {}

      try {
        let displayName = "Collector";
        const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
        if (profile?.username) displayName = profile.username;
        await supabase.from("activity_feed").insert({
          user_id: user.id, event_type: "card_linked",
          card_chip_id: cardTemplate.chip_id, card_perspective: cardTemplate.perspective.name,
          card_rarity: cardTemplate.rarity, card_type: cardTemplate.type,
          card_song_title: cardTemplate.song.title, display_name: displayName,
        });
      } catch (e) {}

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
        message: "Card linked successfully!",
        card: formatCard(cardTemplate),
        setComplete: songPerspectives.size >= 3,
        cardType: "regular",
      });
    }

    // --- Try ultra_rares (1/1 chips) ---
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

    try { await supabase.rpc("recalculate_badges", { p_user_id: user.id }); } catch (e) {}

    try {
      let displayName = "Collector";
      const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
      if (profile?.username) displayName = profile.username;
      await supabase.from("activity_feed").insert({
        user_id: user.id, event_type: "card_linked",
        card_chip_id: chipId, card_perspective: ultraRare.perspective.name,
        card_rarity: "super_rare", card_type: "ultra_rare",
        card_song_title: ultraRare.song.title, display_name: displayName,
      });
    } catch (e) {}

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
