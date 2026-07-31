const { createClient } = require('@supabase/supabase-js'); 
require('dotenv').config({ path: '.env.local' }); 
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); 
async function updateNames() { 
  const { data } = await supabase.from('invitations').select('id, full_name').like('full_name', '%Default Theme%'); 
  for (const item of data) { 
    let newName = item.full_name; 
    if (newName.includes('khitan-')) { 
      newName = newName.replace('Default Theme khitan-', 'Tema Template Khitan '); 
    } else if (newName.includes('birthday-')) { 
      newName = newName.replace('Default Theme birthday-', 'Tema Template Birthday '); 
    } 
    console.log(`Renaming ${item.id} to ${newName}`); 
    await supabase.from('invitations').update({ full_name: newName }).eq('id', item.id); 
  } 
  console.log("Done");
} 
updateNames();
