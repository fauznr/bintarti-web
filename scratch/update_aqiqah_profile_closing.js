const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Profile section intro replacement
content = content.replace(
  '{layoutConfig.profile.headerText !== undefined ? layoutConfig.profile.headerText : "Dengan memohon rahmat dan ridho Allah SWT, kami sekeluarga bermaksud menyelenggarakan acara khitanan putra kami:"}',
  '{layoutConfig.profile.headerText !== undefined ? layoutConfig.profile.headerText : (isAqiqah ? "Dengan memohon rahmat dan ridho Allah SWT, kami sekeluarga bermaksud menyelenggarakan tasyakuran aqiqah putra/putri kami:" : "Dengan memohon rahmat dan ridho Allah SWT, kami sekeluarga bermaksud menyelenggarakan acara khitanan putra kami:")}'
);

content = content.replace(
  '              {isKhitan ? (\n                <>\n                  {(() => {\n                    const props = getTextProps("profile", "badge"',
  '              {(isKhitan || isAqiqah) ? (\n                <>\n                  {(() => {\n                    const props = getTextProps("profile", "badge"'
);

// 2. Closing section replacements
// Line 8272: if (isKhitan) in Closing Header
content = content.replace(
  '                  if (isKhitan) {\n                    const props = getTextProps("closing", "header", karlaFont, "#1e293b");',
  '                  if (isKhitan || isAqiqah) {\n                    const props = getTextProps("closing", "header", karlaFont, "#1e293b");'
);

// Line 8312: if (isKhitan) in Closing Body
content = content.replace(
  '                  if (isKhitan) {\n                    const props = getTextProps("closing", "body", karlaFont, "#ffffff");',
  '                  if (isKhitan || isAqiqah) {\n                    const props = getTextProps("closing", "body", karlaFont, "#ffffff");'
);

// Line 8348: if (isKhitan && in Closing Parents
content = content.replace(
  '                  if (isKhitan && layoutConfig.closing.hideBody !== true && layoutConfig.closing.bodyText === undefined) {',
  '                  if ((isKhitan || isAqiqah) && layoutConfig.closing.hideBody !== true && layoutConfig.closing.bodyText === undefined) {'
);

// Line 8368: if (isKhitan) in Closing Bottom
content = content.replace(
  '                  if (isKhitan) {\n                    const props = getTextProps("closing", "bottom", atmaFont, "#ffffff");',
  '                  if (isKhitan || isAqiqah) {\n                    const props = getTextProps("closing", "bottom", atmaFont, "#ffffff");'
);

fs.writeFileSync(pageFile, content);
console.log('Successfully updated Aqiqah profile intro & closing to match Khitan 1 style!');
