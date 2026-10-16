const { execSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const serverDir = path.join(rootDir, 'server');
const clientDir = path.join(rootDir, 'client');

console.log('🚀 Starting BeAurex Render Production Build...');

try {
  console.log('\n📦 [1/3] Installing Server Dependencies...');
  execSync('npm install', { cwd: serverDir, stdio: 'inherit', shell: true });

  console.log('\n📦 [2/3] Installing Client Dependencies...');
  execSync('npm install', { cwd: clientDir, stdio: 'inherit', shell: true });

  console.log('\n⚡ [3/3] Building Client Frontend (Vite)...');
  execSync('npm run build', { cwd: clientDir, stdio: 'inherit', shell: true });

  console.log('\n✅ BeAurex Production Build Completed Successfully!\n');
} catch (error) {
  console.error('\n❌ Build failed with error:', error.message);
  process.exit(1);
}
