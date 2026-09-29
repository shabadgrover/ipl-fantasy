import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const basePath = 'C:\\Users\\shabad\\.gemini\\antigravity';
const pngFiles = [];

if (fs.existsSync(basePath)) {
  walkDir(basePath, (filePath) => {
    if (filePath.endsWith('.png')) {
      const stats = fs.statSync(filePath);
      pngFiles.push({
        path: filePath,
        size: stats.size,
        mtime: stats.mtime
      });
    }
  });
}

console.log(JSON.stringify(pngFiles, null, 2));
