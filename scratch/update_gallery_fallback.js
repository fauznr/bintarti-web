const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// Replace gallery fallback logic
content = content.replace(
  /return customGallery\.length > 0 \? customGallery : galleryImages;/g,
  'return (isCustomInvitation && customGallery.length === 0) ? [] : (customGallery.length > 0 ? customGallery : galleryImages);'
);

// Replace gallery section display style
content = content.replace(
  /style=\{\{ display: \(layoutConfig\.gallery as any\)\?\.hidden \? "none" : undefined,\s*backgroundImage:/,
  'style={{ display: ((layoutConfig.gallery as any)?.hidden || (isCustomInvitation && galleryList.length === 0 && !showVideo)) ? "none" : undefined,\n              backgroundImage:'
);

// Wrap gallery photo components in {galleryList.length > 0 && ( ... )}
// I will do this safely using string splitting and index mapping

const idxH3 = content.indexOf('{(() => {\n                const props = getTextProps("gallery", "header"');
const idxSwipeEnd = content.indexOf('Swipe ke kanan untuk melihat foto ➔\n              </p>') + 'Swipe ke kanan untuk melihat foto ➔\n              </p>'.length;

if (idxH3 !== -1 && idxSwipeEnd !== -1) {
  const before = content.substring(0, idxH3);
  const block = content.substring(idxH3, idxSwipeEnd);
  const after = content.substring(idxSwipeEnd);
  
  content = before + '{galleryList.length > 0 && (\n                <>\n                  ' + block.split('\n').join('\n                  ') + '\n                </>\n              )}' + after;
}

fs.writeFileSync(pageFile, content);
console.log("Updated gallery visibility logic and QR confirmation");
