const https = require('https');
https.get('https://bintarti-mz6skcchj-bintarti.vercel.app/sandbox-tema/khitan-1', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const idx = d.indexOf('cover');
    if (idx !== -1) {
       console.log('Found "cover" at ' + idx);
       console.log(d.substring(idx - 100, idx + 1000));
    } else {
       console.log('Not found');
    }
  });
});
