const fs = require('fs');

let content = fs.readFileSync('src/components/admin/MediaManager.tsx', 'utf8');

// 1. Add state for pages
content = content.replace(
  /const \[customerSearch, setCustomerSearch\] = useState\(""\);/,
  `const [customerSearch, setCustomerSearch] = useState("");
  const [defaultPage, setDefaultPage] = useState(1);
  const [customerPage, setCustomerPage] = useState(1);`
);

// 2. Reset pages on tab or search change
content = content.replace(
  /const fetchInvitations = async/,
  `useEffect(() => {
    setDefaultPage(1);
  }, [activeDefaultTab, defaultSearch]);

  useEffect(() => {
    setCustomerPage(1);
  }, [activeCustomerTab, customerSearch]);

  const fetchInvitations = async`
);

// 3. Update renderFolderList signature and implementation
content = content.replace(
  /const renderFolderList = \(folderList: MediaFolder\[\]\) => \(\s*<div className="divide-y divide-slate-100">/,
  `const renderFolderList = (folderList: MediaFolder[], page: number, setPage: (p: number) => void) => {
    const totalPages = Math.ceil(folderList.length / 10);
    const startIndex = (page - 1) * 10;
    const paginatedList = folderList.slice(startIndex, startIndex + 10);
    return (
    <div className="divide-y divide-slate-100">`
);

content = content.replace(
  /\{folderList\.length === 0 \? \(/,
  `{paginatedList.length === 0 ? (`
);

content = content.replace(
  /folderList\.map\(folder => \(/,
  `paginatedList.map(folder => (`
);

content = content.replace(
  /        \)\)\s*\)\}\s*<\/div>\s*\);\s*const returnMatch/m, // This is tricky, let's use a more robust regex for the end of renderFolderList
  ''
);
// Actually, let's replace the whole renderFolderList up to the end of it
const renderFolderEndRegex = /        \)\)\s*\)\}\s*<\/div>\s*\);/m;
content = content.replace(renderFolderEndRegex, (match) => {
  return `        ))
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-slate-50 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">Halaman {page} dari {totalPages}</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 disabled:opacity-50 transition-colors"
            >
              Sebelumnya
            </button>
            <button 
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 disabled:opacity-50 transition-colors"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );`;
});

// 4. Update the calls to renderFolderList
content = content.replace(
  /\{renderFolderList\(filteredDefault\)\}/,
  `{renderFolderList(filteredDefault, defaultPage, setDefaultPage)}`
);

content = content.replace(
  /\{renderFolderList\(filteredCustomer\)\}/,
  `{renderFolderList(filteredCustomer, customerPage, setCustomerPage)}`
);

fs.writeFileSync('src/components/admin/MediaManager.tsx', content);
console.log('Pagination applied to MediaManager.tsx successfully.');
