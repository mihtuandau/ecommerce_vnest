const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "..", "src");
const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && entry.name !== "node_modules") {
      files.push(...walk(fullPath));
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

let totalCleaned = 0;

for (const file of walk(SRC_DIR)) {
  const original = fs.readFileSync(file, "utf-8");

  const cleaned = original
    // xóa JSX comments: {/* ... */}
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "")
    // xóa {} rỗng
    .replace(/^\s*\{\s*\}\s*$/gm, "");

  if (cleaned !== original) {
    fs.writeFileSync(file, cleaned, "utf-8");
    totalCleaned++;
  }
}

console.log(`✅ Cleaned comments from ${totalCleaned} file(s).`);