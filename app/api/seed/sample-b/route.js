import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const supabase = createServerClient();

    // 1. Get or create the song
    const { data: existingSong } = await supabase
      .from("songs")
      .select("id")
      .eq("title", "Sample B")
      .single();

    let songId;
    if (existingSong) {
      // Update song_number to 00B
      await supabase.from("songs").update({ song_number: "00B" }).eq("id", existingSong.id);
      songId = existingSong.id;
    } else {
      const { data: newSong, error: songErr } = await supabase
        .from("songs")
        .insert({ title: "Sample B", song_number: "00B", type: "single" })
        .select("id")
        .single();
      if (songErr) return NextResponse.json({ error: "Song insert failed", detail: songErr.message }, { status: 500 });
      songId = newSong.id;
    }

    // 2. Get perspective IDs
    const { data: perspectives } = await supabase.from("perspectives").select("id, name");
    if (!perspectives || perspectives.length === 0) {
      return NextResponse.json({ error: "No perspectives found" }, { status: 500 });
    }
    const perspMap = {};
    for (const p of perspectives) { perspMap[p.name] = p.id; }

    const jjId = perspMap["J&J"] || perspMap["Jack & Jack"];
    const jackJId = perspMap["Jack J"];
    const jackGId = perspMap["Jack G"];

    if (!jjId || !jackJId || !jackGId) {
      return NextResponse.json({ error: "Missing perspectives", perspMap }, { status: 500 });
    }

    // 3. Define 15 cards
    const cards = [
      { chip_id: "d8edd2cf489196a379821b28b8245ab2", rarity: "rare", perspective_id: jjId },
      { chip_id: "4c05f9b748bb04c0c7a36cd25d7c8a5e", rarity: "rare", perspective_id: jackJId },
      { chip_id: "fd1a74b54f83842a6ba1b8285c0fd972", rarity: "rare", perspective_id: jackGId },
      { chip_id: "93511eda191337dd38c447cdd87bc013", rarity: "common", perspective_id: jackJId },
      { chip_id: "97ed127ea8b7b849fff710b090da17f5", rarity: "common", perspective_id: jackJId },
      { chip_id: "fccaadb12c04885874ec3933667d608e", rarity: "common", perspective_id: jackJId },
      { chip_id: "bf49e5bda3196d82ddce4bde6462ace9", rarity: "common", perspective_id: jackJId },
      { chip_id: "33af3d3d41387ff0260d5603361d5dd2", rarity: "common", perspective_id: jackGId },
      { chip_id: "33259f0c401008c65d706c749b43ea6e", rarity: "common", perspective_id: jackGId },
      { chip_id: "20b89314e50ce1a6ee221a763315c7b6", rarity: "common", perspective_id: jackGId },
      { chip_id: "1507bf47ad7cd7c85eacf7f6f228f5f4", rarity: "common", perspective_id: jackGId },
      { chip_id: "59858463c274f84c786c68212bd515f1", rarity: "common", perspective_id: jjId },
      { chip_id: "c470d3132a118a5e6443d363c8350c22", rarity: "common", perspective_id: jjId },
      { chip_id: "ad7f4829dec3839425072a75fd536a87", rarity: "common", perspective_id: jjId },
      { chip_id: "7365faa7a563d7431ce07dc5d90dad67", rarity: "common", perspective_id: jjId },
    ];

    // 4. Insert card_templates
    const rows = cards.map(c => ({
      chip_id: c.chip_id,
      rarity: c.rarity,
      type: "single",
      song_id: songId,
      perspective_id: c.perspective_id,
    }));

    const { data: inserted, error: insertErr } = await supabase
      .from("card_templates")
      .upsert(rows, { onConflict: "chip_id" })
      .select("id, chip_id, rarity");

    if (insertErr) {
      return NextResponse.json({ error: "Card insert failed", detail: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      songId,
      perspectives: perspMap,
      cardsInserted: inserted ? inserted.length : 0,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
