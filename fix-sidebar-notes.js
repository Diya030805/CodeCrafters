const fs = require('fs');
let code = fs.readFileSync('components/dashboard/sidebar.tsx', 'utf8');

if (!code.includes("label: 'AI Notes'")) {
  code = code.replace(
    /\{ icon: Mic, label: 'Voice Tutor', href: '\/dashboard\/voice-tutor' \},/,
    "{ icon: Mic, label: 'Voice Tutor', href: '/dashboard/voice-tutor' },\n  { icon: FileText, label: 'AI Notes', href: '/dashboard/notes' },"
  );

  if (!code.includes('FileText,')) {
    code = code.replace(
      "import {",
      "import {\n  FileText,"
    );
  }

  fs.writeFileSync('components/dashboard/sidebar.tsx', code);
}
