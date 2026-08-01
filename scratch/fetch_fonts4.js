fetch('https://envelope.id/').then(r => r.text()).then(html => {
  const gfonts = html.match(/fonts\.googleapis\.com\/css[^\'\"]+/g) || html.match(/fonts\.bunny\.net[^\'\"]+/g);
  console.log('Google Fonts APIs:', gfonts);
  const head = html.substring(0, html.indexOf('</head>'));
  const fonts = head.match(/font-family:([^;\}]+)/g);
  if (fonts) {
     const unique = new Set();
     fonts.forEach(f => unique.add(f.trim().replace(/['\"]/g, '')));
     console.log(Array.from(unique));
  }
});
