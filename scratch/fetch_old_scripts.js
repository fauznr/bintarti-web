const https = require('https');
https.get('https://bintarti-35mic9yc5-bintarti.vercel.app/sandbox-tema/khitan-1', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const regex = /src=["'](\/_next\/static\/chunks\/[^"']+)["']/g;
    let match;
    const scripts = [];
    while ((match = regex.exec(d)) !== null) {
      scripts.push(match[1]);
    }
    console.log(scripts);
  });
});
