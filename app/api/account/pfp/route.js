import { createServerClient } from "../../../../lib/supabase";
import { NextResponse } from "next/server";
import { rateLimit } from "../../../../lib/rateLimit";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request) {
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

    const { allowed } = rateLimit("pfp:" + user.id, 5, 60000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Validate magic bytes (file header) to prevent disguised files
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer).slice(0, 8);
    const isValidImage = isImageMagicBytes(bytes);
    if (!isValidImage) {
      return NextResponse.json(
        { error: "File does not appear to be a valid image." },
        { status: 400 }
      );
    }

    // Upload to Supabase storage
    const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
    const path = user.id + "/pfp." + ext;

    const { error: uploadError } = await supabase.storage
      .from("card-media")
      .upload("avatars/" + path, buffer, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("card-media")
      .getPublicUrl("avatars/" + path);

    const publicUrl = urlData.publicUrl + "?t=" + Date.now();

    // Update user metadata
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { pfp_url: publicUrl },
    });

    // Also update profile table
    await supabase
      .from("profiles")
      .update({ pfp_url: publicUrl })
      .eq("id", user.id);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("PFP upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function isImageMagicBytes(bytes) {
  // JPEG: FF D8 FF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return true;
  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return true;
  // GIF: 47 49 46 38
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return true;
  // WebP: 52 49 46 46 ... 57 45 42 50
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) return true;
  return false;
}
