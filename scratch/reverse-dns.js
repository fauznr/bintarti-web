const dns = require('dns');

dns.reverse('2406:da14:311:1500:48b5:109c:c0e9:5edf', (err, hostnames) => {
  console.log('Reverse DNS:', err, hostnames);
});
