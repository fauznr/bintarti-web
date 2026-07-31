const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

const targetEffect = `  useEffect(() => {
    if (!isAutoScrolling || !isOpened) {
      document.documentElement.style.scrollBehavior = '';
      return;
    }
    
    // Disable smooth scrolling while auto-scrolling to prevent animation queueing/stuttering
    document.documentElement.style.scrollBehavior = 'auto';

    let animationFrameId: number;
    let lastTime: number | null = null;
    let exactScrollY: number | null = null;
    let exactScrollX: number | null = null;
    const speed = 60; // 60px/s is optimal for reading and smooth 60fps rendering

    const scrollStep = () => {
      if (activeTheme === "khitan-9" && exactScrollX === null) {
        const scrollContainer = document.querySelector('.khitan-9-horizontal-dock');
        exactScrollX = scrollContainer ? scrollContainer.scrollLeft : 0;
      } else if (activeTheme !== "khitan-9" && exactScrollY === null) {
        exactScrollY = window.scrollY;
      }

      // Frame-based scrolling (1 pixel per frame) avoids time-delta amplification
      // which causes visual teleportation/judder during a dropped frame on mobile.
      const amount = 1.0; // exactly 1 pixel per frame (~60px per second on 60Hz, ~120px on 120Hz)
      
      if (activeTheme === "khitan-9") {
        const scrollContainer = document.querySelector('.khitan-9-horizontal-dock');
        if (scrollContainer && exactScrollX !== null) {
          (scrollContainer as HTMLElement).style.scrollBehavior = 'auto';
          // Sync with manual user scroll
          if (Math.abs(scrollContainer.scrollLeft - exactScrollX) > 2) {
             exactScrollX = scrollContainer.scrollLeft;
          }
          exactScrollX += amount;
          scrollContainer.scrollTo({ left: exactScrollX, behavior: 'auto' });
        }
      } else {
        if (exactScrollY !== null) {
          // Sync with manual user scroll
          if (Math.abs(window.scrollY - exactScrollY) > 2) {
             exactScrollY = window.scrollY;
          }
          exactScrollY += amount;
          window.scrollTo({ top: exactScrollY, behavior: 'auto' });
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.documentElement.style.scrollBehavior = '';
    };
  }, [isAutoScrolling, isOpened, activeTheme]);`;

const replacementEffect = `  useEffect(() => {
    if (!isAutoScrolling || !isOpened) {
      document.documentElement.style.scrollBehavior = '';
      return;
    }
    
    document.documentElement.style.scrollBehavior = 'auto';

    let animationFrameId: number;
    let exactScrollY: number | null = null;
    let exactScrollX: number | null = null;

    const scrollStep = () => {
      if (activeTheme === "khitan-9" && exactScrollX === null) {
        const scrollContainer = document.querySelector('.khitan-9-horizontal-dock');
        exactScrollX = scrollContainer ? scrollContainer.scrollLeft : 0;
      } else if (activeTheme !== "khitan-9" && exactScrollY === null) {
        exactScrollY = window.scrollY;
      }

      const amount = 1.0; 
      
      if (activeTheme === "khitan-9") {
        const scrollContainer = document.querySelector('.khitan-9-horizontal-dock');
        if (scrollContainer && exactScrollX !== null) {
          (scrollContainer as HTMLElement).style.scrollBehavior = 'auto';
          exactScrollX += amount;
          scrollContainer.scrollTo({ left: exactScrollX, behavior: 'auto' });
        }
      } else {
        if (exactScrollY !== null) {
          exactScrollY += amount;
          window.scrollTo({ top: exactScrollY, behavior: 'auto' });
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    // Cancel auto-scroll if user manually scrolls or touches the screen
    const cancelAutoScroll = () => {
      setIsAutoScrolling(false);
    };

    window.addEventListener('touchmove', cancelAutoScroll, { passive: true });
    window.addEventListener('wheel', cancelAutoScroll, { passive: true });
    window.addEventListener('mousedown', cancelAutoScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.documentElement.style.scrollBehavior = '';
      window.removeEventListener('touchmove', cancelAutoScroll);
      window.removeEventListener('wheel', cancelAutoScroll);
      window.removeEventListener('mousedown', cancelAutoScroll);
    };
  }, [isAutoScrolling, isOpened, activeTheme]);`;

if (content.includes(targetEffect)) {
    content = content.replace(targetEffect, replacementEffect);
    fs.writeFileSync(pageFile, content);
    console.log("Replaced auto-scroll useEffect logic!");
} else {
    console.log("Could not find the target block! Manual replacement required.");
}
