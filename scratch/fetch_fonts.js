fetch('https://envelope.id/').then(r => r.text()).then(html => {
  const fonts = html.match(/family=[^&\"\'\s>]+/g);
  console.log('Google fonts:', fonts);
  
  const cssLinks = html.match(/<link[^>]+stylesheet[^>]+href=[\'\"]([^\'\"]+)[\'\"]/g);
  console.log('CSS links:', cssLinks);
});
