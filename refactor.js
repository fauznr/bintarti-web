const fs = require('fs');

const pagePath = 'src/app/admin/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Add imports for AdminAuth and AdminSidebar
content = content.replace(
  'import MusicManager from "../../components/admin/MusicManager";',
  'import MusicManager from "../../components/admin/MusicManager";\nimport AdminAuth from "../../components/admin/AdminAuth";\nimport AdminSidebar from "../../components/admin/AdminSidebar";'
);

// 2. Remove unused lucide-react imports to fix linting errors
// We need to remove FolderOpen from the lucide-react import
content = content.replace(
  'Music,\n  FolderOpen\n} from "lucide-react";',
  'Music\n} from "lucide-react";'
);

// 3. Remove the handleLogin and handleResetPassword functions
// We can find them using regex or string splits.
const authFunctionsRegex = /const handleLogin = async.*?setIsAuthenticated\(true\);\n    fetchInvitations\(\);\n  };\n\n  const handleResetPassword = async.*?setAuthSuccess\("Tautan reset kata sandi telah dikirim ke email Anda\."\);\n    \}\n  };/s;
content = content.replace(authFunctionsRegex, '');

// 4. Replace the entire Auth block
const authUIRegex = /if \(!isAuthenticated\) \{[\s\S]*?return \([\s\S]*?<div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">[\s\S]*?<\/div>\n    \);\n  \}/s;

content = content.replace(authUIRegex, `if (!isAuthenticated) {
    return <AdminAuth onAuthSuccess={() => { setIsAuthenticated(true); fetchInvitations(); }} />;
  }`);

// 5. Replace the Sidebar block
const sidebarRegex = /<aside className=\{`bg-white border-r border-slate-200\/80 shadow-sm flex flex-col z-20 shrink-0 transition-all duration-300 \$\{isSidebarOpen \? 'w-64' : 'w-0 overflow-hidden border-r-0'\}[\s\S]*?<\/aside>/s;

content = content.replace(sidebarRegex, `<AdminSidebar 
          isSidebarOpen={isSidebarOpen} 
          activeAdminTab={activeAdminTab} 
          setActiveAdminTab={setActiveAdminTab} 
          onLogout={handleLogout} 
        />`);

// 6. Fix unused variables e in page.tsx line 1948 and 2650
// It's mostly catch (e) { console.error(e) } or similar. We can leave it, or replace `catch (e)` with `catch (error)`.
content = content.replace(/catch \(e\)/g, 'catch (error)');

fs.writeFileSync(pagePath, content);
console.log("Successfully refactored page.tsx");
