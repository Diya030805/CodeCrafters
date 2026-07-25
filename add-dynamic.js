const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(filePath, 'utf8');
      if (!content.includes('export const dynamic')) {
        content = "export const dynamic = 'force-dynamic';\n\n" + content;
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Added dynamic to:', filePath);
      }
    }
  }
}

walkDir('./app');
