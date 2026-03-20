import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const supabase = createServerClient();
    // Update Sample A song_number to 00A
    const { error: e1 } = await supabase.from("songs").update({ song_number: "00A" }).eq("title", "Sample A");
    // Verify Sample B is 00B
    const { error: e2 } = await supabase.from("songs").update({ song_number: "00B" }).eq("title", "Sample B");
    // List all songs
    const { data: songs } = await supabase.from("songs").select("id, title, song_number").order("id");
    // List Sample B card_templates to verify
    const { data: cards } = await supabase.from("card_templates").select("id, chip_id, rarity, perspective:perspectives(name)").eq("song_id", 34).order("id");
    return NextResponse.json({ songs: songs?.slice(0, 5), sampleBCards: cards?.length, e1: e1?.message, e2: e2?.message });
  } catch(err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}