const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

const regex = /const scrollStep = \(\) => \{[\s\S]*?animationFrameId = requestAnimationFrame\(scrollStep\);\s*\};\s*animationFrameId = requestAnimationFrame\(scrollStep\);/;

const replacement = `const scrollStep = () => {
      if (exactScrollY === null) {
        exactScrollY = window.scrollY;
      }
      
      const amount = 1.0; 
      
      if (exactScrollY !== null) {
        exactScrollY += amount;
        window.scrollTo({ top: exactScrollY, behavior: 'auto' });
      }
      
      animationFrameId = requestAnimationFrame(scrollStep);
    };
    
    animationFrameId = requestAnimationFrame(scrollStep);`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(pageFile, content);
  console.log('Fixed scrollStep syntax');
} else {
  console.log('Regex did not match');
}
