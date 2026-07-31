require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function cleanActivities() {
  const { data, error } = await supabase.from('invitations').select('layout_config').eq('id', 'aqiqah-1').single();
  if (error || !data) {
    console.error('Error fetching aqiqah-1:', error);
    return;
  }

  const layoutConfig = data.layout_config || {};
  if (layoutConfig.activities) {
    delete layoutConfig.activities.headerText;
    delete layoutConfig.activities.bodyText;
    delete layoutConfig.activities.bottomText;
  }

  const { error: updateError } = await supabase
    .from('invitations')
    .update({ layout_config: layoutConfig })
    .eq('id', 'aqiqah-1');

  if (updateError) {
    console.error('Error updating aqiqah-1 activities in DB:', updateError);
  } else {
    console.log('Successfully cleaned aqiqah-1 activities config in Supabase!');
  }
}

cleanActivities();
