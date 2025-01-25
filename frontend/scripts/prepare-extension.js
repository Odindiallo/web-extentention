const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'out');
const targetDir = path.join(__dirname, '..', 'extension');

// Create extension directory
if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true });
}
fs.mkdirSync(targetDir);

// Copy files
function copyDirectory(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  const files = fs.readdirSync(source);
  for (const file of files) {
    if (file.startsWith('_')) continue;  // Skip files/directories starting with _
    
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    const stat = fs.statSync(sourcePath);
    if (stat.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

// Copy public files
copyDirectory(path.join(__dirname, '..', 'public'), targetDir);

// Copy build files (excluding _next)
const files = fs.readdirSync(sourceDir);
for (const file of files) {
  if (file.startsWith('_')) continue;
  
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  if (fs.statSync(sourcePath).isDirectory()) {
    copyDirectory(sourcePath, targetPath);
  } else {
    fs.copyFileSync(sourcePath, targetPath);
  }
}

// Update paths in HTML files
const htmlFiles = fs.readdirSync(targetDir).filter(file => file.endsWith('.html'));
for (const htmlFile of htmlFiles) {
  const filePath = path.join(targetDir, htmlFile);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update paths
  content = content.replace(/\/_next\//g, './static/');
  
  fs.writeFileSync(filePath, content);
}

console.log('Extension files prepared successfully!');
