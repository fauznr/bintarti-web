const fs = require('fs');
const filePath = 'C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/src/app/sandbox-tema/[id]/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add ClipboardPaste and Copy to Lucide imports
content = content.replace('Undo2, Redo2 } from "lucide-react";', 'Undo2, Redo2, Copy, ClipboardPaste } from "lucide-react";');

// 2. Add clipboardElement state
const stateMarker = `    section: "cover",
    type: "default",
    key: "header"
  });`;
if (!content.includes('const [clipboardElement')) {
  content = content.replace(stateMarker, stateMarker + `\n\n  const [clipboardElement, setClipboardElement] = useState<any>(null);`);
}

// 3. Add handleCopyElement, handlePasteElement and useEffect
const addTextMarker = `  const handleAddTextElement = () => {`;
const copyPasteLogic = `
  const handleCopyElement = () => {
    if (!selectedElement) return;
    const { section, type, key } = selectedElement;
    let props = null;
    if (type === "custom") {
      props = (layoutConfig[section].customElements || []).find((e: any) => e.id === key);
    } else if (type === "ornament") {
      props = (layoutConfig[section].ornaments || []).find((e: any) => e && e.id === key);
    } else if (type === "default") {
      props = getActiveElementProps();
    }
    if (props) {
      setClipboardElement({ type, props: { ...props } });
    }
  };

  const handlePasteElement = () => {
    if (!clipboardElement) return;
    const { type, props } = clipboardElement;

    if (type === "custom" || type === "default") {
      const newId = \`custom-text-\${Date.now()}\`;
      const newElement = {
        id: newId,
        text: props.text,
        fontFamily: props.fontFamily || "Karla",
        fontSize: props.fontSize || 14,
        fontColor: props.fontColor || "#ffffff",
        fontWeight: props.fontWeight || "normal",
        fontStyle: props.fontStyle || "normal",
        marginTop: (props.marginTop || 0) + 20,
        marginBottom: props.marginBottom || 0,
        marginLeft: (props.marginLeft || 0) + 20,
        marginRight: props.marginRight || 0,
        paddingTop: props.paddingTop || 0,
        paddingBottom: props.paddingBottom || 0,
        paddingLeft: props.paddingLeft || 0,
        paddingRight: props.paddingRight || 0,
        width: props.width || 100,
        transformX: (props.transformX || 0) + 20,
        transformY: (props.transformY || 0) + 20,
        animationClass: props.animationClass || "",
      };
      const currentElements = layoutConfig[selectedSection].customElements || [];
      const updatedElements = [...currentElements, newElement];
      updateConfig("customElements" as any, updatedElements, selectedSection);
      setSelectedElement({
        section: selectedSection,
        type: "custom",
        key: newId
      });
      // Try to push history using a minimal diff update
      const newConfigForHistory = { ...layoutConfig, [selectedSection]: { ...layoutConfig[selectedSection], customElements: updatedElements } };
      // Note: pushHistory might use latestConfigRef, we'll let useEffect handle history
    } else if (type === "ornament") {
      const newId = \`ornament_\${Date.now()}\`;
      const newElement = {
        ...props,
        id: newId,
        transformX: (props.transformX || 0) + 20,
        transformY: (props.transformY || 0) + 20,
      };
      const currentElements = [...(layoutConfig[selectedSection].ornaments || [])];
      let emptySlot = -1;
      for (let i = 0; i < 3; i++) {
        if (!currentElements[i]) {
          emptySlot = i;
          break;
        }
      }
      if (emptySlot !== -1) {
        currentElements[emptySlot] = newElement;
      } else {
        alert("Slot ornamen penuh (Maks 3)!");
        return;
      }
      updateConfig("ornaments" as any, currentElements, selectedSection);
      setSelectedElement({
        section: selectedSection,
        type: "ornament",
        key: newId
      });
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        handleCopyElement();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        handlePasteElement();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [selectedElement, clipboardElement, layoutConfig, selectedSection]);
`;

if (!content.includes('handleCopyElement')) {
  content = content.replace(addTextMarker, copyPasteLogic + '\n  ' + addTextMarker);
}

