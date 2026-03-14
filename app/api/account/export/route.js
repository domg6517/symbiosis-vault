import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";
import { rateLimit } from "../../../../lib/rateLimit";

export async function GET(request) {
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

    // Rate limit: 2 exports per hour per user
    const { allowed } = rateLimit("export:" + user.id, 2, 3600000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Export limit reached. Please try again in an hour." },
        { status: 429 }
      );
    }

    const userId = user.id;

    // Gather all user data in parallel
    const [profileRes, cardsRes, badgesRes, ultraRaresRes, activityRes, termsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("user_cards").select("*, card_template:card_templates (chip_id, rarity, type, song:songs (title, song_number), perspective:perspectives (name))").eq("user_id", userId),
      supabase.from("user_badges").select("awarded_at, badge:badges (slug, label, description)").eq("user_id", userId),
      supabase.from("user_ultra_rares").select("*, ultra_rare:ultra_rares (id)").eq("user_id", userId),
      supabase.from("activity_feed").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(500),
      supabase.from("terms_acceptance_log").select("terms_version, accepted_at").eq("user_id", userId),
    ]);

    const exportData = {
      export_info: {
        exported_at: new Date().toISOString(),
        format: "JSON (GDPR Article 20 compliant)",
        service: "Symbiosis Vault",
        operator: "Jack & Jack LLC",
      },
      account: {
        id: userId,
        email: user.email,
        email_verified: !!user.email_confirmed_at,
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at,
      },
      profile: profileRes.data || {},
      collection: {
        cards: (cardsRes.data || []).map((c) => ({
          linked: c.linked,
          linked_at: c.linked_at,
          unlinked_at: c.unlinked_at,
          chip_id: c.card_template?.chip_id,
          song: c.card_template?.song?.title,
          song_number: c.card_template?.song?.song_number,
          perspective: c.card_template?.perspective?.name,
          rarity: c.card_template?.rarity,
          type: c.card_template?.type,
        })),
        badges: (badgesRes.data || []).map((b) => ({
          badge: b.badge?.slug,
          label: b.badge?.label,
          description: b.badge?.description,
          awarded_at: b.awarded_at,
        })),
        ultra_rares: (ultraRaresRes.data || []).map((u) => ({
          ultra_rare_id: u.ultra_rare?.id,
          owned: u.owned,
          owned_at: u.owned_at,
        })),
      },
      activity_history: (activityRes.data || []).map((a) => ({
        event_type: a.event_type,
        card_chip_id: a.card_chip_id,
        card_perspective: a.card_perspective,
        card_rarity: a.card_rarity,
        card_song_title: a.card_song_title,
        created_at: a.created_at,
      })),
      terms_accepted: termsRes.data || [],
    };

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=symbiosis-vault-data-export.json",
      },
    });
  } catch (err) {
    console.error("Data export error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
