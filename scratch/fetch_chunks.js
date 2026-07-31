const https = require('https');
https.get('https://bintarti-mz6skcchj-bintarti.vercel.app/sandbox-tema/khitan-1', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const matches = d.match(/_next\/static\/chunks\/[^"']+\.js/g);
    console.log(matches ? [...new Set(matches)].join('\n') : 'Not found');
  });
});
