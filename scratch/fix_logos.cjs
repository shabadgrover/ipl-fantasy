const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace /Logos/${var.toUpperCase()}.png with /Logos/dark/${var.toLowerCase()}.png
  // Regex: \/Logos\/\$\{(.*?)\.toUpperCase\(\)\}\.png
  const regex = /\/Logos\/\$\{(.*?)\.toUpperCase\(\)\}\.png/g;
  
  if (regex.test(content)) {
    console.log(`Fixing ${file}`);
    content = content.replace(regex, '/Logos/dark/${$1.toLowerCase()}.png');
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log("Done");
