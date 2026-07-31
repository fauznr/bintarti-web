const fs = require('fs');
const path = require('path');

const transcriptPath = 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\67233b6e-edc7-47f5-bb69-c9cc23439e69\\.system_generated\\logs\\transcript_full.jsonl';
console.log('Reading transcript from:', transcriptPath);

if (!fs.existsSync(transcriptPath)) {
  console.error('Transcript file does not exist!');
  process.exit(1);
}

const fileContent = fs.readFileSync(transcriptPath, 'utf8');
const lines = fileContent.split('\n');
console.log('Total lines in transcript:', lines.length);

for (let i = lines.length - 1; i >= 0; i--) {
  const line = lines[i].trim();
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT' || obj.source === 'USER_EXPLICIT') {
      const contentStr = typeof obj.content === 'string' ? obj.content : JSON.stringify(obj.content || obj);
      if (contentStr.includes('data:image/jpeg;base64')) {
        console.log('Found actual user input line:', i, 'source:', obj.source, 'type:', obj.type);
        
        // Find the base64 string
        const match = contentStr.match(/data:image\/jpeg;base64,([a-zA-Z0-9+/\\=]+)/);
        if (match) {
          const b64 = match[1].replace(/\\/g, ''); // Remove JSON escapes
          console.log('Base64 length:', b64.length);
          console.log('First 50 chars: ' + b64.slice(0, 50));
          console.log('Ends with: ...' + b64.slice(-100));
          
          // Let's decode and write to temp file
          const buf = Buffer.from(b64, 'base64');
          console.log('Decoded buffer length:', buf.length);
          console.log('Decoded buffer last 4 bytes:', buf.slice(-4).toString('hex').toUpperCase());
          
          fs.writeFileSync('temp_extracted.jpg', buf);
          console.log('Wrote to temp_extracted.jpg');
          break;
        }
      }
    }
  } catch (e) {
    // Ignore parse errors for empty/malformed lines
  }
}