// 4. Add UI Buttons for Copy and Paste
// Paste Button near "Tambah Elemen"
const pasteBtnText = `
                  <div className="flex gap-1">
                    <button
                      onClick={handlePasteElement}
                      disabled={!clipboardElement || (clipboardElement.type !== "custom" && clipboardElement.type !== "default")}
                      className={\`px-2 py-1 \${(!clipboardElement || (clipboardElement.type !== "custom" && clipboardElement.type !== "default")) ? "bg-slate-100 text-slate-400" : "bg-green-600 hover:bg-green-700 text-white"} text-[8px] font-black uppercase rounded-lg cursor-pointer border-none flex items-center gap-1 transition-all\`}
                      title="Paste Teks (Ctrl+V)"
                    >
                      <ClipboardPaste className="w-3 h-3" /> Paste
                    </button>
                    <button
                      onClick={handleAddTextElement}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[8px] font-black uppercase rounded-lg cursor-pointer border-none flex items-center gap-1 transition-all hover:scale-102"
                    >
                      <Plus className="w-3 h-3" /> Tambah Elemen
                    </button>
                  </div>`;
content = content.replace(
  `<button
                    onClick={handleAddTextElement}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[8px] font-black uppercase rounded-lg cursor-pointer border-none flex items-center gap-1 transition-all hover:scale-102"
                  >
                    <Plus className="w-3 h-3" /> Tambah Elemen
                  </button>`, 
  pasteBtnText
);

// Copy Button for custom text
const copyBtnCustom = `
                            <button
                              onClick={handleCopyElement}
                              className="p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 rounded-xl cursor-pointer transition-colors"
                              title="Copy Elemen (Ctrl+C)"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={handleDeleteActiveCustomElement}
`;
content = content.replace(`<button\n                              onClick={handleDeleteActiveCustomElement}`, copyBtnCustom);

// Copy Button for default text
const copyBtnDefault = `
                          <div className="flex gap-2">
                            <textarea
                              value={activeEl.text}
                              onChange={(e) => updateActiveElementProp("text", e.target.value)}
                              placeholder="Masukkan tulisan kustom..."
                              rows={2}
                              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
                            />
                            <button
                              onClick={handleCopyElement}
                              className="p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 rounded-xl cursor-pointer transition-colors flex-shrink-0 self-start"
                              title="Copy Elemen Default jadi Kustom (Ctrl+C)"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
`;
const oldDefaultTextarea = `                          <textarea
                            value={activeEl.text}
                            onChange={(e) => updateActiveElementProp("text", e.target.value)}
                            placeholder="Masukkan tulisan kustom..."
                            rows={2}
                            className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
                          />
                        )}`;
content = content.replace(oldDefaultTextarea, copyBtnDefault);

// Copy Button for Ornaments
const copyBtnOrnament = `
                              <button onClick={handleCopyElement} className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors border border-blue-100" title="Copy Ornamen (Ctrl+C)">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDeleteOrnament(slotIdx)}
`;
content = content.replace(`<button onClick={() => handleDeleteOrnament(slotIdx)}`, copyBtnOrnament);

// Paste Button for Ornaments
const pasteBtnOrnamentHeader = `
                  <div className="flex justify-between items-center">
                    <span className="block text-[8px] font-black uppercase text-blue-700 tracking-wider">🌸 Ornamen Tambahan (Maks 3)</span>
                    <button
                      onClick={handlePasteElement}
                      disabled={!clipboardElement || clipboardElement.type !== "ornament"}
                      className={\`px-2 py-1 \${(!clipboardElement || clipboardElement.type !== "ornament") ? "bg-slate-100 text-slate-400" : "bg-green-600 hover:bg-green-700 text-white"} text-[8px] font-black uppercase rounded-lg cursor-pointer border-none flex items-center gap-1 transition-all\`}
                      title="Paste Ornamen (Ctrl+V)"
                    >
                      <ClipboardPaste className="w-3 h-3" /> Paste
                    </button>
                  </div>
`;
content = content.replace(`<span className="block text-[8px] font-black uppercase text-blue-700 tracking-wider">🌸 Ornamen Tambahan (Maks 3)</span>`, pasteBtnOrnamentHeader);

fs.writeFileSync(filePath, content);
console.log("Done adding copy paste feature!");
