const fs = require('fs');
let code = fs.readFileSync('components/dashboard/sidebar.tsx', 'utf8');

code = code.replace(
  /Trophy, label: 'AI Quiz', href: '\/dashboard\/quiz' \},/,
  "{ icon: FileQuestion, label: 'AI Quiz', href: '/dashboard/quiz' },\n  { icon: Mic, label: 'Voice Tutor', href: '/dashboard/voice-tutor' },"
);

if (!code.includes('Mic,')) {
  code = code.replace(
    "import {",
    "import {\n  Mic,"
  );
}

fs.writeFileSync('components/dashboard/sidebar.tsx', code);
