const dns = require('dns');
dns.setServers(['8.8.8.8']);

dns.resolve('db.eehktxhhpsdffpwlxghm.supabase.co', 'AAAA', (err, addresses) => {
  console.log('AAAA (Google DNS):', err, addresses);
});

dns.resolve('db.eehktxhhpsdffpwlxghm.supabase.co', 'A', (err, addresses) => {
  console.log('A (Google DNS):', err, addresses);
});
