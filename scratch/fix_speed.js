const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

const targetBlock = `    let animationFrameId: number;
    let lastTime: number | null = null;
    let scrollAccumulator: number = 0;
    const speed = 40; // pixels per second`;

const replacementBlock = `    let animationFrameId: number;
    let lastTime: number | null = null;
    let scrollAccumulator: number = 0;
    const speed = 100; // pixels per second (faster and smoother for 60Hz/120Hz screens)`;

if (content.includes(targetBlock)) {
    content = content.replace(targetBlock, replacementBlock);
    fs.writeFileSync(pageFile, content);
    console.log("Updated scroll speed to 100px/s");
} else {
    console.log("Target block not found");
}
