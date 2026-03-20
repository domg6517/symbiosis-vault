import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const supabase = createServerClient();
    const { filename, base64, contentType } = await request.json();
    
    if (!filename || !base64) {
      return NextResponse.json({ error: "filename and base64 required" }, { status: 400 });
    }
    
    // Decode base64 to buffer
    const buffer = Buffer.from(base64, "base64");
    
    // Upload to card-media bucket
    const { data, error } = await supabase.storage
      .from("card-media")
      .upload("sample-b/" + filename, buffer, {
        contentType: contentType || "image/png",
        upsert: true
      });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from("card-media")
      .getPublicUrl("sample-b/" + filename);
    
    return NextResponse.json({ success: true, path: data.path, url: urlData.publicUrl });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
