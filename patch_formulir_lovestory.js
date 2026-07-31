const fs = require('fs');

const path = 'src/app/formulir/page.tsx';
let content = fs.readFileSync(path, 'utf-8');

// 1. Add addLoveStoryItem and removeLoveStoryItem
const newFns = `
  const addLoveStoryItem = () => {
    if (formData.loveStoryList.length >= 10) return; // limit to 10 moments
    setFormData(prev => ({
      ...prev,
      loveStoryList: [...(prev.loveStoryList || []), { year: "", title: "", description: "" }]
    }));
  };

  const removeLoveStoryItem = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      loveStoryList: prev.loveStoryList.filter((_, idx) => idx !== indexToRemove)
    }));
  };
`;
content = content.replace('  const addScheduleItem = () => {', newFns + '\n  const addScheduleItem = () => {');

// 2. Add Delete Button inside the map
const uiItemTop = `<span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block">
                                  📌 Momen Cerita {index + 1}
                                </span>`;
const uiItemTopWithDelete = `<div className="flex justify-between items-center mb-2">
                                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block">
                                    📌 Momen Cerita {index + 1}
                                  </span>
                                  {formData.loveStoryList.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeLoveStoryItem(index)}
                                      className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                      title="Hapus Momen"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>`;
content = content.replace(uiItemTop, uiItemTopWithDelete);

// 3. Add Add Button below the list
const listEnd = `                          <div className="mt-6 pt-6 border-t border-slate-200">`;
const listEndWithAdd = `                          {formData.loveStoryList.length < 10 && (
                            <button
                              type="button"
                              onClick={addLoveStoryItem}
                              className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-rose-200 text-rose-600 hover:bg-rose-50 transition-all text-xs font-bold flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Tambah Momen Cerita
                            </button>
                          )}

                          <div className="mt-6 pt-6 border-t border-slate-200">`;
content = content.replace(listEnd, listEndWithAdd);

fs.writeFileSync(path, content);
console.log('Patched formulir/page.tsx');
