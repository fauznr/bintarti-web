import { supabase } from "./supabase";

let bucketChecked = false;

export async function uploadBase64ToStorage(
  base64Data: string,
  invitationId: string,
  fileName: string
): Promise<string> {
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 format");
  }
  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], "base64");

  if (!bucketChecked) {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const hasBucket = buckets?.some((b) => b.name === "invitation-assets");
      if (!hasBucket) {
        await supabase.storage.createBucket("invitation-assets", {
          public: true,
        });
      }
      bucketChecked = true;
    } catch (err) {
      console.log("Bucket check/creation failed or skipped:", err);
    }
  }

  const path = `${invitationId}/${fileName}`;
  const { error } = await supabase.storage
    .from("invitation-assets")
    .upload(path, buffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    console.error("Storage upload error:", error);
    throw new Error(error.message);
  }

  const { data: { publicUrl } } = supabase.storage
    .from("invitation-assets")
    .getPublicUrl(path);

  return publicUrl;
}
