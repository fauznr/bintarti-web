const fs = require('fs');

let content = fs.readFileSync('src/components/wedding/Wedding4View.tsx', 'utf8');

// Add YouTube iframe API integration
const top_injection = `
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  
  useEffect(() => {
    if (!youtubeVideo) return;
    
    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    window.onYouTubeIframeAPIReady = () => {
      if (iframeRef.current) {
        new window.YT.Player(iframeRef.current, {
          events: {
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                if (audioRef.current && isPlayingAudio) {
                  audioRef.current.pause();
                }
              } else if (
                event.data === window.YT.PlayerState.PAUSED ||
                event.data === window.YT.PlayerState.ENDED
              ) {
                if (audioRef.current && isPlayingAudio) {
                  audioRef.current.play().catch(() => {});
                }
              }
            }
          }
        });
      }
    };
  }, [youtubeVideo, isPlayingAudio]);
`;

content = content.replace(
  'const audioRef = useRef<HTMLAudioElement | null>(null);',
  'const audioRef = useRef<HTMLAudioElement | null>(null);' + top_injection
);

// Replace hardcoded iframe
const iframeOrig = `{/* Video Prewedding Embed */}
            <ScrollReveal delay={250}>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-black mt-4">
                <iframe
                  className="w-full h-full border-0"
                  src="https://www.youtube.com/embed/5qap5aO4i9A?rel=0"
                  title="Gen Z Casual Prewedding Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </ScrollReveal>`;

const iframeNew = `{youtubeVideo && (
              <ScrollReveal delay={250}>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-black mt-4">
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-0"
                    src={\`\${youtubeVideo}?enablejsapi=1&rel=0\`}
                    title="Prewedding Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </ScrollReveal>
            )}`;

content = content.replace(iframeOrig, iframeNew);

// Add global YT interface so typescript doesn't complain about window.YT
const interfaceString = `interface Wedding4ViewProps {`;
const interfaceNewString = `declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Wedding4ViewProps {`;
content = content.replace(interfaceString, interfaceNewString);


fs.writeFileSync('src/components/wedding/Wedding4View.tsx', content);
console.log('Phase 3 JS done (YouTube integration)');
