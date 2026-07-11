import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { transformSync } from '@babel/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function convertTsxToJsx(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Use Babel to transform the code
  const result = transformSync(content, {
    filename: filePath,
    presets: ['@babel/preset-react', '@babel/preset-typescript'],
    plugins: [],
    retainLines: true
  });

  if (!result || !result.code) {
    console.error(`Failed to convert ${filePath}`);
    return;
  }

  const jsxContent = result.code
    .replace(/\.tsx/g, '.jsx')
    .replace(/import\s+.*\s+from\s+['"](.*)\.tsx['"]/g, 'import $1 from "$1.jsx"');
  
  const newPath = filePath.replace('.tsx', '.jsx');
  fs.writeFileSync(newPath, jsxContent);
  console.log(`Converted ${filePath} to ${newPath}`);
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx')) {
      convertTsxToJsx(fullPath);
    }
  });
}

processDirectory('src'); 