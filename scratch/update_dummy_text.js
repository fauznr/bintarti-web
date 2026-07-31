const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Replace name
content = content.replace(
  /const childFullName = \(invitationData && invitationData\.full_name\) \? invitationData\.full_name : \(\(isKhitan \|\| isAqiqah\) \? "Saka Niskala"/g,
  'const childFullName = (invitationData && invitationData.full_name) ? invitationData.full_name : (isAqiqah ? "Alesha Zahra" : isKhitan ? "Saka Niskala"'
);

// Replace parents
content = content.replace(
  /const parentsName = \(invitationData && invitationData\.parents_name\) \? invitationData\.parents_name : \(\(isKhitan \|\| isAqiqah\) \? "Bapak Adrian Mahendra & Ibu Natasha Salsabila"/g,
  'const parentsName = (invitationData && invitationData.parents_name) ? invitationData.parents_name : (isAqiqah ? "Bapak Budi Santoso & Ibu Ratna Sari" : isKhitan ? "Bapak Adrian Mahendra & Ibu Natasha Salsabila"'
);

// Replace nickname
content = content.replace(
  /const childNickname = \(invitationData && invitationData\.nickname\) \? invitationData\.nickname : \(\(isKhitan \|\| isAqiqah\) \? "Saka"/g,
  'const childNickname = (invitationData && invitationData.nickname) ? invitationData.nickname : (isAqiqah ? "Alesha" : isKhitan ? "Saka"'
);

// Replace location
content = content.replace(
  /const eventLocationStr = \(invitationData && invitationData\.event_location\) \? invitationData\.event_location : "Pranaya Java Hotel Bandung";/g,
  'const eventLocationStr = (invitationData && invitationData.event_location) ? invitationData.event_location : (isAqiqah ? "Kediaman Bapak Budi, Jl. Merdeka No. 10, Jakarta" : "Pranaya Java Hotel Bandung");'
);

// We should also replace the closing parents text if it falls back to a hardcoded Khitan one.
// Wait, the JSON config for Aqiqah closing has:
// "parentsText": "Kel. Bapak Adrian Mahendra & Ibu Natasha Salsabila."
// I should update it in the config we just replaced!

fs.writeFileSync(pageFile, content);
console.log("Replaced dummy text logic");
