const { spawn } = require('child_process');
const path = require('path');

// Run backend server
const backend = spawn('node', ['app.js'], {
  stdio: 'inherit'
});

console.log('Backend server started on port 5050');

// Set environment variables to disable WebSocket connections
process.env.WDS_SOCKET_PORT = 0;
process.env.FAST_REFRESH = 'false';

// Change to frontend directory and run React development server with flags to disable WebSocket
const frontend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'annadata-frontend'),
  stdio: 'inherit',
  env: { 
    ...process.env,
    BROWSER: 'none',
    WDS_SOCKET_PORT: 0,
    FAST_REFRESH: 'false',
    CHOKIDAR_USEPOLLING: 'false',
    REACT_APP_DISABLE_WEBSOCKET: 'true'
  }
});

console.log('Frontend development server started with WebSocket disabled');

// Handle process termination
process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  console.log('All servers terminated');
  process.exit();
});
