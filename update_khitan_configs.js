const fs = require('fs');
const path = 'C:\\Users\\Administrator\\.gemini\\antigravity\\scratch\\bintarti\\src\\app\\sandbox-tema\\[id]\\page.tsx';
let c = fs.readFileSync(path, 'utf8');

const newConfigStr = fs.readFileSync('C:\\Users\\Administrator\\.gemini\\antigravity\\scratch\\bintarti\\khitan_config_update.json', 'utf8');
const newConfig = JSON.parse(newConfigStr);

for (let i = 1; i <= 8; i++) {
    const varName = `DEFAULT_CONFIG_THEME_KHITAN_${i}`;
    const startStr = `const ${varName}: ThemeConfig = {`;
    let nextVarName = i === 8 ? `const DEFAULT_CONFIG_THEME_1: ThemeConfig = {` : `const DEFAULT_CONFIG_THEME_KHITAN_${i + 1}: ThemeConfig = {`;
    
    let startIndex = c.indexOf(startStr);
    let nextIndex = c.indexOf(nextVarName);
    
    if (startIndex !== -1 && nextIndex !== -1) {
        // find the last '};' before nextIndex
        let endIndex = c.lastIndexOf('};', nextIndex) + 2;
        
        let oldBlock = c.substring(startIndex, endIndex);
        let newBlock = `const ${varName}: ThemeConfig = ` + JSON.stringify(newConfig, null, 2) + ';';
        
        c = c.substring(0, startIndex) + newBlock + c.substring(endIndex);
    } else {
        console.error(`Could not find ${varName} or next variable`);
    }
}

fs.writeFileSync(path, c);
console.log('Successfully updated Khitan 1-8 configs');
