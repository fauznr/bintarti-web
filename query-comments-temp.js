const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eehktxhhpsdffpwlxghm.supabase.co';
const supabaseAnonKey = 'sb_publishable_t-8eqjZiNsP1Ba8f_4GFIQ_shn4yVX7';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log("=== GUEST COMMENTS ===");
  const { data: comments, error: cErr } = await supabase
    .from('guest_comments')
    .select('id, name, comment, rsvp_status, created_at, invitation_id')
    .order('created_at', { ascending: false })
    .limit(10);

  if (cErr) {
    console.error("Comments error:", cErr);
  } else {
    comments.forEach(c => {
      console.log(`[${c.created_at}] ID: ${c.id} | Name: "${c.name}" | Status: ${c.rsvp_status} | Comment: "${c.comment.substring(0, 40)}" | InvId: ${c.invitation_id}`);
    });
  }

  console.log("\n=== WEBHOOK LOGS (COMPACT) ===");
  const { data: logs, error: lErr } = await supabase
    .from('webhook_logs')
    .select('id, event_type, status, error_message, created_at, payload')
    .order('created_at', { ascending: false })
    .limit(5);

  if (lErr) {
    console.error("Webhook logs error:", lErr);
  } else {
    logs.forEach(l => {
      const p = l.payload || {};
      const author = p.name || p.comment_author || p.author_name || (p.comment_data && p.comment_data.comment_author) || 'N/A';
      const commentVal = p.comment || p.comment_content || (p.comment_data && p.comment_data.comment_content) || 'N/A';
      const slugVal = p.slug || p.post_slug || (p.current_post_data && p.current_post_data.post_name) || 'N/A';
      console.log(`[${l.created_at}] Status: ${l.status} | Err: ${l.error_message} | Author: "${author}" | Slug: "${slugVal}" | Comment: "${commentVal.substring(0, 40)}"`);
    });
  }
}

main();
