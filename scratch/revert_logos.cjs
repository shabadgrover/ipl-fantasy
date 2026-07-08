const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('/Logos/light/')) {
        content = content.replace(/\/Logos\/light\//g, '/Logos/dark/');
        fs.writeFileSync(fullPath, content);
        console.log('Reverted logos in ' + fullPath);
      }
    }
  }
}

replaceInDir('d:/ipl26/src');
console.log('Done!');
