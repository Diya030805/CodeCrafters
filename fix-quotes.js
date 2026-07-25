const fs = require('fs');
let code = fs.readFileSync('components/dashboard/notes-view.tsx', 'utf8');

code = code.replace(/I've/g, "I&apos;ve");
code = code.replace(/haven't/g, "haven&apos;t");

fs.writeFileSync('components/dashboard/notes-view.tsx', code);
