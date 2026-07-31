import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = Object.fromEntries(envContent.split('\n').map(line => line.split('=').map(str => str.trim())));

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || "https://eehktxhhpsdffpwlxghm.supabase.co";
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: invitations, error } = await supabase.from('invitations').select('id, link_undangan, link_tamu');
  
  if (error) {
    console.error(error);
    return;
  }
  
  for (const inv of invitations) {
    let newLinkUndangan = inv.link_undangan || `https://bintarti.store/${inv.id}`;
    let newLinkTamu = inv.link_tamu || `https://bintarti.store/${inv.id}?to=`;
    
    if (newLinkUndangan.includes('/sandbox-tema/')) {
        newLinkUndangan = newLinkUndangan.replace('/sandbox-tema/', '/');
    }
    if (newLinkTamu.includes('/sandbox-tema/')) {
        newLinkTamu = newLinkTamu.replace('/sandbox-tema/', '/');
    }
    
    if (newLinkUndangan !== inv.link_undangan || newLinkTamu !== inv.link_tamu) {
        console.log(`Updating ${inv.id}: ${newLinkUndangan}`);
        await supabase.from('invitations').update({
            link_undangan: newLinkUndangan,
            link_tamu: newLinkTamu
        }).eq('id', inv.id);
    }
  }
  console.log("Done");
}

run();
