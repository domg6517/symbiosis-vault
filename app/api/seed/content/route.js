import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const supabase = createServerClient();

    // Get Supabase URL for storage paths
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Chip ID to image number mapping
    const chipToImage = {
      "d8edd2cf489196a379821b28b8245ab2": "1.png",
      "4c05f9b748bb04c0c7a36cd25d7c8a5e": "2.png",
      "fd1a74b54f83842a6ba1b8285c0fd972": "3.png",
      "93511eda191337dd38c447cdd87bc013": "4.png",
      "97ed127ea8b7b849fff710b090da17f5": "5.png",
      "fccaadb12c04885874ec3933667d608e": "6.png",
      "bf49e5bda3196d82ddce4bde6462ace9": "7.png",
      "33af3d3d41387ff0260d5603361d5dd2": "8.png",
      "33259f0c401008c65d706c749b43ea6e": "9.png",
      "20b89314e50ce1a6ee221a763315c7b6": "10.png",
      "1507bf47ad7cd7c85eacf7f6f228f5f4": "11.png",
      "59858463c274f84c786c68212bd515f1": "12.png",
      "c470d3132a118a5e6443d363c8350c22": "13.png",
      "ad7f4829dec3839425072a75fd536a87": "14.png",
      "7365faa7a563d7431ce07dc5d90dad67": "15.png",
    };

    // Get all Sample B card_templates
    const { data: cards, error: cardsErr } = await supabase
      .from("card_templates")
      .select("id, chip_id")
      .in("chip_id", Object.keys(chipToImage));

    if (cardsErr || !cards || cards.length === 0) {
      return NextResponse.json({ error: "No Sample B cards found", detail: cardsErr?.message }, { status: 500 });
    }

    const audioUrl = supabaseUrl + "/storage/v1/object/public/card-media/sample-b/test_snippet sample B.mp3";
    const rows = [];

    for (const card of cards) {
      const imgFile = chipToImage[card.chip_id];
      if (!imgFile) continue;

      const imageUrl = supabaseUrl + "/storage/v1/object/public/card-media/sample-b/" + imgFile;

      // Image content
      rows.push({
        card_template_id: card.id,
        content_type: "image",
        file_url: imageUrl,
      });

      // Audio content
      rows.push({
        card_template_id: card.id,
        content_type: "audio",
        file_url: audioUrl,
      });
    }

    const { data: inserted, error: insertErr } = await supabase
      .from("card_content")
      .upsert(rows, { onConflict: "card_template_id,content_type" })
      .select("id, card_template_id, content_type");

    if (insertErr) {
      return NextResponse.json({ error: "Insert failed", detail: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      cardsFound: cards.length,
      contentInserted: inserted ? inserted.length : 0,
      audioUrl,
      sampleImageUrl: supabaseUrl + "/storage/v1/object/public/card-media/sample-b/1.png",
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
