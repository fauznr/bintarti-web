const fs = require('fs');
const content = fs.readFileSync('src/app/admin/page.tsx', 'utf-8');
const startTag = '{(formData.theme === "Wedding 6") && (';
const start = content.indexOf(startTag);
if (start === -1) {
  console.log("Could not find Wedding 6 block in admin");
  process.exit(0);
}

const endMarker = '                            </div>\n                          </div>\n                        )}';
let end = content.indexOf(endMarker, start);
if (end === -1) {
  console.log("Could not find end of Wedding 6 block in admin");
  console.log(content.substring(start, start + 2000));
} else {
  console.log("Found block in admin");
  fs.writeFileSync('temp_wedding6_admin_block.txt', content.substring(start, end + endMarker.length));
}
