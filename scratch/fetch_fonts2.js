fetch('https://envelope.id/').then(r => r.text()).then(html => {
  const gfonts = html.match(/fonts\.googleapis\.com\/css[^\'\"]+/g);
  console.log('Google Fonts APIs:', gfonts);

  const fonts = new Set();
  const matches = html.match(/font-family:([^;\"\'\}]+)/gi);
  if(matches) matches.forEach(m => fonts.add(m.trim()));
  console.log('Inline families:', Array.from(fonts));
});
