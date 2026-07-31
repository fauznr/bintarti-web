const fs = require('fs');
const path = 'C:\\Users\\Administrator\\.gemini\\antigravity\\scratch\\bintarti\\src\\app\\sandbox-tema\\[id]\\page.tsx';
let c = fs.readFileSync(path, 'utf8');

// Fix find/map over customElements and ornaments that might have undefined elements
c = c.replace(/\(e: any\) => e\.id ===/g, '(e: any) => e?.id ===');
c = c.replace(/\(el: any\) => el\.id ===/g, '(el: any) => el?.id ===');
c = c.replace(/\(el\) => el\.id ===/g, '(el) => el?.id ===');
c = c.replace(/\(c: any\) => c\.id ===/g, '(c: any) => c?.id ===');

// Specifically fix the map inside handlePointerMove which doesn't have a parameter declaration inline sometimes
// wait, in the logs it was: 
// el.id === dragState.elementKey ? { ...el, transformX: newLeft, transformY: newTop } : el
c = c.replace(/el\.id === dragState\.elementKey/g, 'el?.id === dragState.elementKey');

fs.writeFileSync(path, c);
console.log('Successfully patched undefined element crashes');
