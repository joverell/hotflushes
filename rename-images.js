const fs = require('fs');
const path = require('path');

const dir = 'public/images/gallery';
const files = fs.readdirSync(dir);

files.forEach(file => {
  let newName = file.toLowerCase()
    .replace(/%20/g, '-')
    .replace(/ /g, '-')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/\+/g, '-')
    .replace(/--/g, '-');
  
  const oldPath = path.join(dir, file);
  const newPath = path.join(dir, newName);
  
  if (oldPath !== newPath) {
    console.log(`Renaming: ${file} -> ${newName}`);
    try {
      fs.renameSync(oldPath, newPath);
    } catch (e) {
      console.error(`Failed: ${file}`, e.message);
    }
  }
});
