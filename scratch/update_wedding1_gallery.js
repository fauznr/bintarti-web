const fs = require('fs');
const viewFile = 'src/components/wedding/Wedding1View.tsx';
let content = fs.readFileSync(viewFile, 'utf8');

// 1. Update galleryImages array to use local Indonesian monochrome couple photos
const oldGalleryImages = `  // High quality monochrome gallery images
  const galleryImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80"
  ];`;

const newGalleryImages = `  // Selected Lightbox state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // High quality monochrome Indonesian couple gallery images
  const galleryImages = [
    "/wedding-bw-bg1.jpg",
    "/wedding-bw-bg2.jpg",
    "/wedding-bw-bg3.jpg",
    "/wedding-bw-bg4.jpg",
    "/wedding-bw-bg5.jpg",
    "/wedding-bw-hero.jpg"
  ];`;

content = content.replace(oldGalleryImages, newGalleryImages);

// 2. Update Gallery grid rendering with interactive onClick lightbox modal
const oldGallerySection = `<div className="grid grid-cols-2 gap-3">
              {galleryImages.map((src, idx) => (
                <ScrollReveal key={idx} delay={idx * 100}>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800 shadow-md group grayscale contrast-125">
                    <Image 
                      src={src} 
                      alt={\`Prewedding \${idx+1}\`} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  </div>
                </ScrollReveal>
              ))}
            </div>`;

const newGallerySection = `<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {galleryImages.map((src, idx) => (
                <ScrollReveal key={idx} delay={idx * 80}>
                  <div 
                    onClick={() => setSelectedImage(src)}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800 shadow-lg group grayscale contrast-125 cursor-pointer hover:border-zinc-500 transition-all"
                  >
                    <Image 
                      src={src} 
                      alt={\`Prewedding \${idx+1}\`} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-[10px] font-sans font-bold text-white bg-black/60 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                        🔍 Perbesar
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
              <div 
                onClick={() => setSelectedImage(null)}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
              >
                <div className="relative max-w-lg w-full max-h-[85vh] aspect-[3/4] rounded-3xl overflow-hidden border border-zinc-700 shadow-2xl grayscale contrast-125">
                  <Image 
                    src={selectedImage} 
                    alt="Prewedding Full" 
                    fill 
                    className="object-contain" 
                  />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 bg-black/70 text-white rounded-full p-2 border border-zinc-600 hover:bg-black transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}`;

content = content.replace(oldGallerySection, newGallerySection);

fs.writeFileSync(viewFile, content);
console.log('Successfully updated gallery photos to authentic Indonesian couple images with interactive lightbox preview!');
