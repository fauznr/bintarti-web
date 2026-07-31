const https = require('https');

https.get('https://eehktxhhpsdffpwlxghm.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'sb_publishable_t-8eqjZiNsP1Ba8f_4GFIQ_shn4yVX7'
  }
}, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', (e) => {
  console.error(e);
});
