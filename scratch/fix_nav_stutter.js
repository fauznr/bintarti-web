const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Remove useState for activeNavTab
content = content.replace('const [activeNavTab, setActiveNavTab] = useState("profile");', '// activeNavTab is now handled via direct DOM manipulation for smooth scrolling');

// 2. Update observerCallback
const oldObserver = `    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace("-section", "");
          setActiveNavTab(id);
        }
      });
    };`;

const newObserver = `    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace("-section", "");
          // Update DOM directly to prevent React re-renders which cause scroll stutter
          document.querySelectorAll('.nav-btn').forEach(btn => {
            const bg = btn.querySelector('.nav-bg');
            const icon = btn.querySelector('.nav-icon');
            const text = btn.querySelector('.nav-text');
            if (btn.getAttribute('data-id') === id) {
              if (bg) (bg as HTMLElement).style.opacity = '1';
              if (icon) { (icon as HTMLElement).style.color = '#111'; (icon as HTMLElement).style.transform = 'scale(1.12)'; }
              if (text) (text as HTMLElement).style.color = '#111';
            } else {
              if (bg) (bg as HTMLElement).style.opacity = '0';
              if (icon) { (icon as HTMLElement).style.color = '#555'; (icon as HTMLElement).style.transform = 'scale(1)'; }
              if (text) (text as HTMLElement).style.color = '#777';
            }
          });
        }
      });
    };`;

content = content.replace(oldObserver, newObserver);

// 3. Update the Nav render block
const oldNavBlock = `            {filteredNavItems.map((item) => {
              const isActive = activeNavTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-full transition-all duration-300 gap-0.5 border-none bg-transparent cursor-pointer flex-1"
                  style={atmaFont}
                >
                  {/* Active pill background */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        background: 'rgba(0,0,0,0.07)',
                        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8), 0 1px 4px rgba(0,0,0,0.08)'
                      }}
                    />
                  )}

                  <item.icon
                    className="w-[19px] h-[19px] transition-transform duration-300 relative z-10"
                    style={{ color: isActive ? '#111' : '#555', transform: isActive ? 'scale(1.12)' : 'scale(1)' }}
                  />
                  <span
                    className="text-[7.5px] font-black uppercase tracking-wider relative z-10 leading-none"
                    style={{ color: isActive ? '#111' : '#777' }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}`;

const newNavBlock = `            {filteredNavItems.map((item) => {
              const isActive = item.id === "profile"; // Initial render state
              return (
                <button
                  key={item.id}
                  data-id={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="nav-btn relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-full transition-all duration-300 gap-0.5 border-none bg-transparent cursor-pointer flex-1"
                  style={atmaFont}
                >
                  {/* Active pill background */}
                  <div
                    className="nav-bg absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
                    style={{
                      background: 'rgba(0,0,0,0.07)',
                      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8), 0 1px 4px rgba(0,0,0,0.08)',
                      opacity: isActive ? 1 : 0
                    }}
                  />

                  <item.icon
                    className="nav-icon w-[19px] h-[19px] transition-all duration-300 relative z-10"
                    style={{ color: isActive ? '#111' : '#555', transform: isActive ? 'scale(1.12)' : 'scale(1)' }}
                  />
                  <span
                    className="nav-text text-[7.5px] font-black uppercase tracking-wider relative z-10 leading-none transition-colors duration-300"
                    style={{ color: isActive ? '#111' : '#777' }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}`;

if (content.includes(oldNavBlock)) {
    content = content.replace(oldNavBlock, newNavBlock);
    fs.writeFileSync(pageFile, content);
    console.log("Updated activeNavTab logic to use direct DOM manipulation!");
} else {
    console.log("Could not find oldNavBlock");
}
