const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

console.log('🌱 Starting Annadata application (Frontend + Backend)...');

// Load environment variables
dotenv.config();

// Note: MongoDB URI is now hardcoded in backend/server.js
console.log('📝 Note: Using hardcoded MongoDB connection string in backend/server.js');

// Check for required dependencies
const installDependencies = async () => {
  console.log('🔍 Checking for required dependencies...');
  
  const backendDir = path.join(__dirname, 'annadata-frontend', 'backend');
  
  // Install backend dependencies
  const install = spawn('npm', ['install', 'bcryptjs', 'jsonwebtoken', 'express', 'mongoose', 'cors', 'dotenv'], {
    cwd: backendDir,
    stdio: 'inherit'
  });
  
  return new Promise((resolve) => {
    install.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Dependencies installed successfully');
      } else {
        console.warn('⚠️ Dependency installation completed with code:', code);
      }
      resolve();
    });
  });
};

// Function to check if a port is in use
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

// Start the backend server
const startBackend = async () => {
  console.log('🚀 Starting backend server...');
  
  if (await isPortInUse(5050)) {
    console.log('⚠️ Port 5050 is already in use. Attempting to free it...');
    try {
      // Try to kill any process on port 5050
      const platform = process.platform;
      if (platform === 'win32') {
        spawn('cmd', ['/c', 'netstat -ano | findstr :5050 | findstr LISTENING']).stdout.on('data', (data) => {
          const match = data.toString().match(/\s+(\d+)$/m);
          if (match && match[1]) {
            spawn('taskkill', ['/F', '/PID', match[1]]);
            console.log(`Killed process ${match[1]} on port 5050`);
          }
        });
      } else {
        spawn('sh', ['-c', 'lsof -i :5050 | grep LISTEN | awk \'{print $2}\' | xargs kill -9']);
        console.log('Killed process on port 5050');
      }
    } catch (err) {
      console.error('❌ Failed to free port 5050:', err);
    }
  }

  // Start backend server
  const backend = spawn('node', ['annadata-frontend/backend/server.js'], {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  backend.on('error', (err) => {
    console.error('❌ Failed to start backend server:', err);
  });
  
  return backend;
};

// Start the frontend development server
const startFrontend = () => {
  console.log('🚀 Starting frontend development server...');
  
  const frontend = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'annadata-frontend'),
    stdio: 'inherit',
    env: { 
      ...process.env, 
      BROWSER: 'none',
      REACT_APP_API_URL: 'http://localhost:5050/api'
    }
  });
  
  frontend.on('error', (err) => {
    console.error('❌ Failed to start frontend server:', err);
  });
  
  return frontend;
};

// Main function to start both servers
const startApplication = async () => {
  // Install dependencies first
  await installDependencies();
  
  // Start backend first
  const backendProcess = await startBackend();
  
  // Wait a bit for backend to initialize
  setTimeout(() => {
    // Then start frontend
    const frontendProcess = startFrontend();
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down application...');
      backendProcess.kill();
      frontendProcess.kill();
      process.exit();
    });
  }, 2000);
};

// Start the application
startApplication();
