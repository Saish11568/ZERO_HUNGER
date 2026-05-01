const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix absolute paths to relative
  if (content.includes('src="/src/')) {
    content = content.replace(/src="\/src\//g, 'src="./src/');
    changed = true;
  }

  // Fix trl_listings.js missing type="module"
  if (content.includes('<script src="./src/js/trl_listings.js"></script>')) {
    content = content.replace('<script src="./src/js/trl_listings.js"></script>', '<script type="module" src="./src/js/trl_listings.js"></script>');
    changed = true;
  }
  
  // Also handle cases where it might still be absolute for the trl_listings part
  if (content.includes('<script src="/src/js/trl_listings.js"></script>')) {
    content = content.replace('<script src="/src/js/trl_listings.js"></script>', '<script type="module" src="./src/js/trl_listings.js"></script>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
