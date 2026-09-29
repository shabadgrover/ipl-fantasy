const fs = require('fs');
const path = require('path');

const dir = 'd:/ipl26/src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('dark:hidden') && lines[i].includes('/Logos/dark/')) {
      lines[i] = lines[i].replace('/Logos/dark/', '/Logos/light/');
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('Updated ' + f);
  }
});
