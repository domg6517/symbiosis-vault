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

    // Find card template
    const { data: cardTemplate } = await supabase
      .from("card_templates")
      .select("id")
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
