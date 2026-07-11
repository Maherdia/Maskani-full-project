import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function deleteJsxFiles(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      deleteJsxFiles(fullPath);
    } else if (file.endsWith('.jsx')) {
      fs.unlinkSync(fullPath);
      console.log(`Deleted ${fullPath}`);
    }
  });
}

deleteJsxFiles('src'); 