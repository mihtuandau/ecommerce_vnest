

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..', 'src');

function removeConsoleLogs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove console.log statements (but keep console.error and console.warn)
  const consoleLogPattern = /console\.log\([^)]*\);?\s*/g;
  if (consoleLogPattern.test(content)) {
    content = content.replace(consoleLogPattern, '');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Cleaned: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      removeConsoleLogs(filePath);
    }
  });
}

console.log('🧹 Cleaning console.log statements...');
walkDir(srcDir);
console.log('✨ Done!');
