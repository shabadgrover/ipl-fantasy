const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace /Logos/light/${var.toLowerCase()}.png with /Logos/${var}.png
  // Regex: \/Logos\/light\/\$\{(.*?)\.toLowerCase\(\)\}\.png
  const regex = /\/Logos\/light\/\$\{(.*?)\.toLowerCase\(\)\}\.png/g;
  
  if (regex.test(content)) {
    console.log(`Fixing ${file}`);
    content = content.replace(regex, '/Logos/${$1.toUpperCase()}.png');
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log("Done");
