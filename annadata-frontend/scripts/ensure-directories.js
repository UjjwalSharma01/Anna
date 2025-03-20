const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const createDirIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Create animation directories
createDirIfNotExists(path.join(__dirname, '../src/assets/animations'));
createDirIfNotExists(path.join(__dirname, '../src/styles'));

console.log('All required directories created!');
