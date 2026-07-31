const fs = require('fs');
let file = fs.readFileSync('src/app/api/submit-form/route.ts', 'utf8');

file = file.replace(/      var saveTheDateBgUrl = "";\r?\n      var quoteBgUrl = "";\r?\n      var loveStoryBgUrl = "";\r?\n      var eventBgUrl = "";\r?\n      var dresscodeBgUrl = "";\r?\n      var ourMomentBgUrl = "";\r?\n      var giftBgUrl = "";\r?\n      var rsvpBgUrl = "";\r?\n      var qrBgUrl = "";\r?\n/, '');

file = file.replace('let closingPhotoUrl = "";', 
`let closingPhotoUrl = "";
    let saveTheDateBgUrl = "";
    let quoteBgUrl = "";
    let loveStoryBgUrl = "";
    let eventBgUrl = "";
    let dresscodeBgUrl = "";
    let ourMomentBgUrl = "";
    let giftBgUrl = "";
    let rsvpBgUrl = "";
    let qrBgUrl = "";`);

fs.writeFileSync('src/app/api/submit-form/route.ts', file);
console.log('Fixed variables scope');
