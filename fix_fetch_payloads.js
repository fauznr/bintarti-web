const fs = require('fs');

// Fix Wedding4View.tsx
let w4 = fs.readFileSync('src/components/wedding/Wedding4View.tsx', 'utf8');
w4 = w4.replace(
  /body: JSON\.stringify\(\{\r?\n\s*invitationId: themeId,\r?\n\s*name: rsvpName,\r?\n\s*attendance: newComment\.attendance,\r?\n\s*message: rsvpMessage\r?\n\s*\}\)/,
  'body: JSON.stringify({\n          invitationId: themeId,\n          name: rsvpName,\n          rsvpStatus: rsvpStatus,\n          comment: rsvpMessage\n        })'
);
fs.writeFileSync('src/components/wedding/Wedding4View.tsx', w4);

// Fix Wedding5View.tsx
let w5 = fs.readFileSync('src/components/wedding/Wedding5View.tsx', 'utf8');
w5 = w5.replace(
  /body: JSON\.stringify\(\{\r?\n\s*invitationId: themeId,\r?\n\s*name: rsvpName,\r?\n\s*attendance: newComment\.attendance,\r?\n\s*message: rsvpMessage\r?\n\s*\}\)/,
  'body: JSON.stringify({\n          invitationId: themeId,\n          name: rsvpName,\n          rsvpStatus: rsvpStatus,\n          comment: rsvpMessage\n        })'
);
fs.writeFileSync('src/components/wedding/Wedding5View.tsx', w5);

// Fix Wedding8View.tsx
let w8 = fs.readFileSync('src/components/wedding/Wedding8View.tsx', 'utf8');
w8 = w8.replace(
  /body: JSON\.stringify\(\{\r?\n\s*invitation_id: themeId,\r?\n\s*name: rsvpName,\r?\n\s*attendance: rsvpStatus,\r?\n\s*rsvp_status: rsvpStatus,\r?\n\s*guest_count: parseInt\(rsvpCount\),\r?\n\s*message: rsvpMessage,\r?\n\s*comment: rsvpMessage,?\r?\n\s*\}\),/,
  'body: JSON.stringify({\n          invitationId: themeId,\n          name: rsvpName,\n          rsvpStatus: rsvpStatus,\n          comment: rsvpMessage\n        }),'
);
fs.writeFileSync('src/components/wedding/Wedding8View.tsx', w8);

console.log('Fixed fetch bodies for Wedding 4, 5, 8');
