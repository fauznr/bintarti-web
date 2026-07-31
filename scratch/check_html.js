fetch('http://localhost:3000/sandbox-tema/aqiqah-1')
  .then(res => res.text())
  .then(html => {
    const lines = html.split('\n');
    lines.forEach(l => {
      const idx = l.indexOf('bg-cover.jpg');
      if (idx !== -1) {
        console.log(l.substring(Math.max(0, idx - 100), idx + 100));
      }
    });
  });
