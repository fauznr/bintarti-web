const fs = require('fs');

const parseFn = `  const parseGDriveUrl = (url: string) => {
    if (!url) return "";
    if (url.includes('drive.google.com') && url.includes('id=')) {
      const match = url.match(/id=([^&]+)/);
      if (match && match[1]) {
        return \`/api/proxy-audio?id=\${match[1]}\`;
      }
    } else if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/file\\/d\\/([^/]+)/);
      if (match && match[1]) {
        return \`/api/proxy-audio?id=\${match[1]}\`;
      }
    }
    return url;
  };`;

function fixWeddingAudio(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add parseGDriveUrl if missing
  if (!content.includes('const parseGDriveUrl =')) {
    // Insert after "const [isOpened, setIsOpened]" or something common
    content = content.replace(
      /(const \[isOpened, setIsOpened\] = useState\(false\);)/,
      `$1\n\n${parseFn}`
    );
  }

  // Update audio tag src
  content = content.replace(
    /src=\{invitationData\?\.music_url \|\| "https:\/\/assets\.mixkit\.co\/music\/preview\/mixkit-romantic-wedding-462\.mp3"\}/,
    `src={parseGDriveUrl(invitationData?.music || invitationData?.music_url) || "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-462.mp3"}`
  );

  // For Wedding 4, which already has parseGDriveUrl but wrong src
  content = content.replace(
    /src=\{parseGDriveUrl\(invitationData\?\.music_url\) \|\| "https:\/\/assets\.mixkit\.co\/music\/preview\/mixkit-romantic-wedding-462\.mp3"\}/,
    `src={parseGDriveUrl(invitationData?.music || invitationData?.music_url) || "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-462.mp3"}`
  );

  fs.writeFileSync(filePath, content);
}

fixWeddingAudio('src/components/wedding/Wedding2View.tsx');
fixWeddingAudio('src/components/wedding/Wedding3View.tsx');
fixWeddingAudio('src/components/wedding/Wedding4View.tsx');
console.log('Audio fixed');
