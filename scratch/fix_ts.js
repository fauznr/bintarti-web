const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

const targetBlock = `            const bg = btn.querySelector('.nav-bottom-bg');
            const icon = btn.querySelector('.nav-bottom-icon');
            const text = btn.querySelector('.nav-bottom-text');
            const dot = btn.querySelector('.nav-bottom-dot');`;

const replacementBlock = `            const bg = btn.querySelector('.nav-bottom-bg') as HTMLElement | null;
            const icon = btn.querySelector('.nav-bottom-icon') as HTMLElement | null;
            const text = btn.querySelector('.nav-bottom-text') as HTMLElement | null;
            const dot = btn.querySelector('.nav-bottom-dot') as HTMLElement | null;`;

if (content.includes(targetBlock)) {
    content = content.replace(targetBlock, replacementBlock);
    fs.writeFileSync(pageFile, content);
    console.log("Fixed TypeScript error!");
} else {
    console.log("Target block not found");
}
