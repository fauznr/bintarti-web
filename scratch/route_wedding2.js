const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Add Wedding2View import
content = content.replace(
  'import Wedding1View from "@/components/wedding/Wedding1View";',
  'import Wedding1View from "@/components/wedding/Wedding1View";\nimport Wedding2View from "@/components/wedding/Wedding2View";'
);

// 2. Add wedding-2 to valid themes check
content = content.replace(
  '&& themeId !== "wedding-1"',
  '&& themeId !== "wedding-1" && themeId !== "wedding-2"'
);

// 3. Route activeTheme === "wedding-2" to Wedding2View
const oldWeddingCheck = `  if (isWedding && !designerOpen) {
    return (
      <Wedding1View 
        invitationData={invitationData}
        guestName={guestName}
        themeId={themeId}
      />
    );
  }`;

const newWeddingCheck = `  if (isWedding && !designerOpen) {
    if (activeTheme === "wedding-2") {
      return (
        <Wedding2View 
          invitationData={invitationData}
          guestName={guestName}
          themeId={themeId}
        />
      );
    }
    return (
      <Wedding1View 
        invitationData={invitationData}
        guestName={guestName}
        themeId={themeId}
      />
    );
  }`;

content = content.replace(oldWeddingCheck, newWeddingCheck);

fs.writeFileSync(pageFile, content);
console.log('Successfully updated sandbox-tema [id] page.tsx for routing wedding-2 to Wedding2View!');
