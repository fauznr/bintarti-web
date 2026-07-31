const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// First, revert my previous blind replacement
content = content.replace(/<Image priority /g, '<Image ');

// Now, we want to add priority to ALL <Image> blocks if they don't have it
let newContent = "";
let i = 0;
while (i < content.length) {
    let match = content.indexOf('<Image ', i);
    if (match === -1) {
        newContent += content.substring(i);
        break;
    }
    
    // Find the end of the Image tag
    let endMatch = content.indexOf('/>', match);
    if (endMatch === -1) {
        newContent += content.substring(i);
        break;
    }
    endMatch += 2; // include '/>'
    
    let tagString = content.substring(match, endMatch);
    
    // If it doesn't already have priority, add it
    if (!tagString.includes('priority')) {
        tagString = tagString.replace('<Image ', '<Image priority ');
    }
    
    newContent += content.substring(i, match) + tagString;
    i = endMatch;
}

fs.writeFileSync(pageFile, newContent);
console.log("Safely added priority to all Image tags!");
