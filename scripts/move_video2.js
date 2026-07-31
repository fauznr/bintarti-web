const fs = require('fs');
let code = fs.readFileSync('src/components/wedding/Wedding2View.tsx', 'utf8');

const videoStart = code.indexOf('{/* YouTube Prewedding Video Embed Below Photos */}');
const videoEnd = code.indexOf('{/* Lightbox Modal */}');

if (videoStart !== -1 && videoEnd !== -1) {
  const videoBlock = code.substring(videoStart, videoEnd);
  
  // Remove video block from inside gallery section
  code = code.substring(0, videoStart) + code.substring(videoEnd);
  
  // Find the end of the gallery section
  const sectionEnd = code.indexOf('</section>', videoStart);
  
  // Insert the video block as a NEW section right after
  const newSection = `
          {/* 8.5 PREWEDDING VIDEO SECTION */}
          <section className="px-6 py-4 space-y-6 text-center relative z-10 bg-transparent">
            ${videoBlock}
          </section>
  `;
  
  code = code.substring(0, sectionEnd + 10) + newSection + code.substring(sectionEnd + 10);
  
  fs.writeFileSync('src/components/wedding/Wedding2View.tsx', code);
  console.log('Successfully moved video to its own section in Wedding2View');
} else {
  console.log('Could not find video block in Wedding2View');
}
