const { createClient } = require('@supabase/supabase-js'); 
require('dotenv').config({ path: '.env.local' }); 
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); 
async function revertNames() { 
  const { data } = await supabase.from('invitations').select('id, full_name').like('full_name', '%Tema Template%'); 
  for (const item of data) { 
    let newName = item.full_name; 
    if (newName.includes('Khitan')) { 
      newName = newName.replace('Tema Template Khitan ', 'Default Theme khitan-'); 
    } else if (newName.includes('Birthday')) { 
      newName = newName.replace('Tema Template Birthday ', 'Default Theme birthday-'); 
    } 
    console.log(`Reverting ${item.id} to ${newName}`); 
    await supabase.from('invitations').update({ full_name: newName }).eq('id', item.id); 
  } 
  console.log("Done");
} 
revertNames();
