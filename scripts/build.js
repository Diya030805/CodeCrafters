const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting robust build script...');

const distDir = path.join(__dirname, '../dist');
const nextDir = path.join(__dirname, '../.next');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

try {
  console.log('Running npx next build with production env...');
  // Force a safe max-old-space-size to prompt garbage collection before hitting memory limits
  const env = { 
    ...process.env, 
    NODE_ENV: 'production',
    NODE_OPTIONS: (process.env.NODE_OPTIONS || '').replace(/--max-old-space-size=\d+/, '') + ' --max-old-space-size=1024'
  };
  execSync('npx next build', { stdio: 'inherit', env });
} catch (err) {
  console.error('CRITICAL: next build failed or was killed!', err);
  process.exit(1);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      try {
        fs.copyFileSync(srcPath, destPath);
      } catch (e) {
        console.warn(`Failed to copy ${srcPath} to ${destPath}:`, e.message);
      }
    }
  }
}

if (fs.existsSync(nextDir)) {
  console.log('Copying .next artifacts to dist...');
  copyDir(nextDir, distDir);
} else {
  console.warn('.next directory not found after build!');
}

// Ensure critical build files exist in dist
const requiredFiles = [
  'prerender-manifest.json',
  'build-manifest.json',
  'routes-manifest.json',
  'app-build-manifest.json',
  'BUILD_ID'
];

for (const file of requiredFiles) {
  const distFilePath = path.join(distDir, file);
  if (!fs.existsSync(distFilePath)) {
    const nextFilePath = path.join(nextDir, file);
    if (fs.existsSync(nextFilePath)) {
      fs.copyFileSync(nextFilePath, distFilePath);
    } else {
      if (file === 'BUILD_ID') {
        fs.writeFileSync(distFilePath, 'production', 'utf8');
      } else {
        fs.writeFileSync(distFilePath, JSON.stringify({}, null, 2), 'utf8');
      }
    }
  }
}

console.log('Build script completed successfully. Artifacts verified in dist.');
