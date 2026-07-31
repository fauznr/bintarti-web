const https = require('https');
const ipRange = '2406:da14:311:1500:48b5:109c:c0e9:5edf';

https.get('https://ip-ranges.amazonaws.com/ip-ranges.json', (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      const ipv6Prefixes = data.ipv6_prefixes;
      console.log('Searching for matches in', ipv6Prefixes.length, 'prefixes...');
      
      const ipBuf = ipv6ToBuffer(ipRange);
      
      for (const prefix of ipv6Prefixes) {
        const [prefIp, maskStr] = prefix.ipv6_prefix.split('/');
        const mask = parseInt(maskStr, 10);
        const prefBuf = ipv6ToBuffer(prefIp);
        
        if (ipInPrefix(ipBuf, prefBuf, mask)) {
          console.log('FOUND MATCHING PREFIX:', prefix);
        }
      }
    } catch (e) {
      console.error(e);
    }
  });
});

function ipv6ToBuffer(ip) {
  // Standard full-expansion IPv6 to 16-byte Buffer
  const parts = ip.split(':');
  let result = Buffer.alloc(16);
  let pos = 0;
  
  // Calculate how many sections are omitted by '::'
  const omitted = 8 - parts.filter(p => p !== '').length;
  
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '') {
      if (i === 0 || i === parts.length - 1) continue; // double colon at edge
      pos += omitted * 2;
    } else {
      const val = parseInt(parts[i], 16);
      result.writeUInt16BE(val, pos);
      pos += 2;
    }
  }
  return result;
}

function ipInPrefix(ipBuf, prefBuf, mask) {
  const bytes = Math.floor(mask / 8);
  const bits = mask % 8;
  for (let i = 0; i < bytes; i++) {
    if (ipBuf[i] !== prefBuf[i]) return false;
  }
  if (bits > 0) {
    const bitmask = (0xFF << (8 - bits)) & 0xFF;
    if ((ipBuf[bytes] & bitmask) !== (prefBuf[bytes] & bitmask)) return false;
  }
  return true;
}
