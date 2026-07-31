const fs = require('fs');
const content = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/brain/f2bc865c-cef5-4bf6-b59b-f58fb2b098e4/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');
content.forEach((l, i) => {
  if (l.includes('supabase.from') && l.includes('invitations') && !l.includes('search_transcript') && i > 13000) {
    if (l.includes('console.log') || l.includes('select')) {
      console.log(`Step ${i}: ` + l.substring(0, 200));
    }
  }
});
