const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public', 'templates');
const templateData = {};

if (fs.existsSync(publicDir)) {
  const folders = fs.readdirSync(publicDir, { withFileTypes: true })
    .filter(d => d.isDirectory());
    
  for (const folder of folders) {
    const folderPath = path.join(publicDir, folder.name);
    const files = fs.readdirSync(folderPath, { withFileTypes: true })
      .filter(f => f.isFile());
      
    templateData[`templates/${folder.name}`] = files.map(f => {
      const ext = path.extname(f.name).toLowerCase();
      let mime = 'application/octet-stream';
      if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
      else if (ext === '.png') mime = 'image/png';
      else if (ext === '.gif') mime = 'image/gif';
      else if (ext === '.svg') mime = 'image/svg+xml';
      
      // Just mock size and date for the static file since we don't have runtime stats
      return {
        id: `local-${f.name}`,
        name: f.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          size: 102400, // mock 100kb
          mimetype: mime
        },
        publicUrl: `/templates/${folder.name}/${f.name}`,
        folderPath: `templates/${folder.name}`
      };
    });
  }
}

fs.writeFileSync('template_data.json', JSON.stringify(templateData, null, 2));
console.log('Created template_data.json');
