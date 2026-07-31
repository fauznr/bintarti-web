const fs = require('fs');
const path = require('path');

const targetDir = 'public/templates/birthday-2';

// 1. Copy bg-event.jpg to bg-maps.jpg and bg-checkin.jpg first (before overwriting)
fs.copyFileSync(path.join(targetDir, 'bg-event.jpg'), path.join(targetDir, 'bg-maps.jpg'));
fs.copyFileSync(path.join(targetDir, 'bg-event.jpg'), path.join(targetDir, 'bg-checkin.jpg'));

// 2. Copy bg-plain.jpg to bg-turut.jpg and bg-gallery.jpg
fs.copyFileSync(path.join(targetDir, 'bg-plain.jpg'), path.join(targetDir, 'bg-turut.jpg'));
fs.copyFileSync(path.join(targetDir, 'bg-plain.jpg'), path.join(targetDir, 'bg-gallery.jpg'));

// 3. Copy bg-cover.jpg to bg-event.jpg, bg-activities.jpg, bg-rsvp.jpg, bg-envelope.jpg, bg-closing.jpg
fs.copyFileSync(path.join(targetDir, 'bg-cover.jpg'), path.join(targetDir, 'bg-event.jpg'));
fs.copyFileSync(path.join(targetDir, 'bg-cover.jpg'), path.join(targetDir, 'bg-activities.jpg'));
fs.copyFileSync(path.join(targetDir, 'bg-cover.jpg'), path.join(targetDir, 'bg-rsvp.jpg'));
fs.copyFileSync(path.join(targetDir, 'bg-cover.jpg'), path.join(targetDir, 'bg-envelope.jpg'));
fs.copyFileSync(path.join(targetDir, 'bg-cover.jpg'), path.join(targetDir, 'bg-closing.jpg'));

console.log('All 11 unique background files created/copied successfully.');
