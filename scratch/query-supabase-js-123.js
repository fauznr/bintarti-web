const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eehktxhhpsdffpwlxghm.supabase.co';
const supabaseAnonKey = 'sb_publishable_t-8eqjZiNsP1Ba8f_4GFIQ_shn4yVX7';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log("Querying invitations where full_name contains '123'...");
  const { data, error } = await supabase
    .from('invitations')
    .select('id, full_name, type, status')
    .ilike('full_name', '%123%');

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  console.log("Result rows:", JSON.stringify(data, null, 2));
}

main();
