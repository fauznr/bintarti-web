fetch('https://envelope.id/').then(r => r.text()).then(html => {
  const match = html.match(/--e-global-typography-[^\}]+/g);
  if (match) console.log(match.join('\n').substring(0, 1000));
  
  const match2 = html.match(/--wp--preset--font-family[^\}]+/g);
  if (match2) console.log(match2.join('\n').substring(0, 1000));
});
