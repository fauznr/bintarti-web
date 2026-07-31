const fs = require('fs');

let file = fs.readFileSync('src/components/wedding/Wedding5View.tsx', 'utf8');

// Replace the comments useState block completely
const commentsStart = file.indexOf('const [comments, setComments] = useState<Array');
if (commentsStart !== -1) {
    const commentsEnd = file.indexOf(']);', commentsStart);
    if (commentsEnd !== -1) {
        file = file.substring(0, commentsStart) + 'const [comments, setComments] = useState<Array<{ name: string; attendance: string; message: string; created_at?: string }>>([]);' + file.substring(commentsEnd + 3);
    }
}

// Replace all remaining Farhan and Nabila occurrences
file = file.replace(/Farhan Mahendra, S\.T\./g, '{groomNameFull}');
file = file.replace(/Nabila Zhafira, S\.Psi\./g, '{brideNameFull}');

// For the bank accounts array dummy data
file = file.replace(/a\.n\. Farhan Mahendra/g, '{groomNameFull}');
file = file.replace(/a\.n\. Nabila Zhafira/g, '{brideNameFull}');

fs.writeFileSync('src/components/wedding/Wedding5View.tsx', file);
console.log("Remaining hardcoded text fixed!");
