
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function deleteAllMedia() {
  console.log("Starting deletion of all media in 'invitation-assets' bucket...");
  
  let deletedCount = 0;
  
  // 1. Get all folders/files at root
  const { data: rootItems, error: rootError } = await supabase.storage
    .from("invitation-assets")
    .list("", { limit: 1000 });
    
  if (rootError) {
    console.error("Error listing root:", rootError);
    return;
  }
  
  console.log(`Found ${rootItems.length} items at root.`);

  for (const item of rootItems) {
    if (!item.id) {
      // It's a folder
      const folderName = item.name;
      console.log(`Scanning folder: ${folderName}`);
      
      const { data: files, error: filesError } = await supabase.storage
        .from("invitation-assets")
        .list(folderName, { limit: 1000 });
        
      if (filesError) {
        console.error(`Error listing folder ${folderName}:`, filesError);
        continue;
      }
      
      if (files.length > 0) {
        const filePaths = files.filter(f => f.id).map(f => `${folderName}/${f.name}`);
        if (filePaths.length > 0) {
          const { error: deleteError } = await supabase.storage
            .from("invitation-assets")
            .remove(filePaths);
            
          if (deleteError) {
            console.error(`Error deleting files in ${folderName}:`, deleteError);
          } else {
            console.log(`Deleted ${filePaths.length} files in ${folderName}`);
            deletedCount += filePaths.length;
          }
        }
      }
    } else {
      // It's a file at root
      const { error: deleteError } = await supabase.storage
        .from("invitation-assets")
        .remove([item.name]);
      if (deleteError) {
        console.error(`Error deleting root file ${item.name}:`, deleteError);
      } else {
        console.log(`Deleted root file ${item.name}`);
        deletedCount++;
      }
    }
  }
  
  console.log(`\nFinished! Successfully deleted ${deletedCount} files.`);
}

deleteAllMedia();
