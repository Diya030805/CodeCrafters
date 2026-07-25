const fs = require('fs');
let code = fs.readFileSync('components/dashboard/sidebar.tsx', 'utf8');

code = code.replace(
  "{ icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },",
  "{ icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },\n  { icon: Trophy, label: 'Gamification', href: '/dashboard/gamification' },"
);

if (!code.includes('Trophy')) {
  code = code.replace(
    "import {",
    "import {\n  Trophy,"
  );
}

fs.writeFileSync('components/dashboard/sidebar.tsx', code);
