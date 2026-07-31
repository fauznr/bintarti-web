const fs = require('fs');
const pageFile = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

const t1 = `  const [activeNavTab, setActiveNavTab] = useState("profile");`;
const r1 = `  // activeNavTab state removed to prevent React re-render stutter during smooth scrolling`;

const t2 = `    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace("-section", "");
          setActiveNavTab(id);
        }
      });
    };`;
const r2 = `    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace("-section", "");
          // Direct DOM manipulation to avoid massive React re-renders which cause stutter
          document.querySelectorAll('.nav-bottom-btn').forEach(btn => {
            const bg = btn.querySelector('.nav-bottom-bg');
            const icon = btn.querySelector('.nav-bottom-icon');
            const text = btn.querySelector('.nav-bottom-text');
            const dot = btn.querySelector('.nav-bottom-dot');
            if (btn.getAttribute('data-id') === id) {
              if (bg) bg.style.opacity = '1';
              if (icon) { icon.style.color = '#111'; icon.style.transform = 'scale(1.12)'; }
              if (text) text.style.color = '#111';
              if (dot) dot.style.opacity = '1';
            } else {
              if (bg) bg.style.opacity = '0';
              if (icon) { icon.style.color = '#555'; icon.style.transform = 'scale(1)'; }
              if (text) text.style.color = '#777';
              if (dot) dot.style.opacity = '0';
            }
          });
        }
      });
    };`;

const t3 = `            {filteredNavItems.map((item) => {
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

                  {/* Active dot */}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-black/40 rounded-full" />
                  )}
                </button>
              );
            })}`;
const r3 = `            {filteredNavItems.map((item) => {
              const isActive = item.id === "profile"; // Initial render
              return (
                <button
                  key={item.id}
                  data-id={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="nav-bottom-btn relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-full transition-all duration-300 gap-0.5 border-none bg-transparent cursor-pointer flex-1"
                  style={atmaFont}
                >
                  {/* Active pill background */}
                  <div
                    className="nav-bottom-bg absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
                    style={{
                      background: 'rgba(0,0,0,0.07)',
                      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8), 0 1px 4px rgba(0,0,0,0.08)',
                      opacity: isActive ? 1 : 0
                    }}
                  />

                  <item.icon
                    className="nav-bottom-icon w-[19px] h-[19px] transition-all duration-300 relative z-10"
                    style={{ color: isActive ? '#111' : '#555', transform: isActive ? 'scale(1.12)' : 'scale(1)' }}
                  />
                  <span
                    className="nav-bottom-text text-[7.5px] font-black uppercase tracking-wider relative z-10 leading-none transition-colors duration-300"
                    style={{ color: isActive ? '#111' : '#777' }}
                  >
                    {item.label}
                  </span>

                  {/* Active dot */}
                  <span 
                    className="nav-bottom-dot absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-black/40 rounded-full transition-opacity duration-300" 
                    style={{ opacity: isActive ? 1 : 0 }}
                  />
                </button>
              );
            })}`;

if (content.includes(t1) && content.includes(t2) && content.includes(t3)) {
    content = content.replace(t1, r1);
    content = content.replace(t2, r2);
    content = content.replace(t3, r3);
    fs.writeFileSync(pageFile, content);
    console.log("Successfully removed massive React re-renders from IntersectionObserver!");
} else {
    console.log("Failed to find targets");
    console.log("t1:", content.includes(t1));
    console.log("t2:", content.includes(t2));
    console.log("t3:", content.includes(t3));
}
