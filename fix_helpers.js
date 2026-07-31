const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding5View.tsx', 'utf8');

// Remove the bad import
file = file.replace(/import \{ parseGDriveUrl, getYoutubeEmbedId \} from "@\/lib\/utils";\n/, '');

// Add the helper functions inside the component
if (!file.includes('const getYoutubeEmbedId')) {
  file = file.replace(
    /const audioRef = useRef<HTMLAudioElement \| null>\(null\);/,
    `const audioRef = useRef<HTMLAudioElement | null>(null);

  const getYoutubeEmbedId = (url: string) => {
    if (!url) return "5qap5aO4i9A";
    const regExp = /^.*(youtu.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "5qap5aO4i9A";
  };

  const parseGDriveUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("drive.google.com")) {
      const match = url.match(/\\/d\\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return \`/api/proxy-audio?id=\${match[1]}\`;
      }
    }
    return url;
  };`
  );
}

fs.writeFileSync('src/components/wedding/Wedding5View.tsx', file);
console.log("Helper functions added");
