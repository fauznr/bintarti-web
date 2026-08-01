fetch('https://envelope.id/').then(r => r.text()).then(html => {
  const snippet = 'Sebelum venue';
  const index = html.indexOf(snippet);
  if (index !== -1) {
    const start = html.lastIndexOf('<div class="elementor-element', index);
    const end = html.indexOf('>', start);
    const div = html.substring(start, end + 1);
    console.log(div);
    const match = div.match(/data-id=\"([a-z0-9]+)\"/);
    if (match) {
       console.log('ID:', match[1]);
       const regex = new RegExp('\\.elementor-element-' + match[1] + '[^{]*{[^}]*font-family:([^;}]+)', 'g');
       const styleMatch = html.match(regex);
       console.log('Styles:', styleMatch);
       
       // Just in case it uses a global preset or widget class
       const pStart = html.lastIndexOf('<p', index);
       const pEnd = html.indexOf('>', pStart);
       console.log('P Element:', html.substring(pStart, pEnd + 1));
    }
  }
});
