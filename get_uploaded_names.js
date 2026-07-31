const fs = require('fs');

const transcriptPath = 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\67233b6e-edc7-47f5-bb69-c9cc23439e69\\.system_generated\\logs\\transcript_full.jsonl';

if (!fs.existsSync(transcriptPath)) {
  console.error('Transcript file does not exist!');
  process.exit(1);
}

const fileContent = fs.readFileSync(transcriptPath, 'utf8');
const lines = fileContent.split('\n');

// Let's print the last few lines before 9782 to see the user input structure
const start = Math.max(0, lines.length - 20);
for (let i = start; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    console.log(`Line ${i}: type=${obj.type}, source=${obj.source}`);
    if (obj.type === 'USER_INPUT') {
      console.log(JSON.stringify(obj, null, 2));
    }
  } catch (e) {
    console.log(`Line ${i}: (failed to parse) ${line.substring(0, 100)}`);
  }
}
