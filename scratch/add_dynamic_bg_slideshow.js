const fs = require('fs');
const viewFile = 'src/components/wedding/Wedding1View.tsx';
let content = fs.readFileSync(viewFile, 'utf8');

// 1. Add bgPhotos array and slideshow state
const bgPhotosDef = `  // Background Photos Slideshow List
  const bgPhotos = [
    "/wedding-bw-hero.jpg",
    "/wedding-bw-groom.jpg",
    "/wedding-bw-bride.jpg",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80"
  ];

  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % bgPhotos.length);
    }, 4500);
    return () => clearInterval(bgInterval);
  }, [bgPhotos.length]);`;

content = content.replace('  // Countdown State', `${bgPhotosDef}\n\n  // Countdown State`);

// 2. Update Cover background layer to dynamic crossfade slideshow
const oldCoverBg = `<div 
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-10000 ease-out grayscale contrast-125 brightness-[0.4]"
            style={{ backgroundImage: \`url('/wedding-bw-hero.jpg')\` }}
          />`;

const newCoverBg = `<div className="absolute inset-0 overflow-hidden">
            {bgPhotos.map((src, idx) => (
              <div 
                key={idx}
                className={\`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform grayscale contrast-125 brightness-[0.45] \${
                  idx === currentBgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }\`}
                style={{ backgroundImage: \`url('\${src}')\` }}
              />
            ))}
          </div>`;

content = content.replace(oldCoverBg, newCoverBg);

// 3. Update Main Opened container to have fixed dynamic background slideshow
const oldMainWrapper = `<div className="w-full max-w-[430px] mx-auto bg-[#09090B] min-h-screen shadow-2xl relative border-x border-zinc-800 pb-24">`;

const newMainWrapper = `<div className="w-full max-w-[430px] mx-auto bg-[#09090B] min-h-screen shadow-2xl relative border-x border-zinc-800 pb-24 overflow-hidden">
          {/* Fixed Dynamic Background Crossfade Slideshow */}
          <div className="fixed inset-0 max-w-[430px] mx-auto pointer-events-none overflow-hidden z-0">
            {bgPhotos.map((src, idx) => (
              <div 
                key={idx}
                className={\`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform grayscale contrast-125 brightness-[0.35] \${
                  idx === currentBgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }\`}
                style={{ backgroundImage: \`url('\${src}')\` }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#09090B]" />
          </div>`;

content = content.replace(oldMainWrapper, newMainWrapper);

// 4. Update Hero section background to transparent so fixed slideshow shows through
content = content.replace(
  `className="w-full min-h-[100dvh] flex flex-col items-center justify-center text-center p-6 relative bg-cover bg-center grayscale contrast-125" style={{ backgroundImage: \`url('/wedding-bw-hero.jpg')\` }}`,
  `className="w-full min-h-[100dvh] flex flex-col items-center justify-center text-center p-6 relative bg-transparent z-10"`
);

fs.writeFileSync(viewFile, content);
console.log('Successfully added dynamic changing background photo slideshow!');
