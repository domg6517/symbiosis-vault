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
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

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

    // Find the card template by chip ID
    const { data: cardTemplate, error: findError } = await supabase
      .from("card_templates")
      .select(`
        id,
        chip_id,
        rarity,
        type,
        song:songs (id, title, song_number, type),
        perspective:perspectives (id, name)
      `)
      .eq("chip_id", chipId)
      .single();

    if (findError || !cardTemplate) {
      return NextResponse.json(
        { error: "Card not found. This NFC chip is not registered." },
        { status: 404 }
      );
    }

    // Check if already linked by this user
    const { data: existing } = await supabase
      .from("user_cards")
      .select("id, linked")
      .eq("user_id", user.id)
      .eq("card_template_id", cardTemplate.id)
      .single();

    if (existing && existing.linked) {
      return NextResponse.json(
        { error: "You already have this card linked!", card: formatCard(cardTemplate) },
        { status: 409 }
      );
    }

    // Link the card (upsert - re-link if previously unlinked)
    if (existing) {
      await supabase
        .from("user_cards")
        .update({ linked: true, linked_at: new Date().toISOString(), unlinked_at: null })
        .eq("id", existing.id);
    } else {
      await supabase.from("user_cards").insert({
        user_id: user.id,
        card_template_id: cardTemplate.id,
        linked: true,
      });
    }

    // Check if this completes a set (all 3 perspectives for this song)
    const { data: songCards } = await supabase
      .from("user_cards")
      .select("card_template:card_templates (song_id, perspective_id)")
      .eq("user_id", user.id)
      .eq("linked", true);

    const songPerspectives = new Set();
    songCards?.forEach((c) => {
      if (c.card_template.song_id === cardTemplate.song.id) {
        songPerspectives.add(c.card_template.perspective_id);
      }
    });

    let ultraRareUnlocked = null;

    // If all 3 perspectives collected, unlock ultra rare
    if (songPerspectives.size >= 3 && cardTemplate.type === "single") {
      // Find the ultra rare for this song + perspective
      const ultraRareId = `UR-${cardTemplate.song.song_number}-${cardTemplate.perspective.id}`;

      const { data: ur } = await supabase
        .from("ultra_rares")
        .select("id")
        .eq("id", ultraRareId)
        .single();

      if (ur) {
        // Check if not already owned
        const { data: existingUr } = await supabase
          .from("user_ultra_rares")
          .select("id")
          .eq("user_id", user.id)
          .eq("ultra_rare_id", ur.id)
          .single();

        if (!existingUr) {
          await supabase.from("user_ultra_rares").insert({
            user_id: user.id,
            ultra_rare_id: ur.id,
            owned: true,
            owned_at: new Date().toISOString(),
          });
          ultraRareUnlocked = ur.id;
        }
      }
    }

    return NextResponse.json({
      message: "Card linked successfully!",
      card: formatCard(cardTemplate),
      setComplete: songPerspectives.size >= 3,
      ultraRareUnlocked,
    });
  } catch (err) {
    console.error("Link card error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
