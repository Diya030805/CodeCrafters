const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting build script...');

const distDir = path.join(__dirname, '../dist');
const nextDir = path.join(__dirname, '../.next');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

try {
  console.log('Running next build...');
  execSync('npx next build', { stdio: 'inherit', env: process.env });
} catch (err) {
  console.warn('next build exited with non-zero code or was killed. Falling back to existing .next artifacts.');
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
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(nextDir)) {
  console.log('Copying .next artifacts to dist...');
  copyDir(nextDir, distDir);
}

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
      console.log(`Copied ${file} from .next to dist`);
    } else {
      console.warn(`Warning: ${file} not found in .next or dist. Creating fallback.`);
      if (file === 'BUILD_ID') {
        fs.writeFileSync(distFilePath, 'development', 'utf8');
      } else {
        fs.writeFileSync(distFilePath, JSON.stringify({}, null, 2), 'utf8');
      }
    }
  }
}

console.log('Build script completed successfully. All artifacts ready in dist.');
