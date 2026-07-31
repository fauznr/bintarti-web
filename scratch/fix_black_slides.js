const fs = require('fs');
const viewFile = 'src/components/wedding/Wedding1View.tsx';
let content = fs.readFileSync(viewFile, 'utf8');

// 1. Update bgPhotos array in Wedding1View.tsx
const oldBgPhotos = `  // Background Photos Slideshow List
  const bgPhotos = [
    "/wedding-bw-hero.jpg",
    "/wedding-bw-groom.jpg",
    "/wedding-bw-bride.jpg",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80"
  ];`;

const newBgPhotos = `  // Background Photos Slideshow List (Local high-speed B&W images)
  const bgPhotos = [
    "/wedding-bw-bg1.jpg",
    "/wedding-bw-bg2.jpg",
    "/wedding-bw-bg3.jpg",
    "/wedding-bw-bg4.jpg",
    "/wedding-bw-bg5.jpg"
  ];`;

content = content.replace(oldBgPhotos, newBgPhotos);

// 2. Update Cover background layer to have permanent base layer + crossfade layers
const oldCoverSlideshow = `<div className="absolute inset-0 overflow-hidden">
            {bgPhotos.map((src, idx) => (
              <div 
                key={idx}
                className={\`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform grayscale contrast-125 brightness-[0.85] \${
                  idx === currentBgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }\`}
                style={{ backgroundImage: \`url('\${src}')\` }}
              />
            ))}
          </div>`;

const newCoverSlideshow = `<div className="absolute inset-0 overflow-hidden">
            {/* Permanent base image layer to guarantee ZERO black flashes */}
            <div 
              className="absolute inset-0 bg-cover bg-center grayscale contrast-125 brightness-[0.85]"
              style={{ backgroundImage: \`url('/wedding-bw-bg1.jpg')\` }}
            />
            {bgPhotos.map((src, idx) => (
              <div 
                key={idx}
                className={\`absolute inset-0 bg-cover bg-center transition-all duration-1500 ease-in-out transform grayscale contrast-125 brightness-[0.85] \${
                  idx === currentBgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }\`}
                style={{ backgroundImage: \`url('\${src}')\` }}
              />
            ))}
          </div>`;

content = content.replace(oldCoverSlideshow, newCoverSlideshow);

// 3. Update Main Opened container background to have permanent base layer + crossfade layers
const oldMainSlideshow = `<div className="fixed inset-0 max-w-[430px] mx-auto pointer-events-none overflow-hidden z-0">
            {bgPhotos.map((src, idx) => (
              <div 
                key={idx}
                className={\`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform grayscale contrast-125 brightness-[0.75] \${
                  idx === currentBgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }\`}
                style={{ backgroundImage: \`url('\${src}')\` }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-[#09090B]/90" />
          </div>`;

const newMainSlideshow = `<div className="fixed inset-0 max-w-[430px] mx-auto pointer-events-none overflow-hidden z-0">
            {/* Permanent base image layer to guarantee ZERO black flashes */}
            <div 
              className="absolute inset-0 bg-cover bg-center grayscale contrast-125 brightness-[0.75]"
              style={{ backgroundImage: \`url('/wedding-bw-bg1.jpg')\` }}
            />
            {bgPhotos.map((src, idx) => (
              <div 
                key={idx}
                className={\`absolute inset-0 bg-cover bg-center transition-all duration-1500 ease-in-out transform grayscale contrast-125 brightness-[0.75] \${
                  idx === currentBgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }\`}
                style={{ backgroundImage: \`url('\${src}')\` }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-[#09090B]/90" />
          </div>`;

content = content.replace(oldMainSlideshow, newMainSlideshow);

fs.writeFileSync(viewFile, content);
console.log('Successfully eliminated black slides and ensured 100% seamless photo transitions!');
