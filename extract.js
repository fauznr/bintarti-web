const fs = require('fs');

const content = fs.readFileSync('src/app/formulir/page.tsx', 'utf-8');
const startTag = '{(formData.theme === "Wedding 6") && (';
const start = content.indexOf(startTag);
if (start === -1) {
  console.log("Could not find Wedding 6 block");
  process.exit(1);
}

// Find the end of the Wedding 6 block
// It ends with a closing div for the grid and then a closing div for the section and then )}
const endMarker = '                            </div>\n                          </div>\n                        )}';
let end = content.indexOf(endMarker, start);
if (end === -1) {
    // try a slightly different marker
    const altEndMarker = ')}';
    // just find the next matching braces, but let's just do a substring search for now
    // Actually, I can just split the file around it. Let's find exactly the end of that block.
    // Let's write the chunk to a temp file first so I can see what I'm dealing with.
    fs.writeFileSync('temp_wedding6_block.txt', content.substring(start, start + 15000));
    console.log("Written 15k chars to temp_wedding6_block.txt");
} else {
    fs.writeFileSync('temp_wedding6_block.txt', content.substring(start, end + endMarker.length));
    console.log("Written exact block to temp_wedding6_block.txt");
}
