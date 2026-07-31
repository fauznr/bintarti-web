const fs = require('fs');

let file = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');

// The grid div starts at line 2384
const gridStartPattern = '<div className="grid grid-cols-1 md:grid-cols-2 gap-4">';
const gridStartIndex = file.indexOf(gridStartPattern);
if (gridStartIndex === -1) {
    console.error('Grid start not found');
    process.exit(1);
}

const gridContentStart = gridStartIndex + gridStartPattern.length;
// Find the end of this grid div. It's closed by `</div>` and then `</div>` or something.
// We can just find the end of the QR Code block.
const qrCodePattern = '{/* Background QR Code */}';
const qrCodeIndex = file.indexOf(qrCodePattern, gridContentStart);
// QR Code block is 25 lines. Let's just find the next `</div>` after QR code block ends
const qrCodeEndIndex = file.indexOf('</div>', qrCodeIndex + 500); 

// Actually, it's safer to extract blocks using regex since they all follow the same pattern:
// {/* Background Name */}
// <div className="space-y-2 ...
// ...
// </div>
// But they have nested divs!

// Let's use simple string extraction based on `{/* Background ` comments.
const blocks = [
    'Save The Date',
    'Penutup',
    'Quotes',
    'Kisah Cinta',
    'Acara',
    'Dresscode',
    'Our Moment',
    'Gift',
    'RSVP',
    'QR Code'
];

let blockContents = {};

blocks.forEach((name, i) => {
    const startStr = `{/* Background ${name} */}`;
    const startIndex = file.indexOf(startStr);
    
    let nextIndex = file.length;
    if (i < blocks.length - 1) {
        // Find the next block to determine the end of current block
        // Wait, the order in the file is currently exactly the order in the `blocks` array above!
        const nextStartStr = `{/* Background ${blocks[i+1]} */}`;
        nextIndex = file.indexOf(nextStartStr);
    } else {
        // For the last one (QR Code), find the matching closing div for the grid
        const afterQrCode = file.indexOf('</div>\n                            </div>\n                          </div>\n                        )}', startIndex);
        nextIndex = afterQrCode;
    }
    
    let content = file.substring(startIndex, nextIndex);
    
    // Clean up label numbering
    content = content.replace(/<label className="text-\[10px\] font-bold text-slate-500 uppercase tracking-widest block">\s*(\d+\.\s*)?([^\n]+)\s*<\/label>/, 
        '<label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">\n                                  __LABEL__\n                                </label>'
    );
    
    blockContents[name] = content;
});

// Now we construct the new order
const newOrder = [
    { key: 'Quotes', label: '1. Background Ayat / Kutipan' },
    { key: 'Kisah Cinta', label: '2. Background Kisah Cinta / Love Story' },
    { key: 'Save The Date', label: '3. Background Save The Date' },
    { key: 'Acara', label: '4. Background Detail Acara / Event' },
    { key: 'Dresscode', label: '5. Background Panduan Pakaian / Dresscode' },
    { key: 'Our Moment', label: '6. Background Our Moment / Gallery' },
    { key: 'Gift', label: '7. Background Buku Tamu / Gift' },
    { key: 'RSVP', label: '8. Background RSVP' },
    { key: 'Penutup', label: '9. Background Penutup' },
    { key: 'QR Code', label: '10. Background QR Code' }
];

let newGridContent = '\n\n';
newOrder.forEach(item => {
    let content = blockContents[item.key];
    content = content.replace('__LABEL__', item.label);
    newGridContent += content;
});

// Replace in file
const beforeGrid = file.substring(0, gridContentStart);
// Calculate end index by finding where QR code ends
const lastBlockIndex = file.indexOf('{/* Background QR Code */}');
const endOfLastBlock = file.indexOf('                            </div>\n                          </div>\n                        )}', lastBlockIndex);

const afterGrid = file.substring(endOfLastBlock);

fs.writeFileSync('src/app/formulir/page.tsx', beforeGrid + newGridContent + afterGrid);
console.log('Successfully reordered blocks!');
