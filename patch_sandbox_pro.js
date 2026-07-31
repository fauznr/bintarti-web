const fs = require('fs');

const path = 'src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace setInvitationData defaults
content = content.replace(
    /setInvitationData\(\{\s*id: themeId,\s*layout_config: data.layout_config\s*\} as any\);/g,
    `setInvitationData({
              id: themeId,
              layout_config: data.layout_config,
              is_pro: true
            } as any);`
);

content = content.replace(
    /setInvitationData\(\{\s*id: themeId,\s*layout_config: layoutConfig\s*\} as any\);/g,
    `setInvitationData({
              id: themeId,
              layout_config: layoutConfig,
              is_pro: true
            } as any);`
);

// We also need to add the QR code to the sandbox view for desktop users to scan
// We can inject a floating div right before the main container closing or at the very top.
// Wait, sandbox-tema/[id]/page.tsx returns the template component directly, like:
// return ( <Wedding7View ... /> );
// So we can wrap the return in a fragment and add the floating QR code if not designerOpen.
// Or we can just add a global floating div at the end of the main `return` if designerOpen is true?
// No, designerOpen is false for normal previews.
// Let's replace the `return (` with `<>` and `);` with `<FloatingQR themeId={themeId} /></>` for all Wedding views.
// Actually, it's easier to inject a React portal or just wrap the `isWedding && !designerOpen` components.
// The easiest way is to add a small global component at the very end of the file, and then call it right before `if (isWedding && !designerOpen)` block? No, if it returns, it stops.

// Let's just find the `if (isWedding && !designerOpen) {` block and wrap the whole block!
const blockStartStr = `  if (isWedding && !designerOpen) {`;
const blockReplacement = `  // Scan QR floating button for desktop users
  const FloatingQrScanner = () => (
    <div className="fixed top-24 right-6 z-[1000] hidden md:flex flex-col items-center gap-2 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-right-8 duration-500 hover:scale-105 transition-transform">
      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Preview di HP</span>
      <img 
        src={\`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=\${encodeURIComponent("https://bintarti.store/sandbox-tema/" + themeId)}\`}
        alt="Scan to preview"
        className="w-20 h-20 rounded-xl"
      />
    </div>
  );

  if (isWedding && !designerOpen) {
    const wrappedWeddingView = (() => {
      if (activeTheme === "wedding-8") return <Wedding8View invitationData={invitationData} guestName={guestName} themeId={themeId} />;
      if (activeTheme === "wedding-7") return <Wedding7View invitationData={invitationData} guestName={guestName} themeId={themeId} />;
      if (activeTheme === "wedding-6") return <Wedding6View invitationData={invitationData} guestName={guestName} themeId={themeId} />;
      if (activeTheme === "wedding-5") return <Wedding5View invitationData={invitationData} guestName={guestName} themeId={themeId} />;
      if (activeTheme === "wedding-4") return <Wedding4View invitationData={invitationData} guestName={guestName} themeId={themeId} />;
      if (activeTheme === "wedding-3") return <Wedding3View invitationData={invitationData} guestName={guestName} themeId={themeId} />;
      if (activeTheme === "wedding-2") return <Wedding2View invitationData={invitationData} guestName={guestName} themeId={themeId} />;
      return <Wedding1View invitationData={invitationData} guestName={guestName} themeId={themeId} />;
    })();
    return (
      <>
        {wrappedWeddingView}
        <FloatingQrScanner />
      </>
    );
  }`;

// Find the block from `if (isWedding && !designerOpen) {` down to `  // ==========================================`
const startIdx = content.indexOf('  if (isWedding && !designerOpen) {');
const endIdx = content.indexOf('  // ==========================================', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const originalBlock = content.substring(startIdx, endIdx);
    content = content.replace(originalBlock, blockReplacement + '\\n\\n');
    console.log("Replaced Wedding Sandbox block to include FloatingQrScanner.");
} else {
    console.log("Could not find the Wedding Sandbox block.");
}

fs.writeFileSync(path, content);
