import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Initialize Supabase admin client with service role key for bypassing RLS if needed
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const folder = url.searchParams.get("folder");

    if (folder) {
      // List files inside a specific folder
      const { data, error } = await supabaseAdmin.storage
        .from("invitation-assets")
        .list(folder, {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;
      
      // Get public URLs for each file
      const filesWithUrls = data
        .filter(file => file.id) // Only real files
        .map(file => {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from("invitation-assets")
            .getPublicUrl(`${folder}/${file.name}`);
          
          return {
            ...file,
            publicUrl,
            folderPath: folder
          };
        });

      return NextResponse.json(filesWithUrls);
    } else {
      // List all folders in the bucket root
      const { data, error } = await supabaseAdmin.storage
        .from("invitation-assets")
        .list("", {
          limit: 1000,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) throw error;

      // Filter out real files at root, keep only folders (which have id = null)
      const folders = data.filter(item => !item.id && item.name !== ".emptyFolderPlaceholder");

      return NextResponse.json(folders);
    }
  } catch (error: any) {
    console.error("Error fetching media:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, folder, folderPath } = body;

    if (folder && folderPath) {
      if (folderPath.startsWith("templates/") || folderPath === "templates") {
        return NextResponse.json({ error: "Cannot delete local template assets from Media Manager." }, { status: 403 });
      }
      // List all files in folder
      const { data, error } = await supabaseAdmin.storage
        .from("invitation-assets")
        .list(folderPath, { limit: 1000 });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const filesToRemove = data.map(f => `${folderPath}/${f.name}`);
        if (filesToRemove.length > 0) {
          const { error: removeError } = await supabaseAdmin.storage
            .from("invitation-assets")
            .remove(filesToRemove);
          if (removeError) throw removeError;
        }
      }
      return NextResponse.json({ success: true, message: "Folder deleted successfully" });
    }

    if (!path) {
      return NextResponse.json({ error: "File path or folder info is required" }, { status: 400 });
    }

    if (path.startsWith("templates/")) {
      return NextResponse.json({ error: "Cannot delete local template assets from Media Manager." }, { status: 403 });
    }

    const { error } = await supabaseAdmin.storage
      .from("invitation-assets")
      .remove([path]);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "File deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting media:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
