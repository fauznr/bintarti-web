const fs = require("fs");
const path = require("path");

function walk(dir, results = []) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith(".") && file !== "node_modules" && file !== ".next") {
        walk(fullPath, results);
      }
    } else {
      if (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js") || file.endsWith(".jsx")) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = walk("src");
console.log(`Searching in ${files.length} files...`);

files.forEach(file => {
  const content = fs.readFileSync(file, "utf8");
  if (content.includes("link_undangan")) {
    console.log(`\nFound in: ${file}`);
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      if (line.includes("link_undangan")) {
        console.log(`  L${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
