const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// The block to replace:
/*
    let animationFrameId: number;
    let lastTime: number | null = null;
    const speed = 40; // pixels per second

    const scrollStep = (time: number) => {
      if (lastTime === null) {
        lastTime = time;
        animationFrameId = requestAnimationFrame(scrollStep);
        return;
      }

      const delta = Math.min((time - lastTime) / 1000, 0.1); // cap at 100ms
      lastTime = time;
      const amount = speed * delta;

      if (activeTheme === "khitan-9") {
        const scrollContainer = document.querySelector('.khitan-9-horizontal-dock');
        if (scrollContainer) {
          (scrollContainer as HTMLElement).style.scrollBehavior = 'auto';
          scrollContainer.scrollBy({ left: amount, behavior: 'auto' });
        }
      } else {
        window.scrollBy({ top: amount, behavior: 'auto' });
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };
*/

const targetBlock = `    let animationFrameId: number;
    let lastTime: number | null = null;
    const speed = 40; // pixels per second

    const scrollStep = (time: number) => {
      if (lastTime === null) {
        lastTime = time;
        animationFrameId = requestAnimationFrame(scrollStep);
        return;
      }

      const delta = Math.min((time - lastTime) / 1000, 0.1); // cap at 100ms
      lastTime = time;
      const amount = speed * delta;

      if (activeTheme === "khitan-9") {
        const scrollContainer = document.querySelector('.khitan-9-horizontal-dock');
        if (scrollContainer) {
          (scrollContainer as HTMLElement).style.scrollBehavior = 'auto';
          scrollContainer.scrollBy({ left: amount, behavior: 'auto' });
        }
      } else {
        window.scrollBy({ top: amount, behavior: 'auto' });
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };`;

const replacementBlock = `    let animationFrameId: number;
    let lastTime: number | null = null;
    let scrollAccumulator: number = 0;
    const speed = 40; // pixels per second

    const scrollStep = (time: number) => {
      if (lastTime === null) {
        lastTime = time;
        animationFrameId = requestAnimationFrame(scrollStep);
        return;
      }

      const delta = Math.min((time - lastTime) / 1000, 0.1); // cap at 100ms
      lastTime = time;
      const amount = speed * delta;
      
      scrollAccumulator += amount;

      if (scrollAccumulator >= 1) {
        const pixelsToScroll = Math.floor(scrollAccumulator);
        scrollAccumulator -= pixelsToScroll;
        
        if (activeTheme === "khitan-9") {
          const scrollContainer = document.querySelector('.khitan-9-horizontal-dock');
          if (scrollContainer) {
            (scrollContainer as HTMLElement).style.scrollBehavior = 'auto';
            scrollContainer.scrollBy({ left: pixelsToScroll, behavior: 'auto' });
          }
        } else {
          window.scrollBy({ top: pixelsToScroll, behavior: 'auto' });
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };`;

if (content.includes(targetBlock)) {
    content = content.replace(targetBlock, replacementBlock);
    fs.writeFileSync(pageFile, content);
    console.log("Updated auto-scroll logic with sub-pixel accumulator!");
} else {
    console.log("Target block not found.");
}
