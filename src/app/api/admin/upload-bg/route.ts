import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";

export const dynamic = "force-dynamic";

import { uploadBase64ToStorage } from "../../../../utils/storage";
import { validateSession } from "../../../../utils/auth";


export async function POST(request: Request) {
  if (!(await validateSession(request))) {
    return NextResponse.json({ error: "Unauthorized. Invalid PIN." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { base64Data, invitationId, section } = body;

    if (!base64Data || !invitationId || !section) {
      return NextResponse.json({ error: "Missing required fields: base64Data, invitationId, and section are required" }, { status: 400 });
    }

    // Determine extension from base64 MIME type
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let ext = "jpg";
    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime === "image/png") ext = "png";
      else if (mime === "image/webp") ext = "webp";
      else if (mime === "image/gif") ext = "gif";
    }

    const timestamp = Date.now();
    const fileName = `bg_${section}_${timestamp}.${ext}`;

    console.log(`Uploading background image for invitation ${invitationId}, section ${section} as ${fileName}...`);
    const publicUrl = await uploadBase64ToStorage(base64Data, invitationId, fileName);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error: any) {
    console.error("Error uploading background image:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
