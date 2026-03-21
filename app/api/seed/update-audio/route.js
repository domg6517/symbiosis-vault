import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const supabase = createServerClient();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const oldAudio = supabaseUrl + "/storage/v1/object/public/card-media/sample-b/Test_Snippet_SampleB_Final.MP3";
    const newAudio = supabaseUrl + "/storage/v1/object/public/card-media/sample-b/Test_Snippet_SampleB_Final.mp3";
    const { data, error } = await supabase
      .from("card_content")
      .update({ file_url: newAudio })
      .eq("content_type", "audio")
      .eq("file_url", oldAudio)
      .select("id");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, rowsUpdated: data ? data.length : 0, newAudio });
  } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}