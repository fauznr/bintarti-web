require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function cleanAqiqah1() {
  // 1. Fetch current aqiqah-1 row
  const { data, error } = await supabase.from('invitations').select('*').eq('id', 'aqiqah-1').single();
  if (error || !data) {
    console.error('Error fetching aqiqah-1:', error);
    return;
  }

  const layoutConfig = data.layout_config || {};
  if (layoutConfig.closing) {
    // Delete stale parentsText override in closing so it dynamically uses parentsName
    delete layoutConfig.closing.parentsText;
  }
  if (layoutConfig.profile) {
    delete layoutConfig.profile.parentsText;
  }

  // Update parents_name in DB to Bapak Adrian Mahendra & Ibu Natasha Salsabila if empty
  const parentsName = "Bapak Adrian Mahendra & Ibu Natasha Salsabila";

  const { error: updateError } = await supabase
    .from('invitations')
    .update({ 
      parents_name: parentsName,
      layout_config: layoutConfig 
    })
    .eq('id', 'aqiqah-1');

  if (updateError) {
    console.error('Error updating aqiqah-1 in DB:', updateError);
  } else {
    console.log('Successfully cleaned aqiqah-1 layout_config parentsText in Supabase!');
  }
}

cleanAqiqah1();
