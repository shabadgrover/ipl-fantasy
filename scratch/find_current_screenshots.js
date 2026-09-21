import * as fs from 'fs';
import * as path from 'path';

const basePath = 'C:\\Users\\shabad\\.gemini\\antigravity\\brain\\84870731-a00d-4d4f-91e2-c0ca1de03015';
const files = fs.readdirSync(basePath);

files.forEach(file => {
  if (file.endsWith('.png')) {
    const stats = fs.statSync(path.join(basePath, file));
    console.log(`${file} | Size: ${stats.size} | Mtime: ${stats.mtime.toISOString()}`);
  }
});
