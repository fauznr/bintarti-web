const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding5View.tsx', 'utf8');

// Remove the old declarations
file = file.replace(
  /\n\s*const weddingNotes = invitationData\?\.notes \? \(typeof invitationData\.notes === "string" \? JSON\.parse\(invitationData\.notes\) : invitationData\.notes\) : \{\};\n\s*const isPro = !!invitationData\?\.is_pro \|\| !!weddingNotes\?\.isPro;/,
  ''
);

// Insert them at the top of the component, just after audioRef
file = file.replace(
  /const audioRef = useRef<HTMLAudioElement \| null>\(null\);/,
  `const audioRef = useRef<HTMLAudioElement | null>(null);\n\n  const weddingNotes = invitationData?.notes ? (typeof invitationData.notes === "string" ? JSON.parse(invitationData.notes) : invitationData.notes) : {};\n  const isPro = !!invitationData?.is_pro || !!weddingNotes?.isPro;`
);

fs.writeFileSync('src/components/wedding/Wedding5View.tsx', file);
console.log("Moved weddingNotes and isPro to top");
