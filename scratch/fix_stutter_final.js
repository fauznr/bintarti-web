const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Remove backdrop-blur from scrolling elements to save mobile GPU
content = content.replace(/bg-white\/70 backdrop-blur-sm/g, 'bg-white/90');
content = content.replace(/bg-white\/95 backdrop-blur-sm/g, 'bg-white');
content = content.replace(/bg-white\/80 backdrop-blur-sm/g, 'bg-white/95');

// 2. Change scrollStep to be frame-based instead of time-based
const targetBlock = `    const scrollStep = (time: number) => {
      if (lastTime === null) {
        lastTime = time;
        if (activeTheme === "khitan-9") {
          const scrollContainer = document.querySelector('.khitan-9-horizontal-dock');
          exactScrollX = scrollContainer ? scrollContainer.scrollLeft : 0;
        } else {
          exactScrollY = window.scrollY;
        }
        animationFrameId = requestAnimationFrame(scrollStep);
        return;
      }

      const delta = Math.min((time - lastTime) / 1000, 0.1); // cap at 100ms
      lastTime = time;
      const amount = speed * delta;`;

const replacementBlock = `    const scrollStep = () => {
      if (activeTheme === "khitan-9" && exactScrollX === null) {
        const scrollContainer = document.querySelector('.khitan-9-horizontal-dock');
        exactScrollX = scrollContainer ? scrollContainer.scrollLeft : 0;
      } else if (activeTheme !== "khitan-9" && exactScrollY === null) {
        exactScrollY = window.scrollY;
      }

      // Frame-based scrolling (1 pixel per frame) avoids time-delta amplification
      // which causes visual teleportation/judder during a dropped frame on mobile.
      const amount = 1.0; // exactly 1 pixel per frame (~60px per second on 60Hz, ~120px on 120Hz)`;

if (content.includes(targetBlock)) {
    content = content.replace(targetBlock, replacementBlock);
    fs.writeFileSync(pageFile, content);
    console.log("Updated scroll calculation and removed backdrop blurs!");
} else {
    console.log("Target block not found");
}
