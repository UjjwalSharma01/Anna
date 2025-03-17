const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Annadata development environment...');

// Check if servers are already running
const isPortInUse = async (port) => {
  return new Promise((resolve) => {
    const net = require('net');
    const tester = net.createServer()
      .once('error', () => resolve(true))
      .once('listening', () => {
        tester.close();
        resolve(false);
      })
      .listen(port);
  });
};

// Ensure server directory exists
const ensureServerRunning = async () => {
  try {
    console.log('Starting backend server...');
    
    // Set up environment for the server
    const serverEnv = { ...process.env };
    
    // Try to kill any processes on port 5050
    if (await isPortInUse(5050)) {
      console.log('Port 5050 is in use. Attempting to free it...');
      try {
        if (process.platform === 'win32') {
          spawn('cmd', ['/c', 'taskkill /F /IM node.exe'], { stdio: 'ignore' });
        } else {
          spawn('sh', ['-c', 'lsof -ti:5050 | xargs kill -9'], { stdio: 'ignore' });
        }
        // Give it a moment to release
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Could not free port:', e);
      }
    }
    
    // Start the server
    const server = spawn('node', ['app.js'], {
      stdio: 'inherit',
      env: serverEnv
    });
    
    server.on('error', (err) => {
      console.error('Failed to start server:', err);
    });
    
    return server;
  } catch (error) {
    console.error('Error starting server:', error);
    throw error;
  }
};

// Start the frontend
const startFrontend = async () => {
  try {
    console.log('Starting React frontend...');
    
    // Set up environment for React
    const reactEnv = { 
      ...process.env,
      BROWSER: 'none',
      WDS_SOCKET_PORT: 0,
      FAST_REFRESH: 'false',
      CHOKIDAR_USEPOLLING: 'false',
      REACT_APP_DISABLE_WEBSOCKET: 'true',
      PORT: 3000
    };
    
    // Create or verify the necessary .env files exist
    const envDevPath = path.join(__dirname, 'annadata-frontend', '.env.development');
    const envContent = `REACT_APP_API_URL=/api
REACT_APP_ENV=development
FAST_REFRESH=false
WDS_SOCKET_PORT=0
CHOKIDAR_USEPOLLING=false
REACT_APP_DISABLE_WEBSOCKET=true`;
    
    fs.writeFileSync(envDevPath, envContent);
    
    // Start React in development mode
    const frontend = spawn('npm', ['start'], {
      cwd: path.join(__dirname, 'annadata-frontend'),
      stdio: 'inherit',
      env: reactEnv
    });
    
    frontend.on('error', (err) => {
      console.error('Failed to start frontend:', err);
    });
    
    return frontend;
  } catch (error) {
    console.error('Error starting frontend:', error);
    throw error;
  }
};

// Run both servers
const main = async () => {
  try {
    const server = await ensureServerRunning();
    
    // Give the server a moment to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const frontend = await startFrontend();
    
    // Handle graceful shutdown
    const cleanup = () => {
      console.log('Shutting down...');
      server && server.kill();
      frontend && frontend.kill();
      process.exit(0);
    };
    
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('exit', cleanup);
    
    console.log('\n🌱 Annadata development environment is running!');
    console.log('Backend: http://localhost:5050');
    console.log('Frontend: http://localhost:3000');
    
  } catch (err) {
    console.error('Failed to start development environment:', err);
    process.exit(1);
  }
};

main();
