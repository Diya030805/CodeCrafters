const fs = require('fs');
let code = fs.readFileSync('components/dashboard/sidebar.tsx', 'utf8');

if (!code.includes('Mic,')) {
  code = code.replace(
    "import {",
    "import {\n  Mic,"
  );
  fs.writeFileSync('components/dashboard/sidebar.tsx', code);
}
