const fs = require('fs');
const w2Path = 'scratch/Wedding2View_test.tsx';
let w2 = fs.readFileSync(w2Path, 'utf8');

// Replace "Reza & Dania" -> "{lockscreenNames}" and "{coupleNames}"
// Line 304: Reza &amp; Dania -> lockscreenNames
w2 = w2.replace(/<h1(.*?)Reza &amp; Dania(.*?)<\/h1>/, '<h1$1{lockscreenNames}$2</h1>');
// Line 388: Reza &amp; Dania -> coupleNames
w2 = w2.replace(/<h1(.*?)Reza &amp; Dania(.*?)<\/h1>/, '<h1$1{coupleNames}$2</h1>');

// Replace "MINGGU, 24 AGUSTUS 2026"
w2 = w2.replace(/MINGGU, 24 AGUSTUS 2026/g, '{akadDateDisplay.toUpperCase()}');

// Replace "Reza Mahendra, S.E."
w2 = w2.replace(/Reza Mahendra, S\.E\./g, '{groomFullName}');
// Replace "@reza_mahendra"
w2 = w2.replace(/@reza_mahendra/g, '{groomInstagram || "Instagram"}');

// Replace "Putra dari Bapak H. Marwan & Ibu Hj. Yulia"
w2 = w2.replace(/Putra dari Bapak H\. Marwan &amp; Ibu Hj\. Yulia/g, '{groomParents}');

// Replace "Dania Putri, S.I.Kom."
w2 = w2.replace(/Dania Putri, S\.I\.Kom\./g, '{brideFullName}');
// Replace "@dania_putri"
w2 = w2.replace(/@dania_putri/g, '{brideInstagram || "Instagram"}');

// Replace "Putri dari Bapak H. Ridwan & Ibu Hj. Kartika"
w2 = w2.replace(/Putri dari Bapak H\. Ridwan &amp; Ibu Hj\. Kartika/g, '{brideParents}');

// Image replacements
w2 = w2.replace(/src="\/wedding2-groom.jpg"/g, 'src={groomPhoto}');
w2 = w2.replace(/src="\/wedding2-bride.jpg"/g, 'src={bridePhoto}');
w2 = w2.replace(/src="\/wedding2-bg1.jpg"/g, 'src={coverPhoto}');
w2 = w2.replace(/backgroundImage: `url\('\/wedding2-bg1.jpg'\)`/g, 'backgroundImage: `url(${coverPhoto})`');

// Akad times & Location
w2 = w2.replace(/08\.00 - 09\.00 WIB/g, '{akadTime}');
w2 = w2.replace(/Gedung Serbaguna/g, '{akadLocation.split(",")[0]}');
w2 = w2.replace(/Jl\. Lorem ipsum dolor sit amet, consectetur adipiscing elit/g, '{akadLocation}');

// Resepsi Time & Location (second instance)
// But since the above might replace both blindly, let's fix the second one for resepsi
w2 = w2.replace(/19\.00 - 21\.00 WIB/g, '{resepsiTime}');
// If "Gedung Serbaguna" was replaced globally by {akadLocation.split(",")[0]}, I'll fix the second one
w2 = w2.replace(/\{akadLocation\.split\(\",\"\)(.*?)\}([\s\S]*?)\{akadLocation\.split\(\",\"\)(.*?)\}/, '{akadLocation.split(",")[0]}$2{resepsiLocation.split(",")[0]}');
w2 = w2.replace(/\{akadLocation\}([\s\S]*?)\{akadLocation\}/, '{akadLocation}$1{resepsiLocation}');

// Music
w2 = w2.replace(/src=\{invitationData\?\.music_url \|\| "https:\/\/assets\.mixkit\.co\/music\/preview\/mixkit-romantic-wedding-462\.mp3"\}/g, 'src={invitationData?.music_url || "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-462.mp3"}');

// RSVPs and Google Maps
// Maps Akad
w2 = w2.replace(/href="https:\/\/maps\.google\.com"/, 'href={akadGmapsLink}');
// Maps Resepsi
w2 = w2.replace(/href="https:\/\/maps\.google\.com"/, 'href={resepsiGmapsLink}');

fs.writeFileSync('src/components/wedding/Wedding2View.tsx', w2);
console.log("Injected JSX mappings.");
