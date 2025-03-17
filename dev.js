const { spawn } = require('child_process');
const path = require('path');

// Run backend server
const backend = spawn('node', ['app.js'], {
  stdio: 'inherit'
});

console.log('Backend server started on port 5050');

// Change to frontend directory and run React development server
const frontend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'annadata-frontend'),
  stdio: 'inherit',
  env: { ...process.env, BROWSER: 'none' } // Prevent browser from auto-opening
});

console.log('Frontend development server started');

// Handle process termination
process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  console.log('All servers terminated');
  process.exit();
});
