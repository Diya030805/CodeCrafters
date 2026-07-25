const fs = require('fs');
let code = fs.readFileSync('components/dashboard/voice-tutor-view.tsx', 'utf8');

code = code.replace(
  "  const WaveformVisualizer = ({ isActive }: { isActive: boolean }) => (",
  "  const renderWaveformVisualizer = (isActive: boolean) => ("
);
code = code.replace(
  "<WaveformVisualizer isActive={appState === 'listening' || appState === 'speaking'} />",
  "{renderWaveformVisualizer(appState === 'listening' || appState === 'speaking')}"
);

if (!code.includes('Zap,')) {
  code = code.replace(
    "import {\n  Mic,",
    "import {\n  Mic,\n  Zap,"
  );
}

fs.writeFileSync('components/dashboard/voice-tutor-view.tsx', code);
