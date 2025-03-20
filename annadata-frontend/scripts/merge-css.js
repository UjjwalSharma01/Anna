const fs = require('fs');
const path = require('path');

// Paths to CSS files
const mainCssPath = path.join(__dirname, '../src/styles/Home.css');
const part2CssPath = path.join(__dirname, '../src/styles/Home.part2.css');
const outputCssPath = path.join(__dirname, '../src/styles/Home.merged.css');

// Read CSS files
const mainCss = fs.readFileSync(mainCssPath, 'utf8');
const part2Css = fs.readFileSync(part2CssPath, 'utf8')
  .replace('/* This is a continuation of Home.css styles */', '')
  .replace('/* This file will be merged with Home.css */', '');

// Merge CSS content
const mergedCss = `${mainCss}

/* ======= Part 2 Styles ======= */
${part2Css}`;

// Write merged CSS to output file
fs.writeFileSync(outputCssPath, mergedCss);

console.log('CSS files merged successfully!');
