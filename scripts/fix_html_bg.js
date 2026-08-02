const fs = require('fs');
const indexPath = 'index.html';
let html = fs.readFileSync(indexPath, 'utf-8');
let count = 0;

// Match any URL in the project cards style attribute, regardless of what's before it
html = html.replace(/(<article class="project-card[^>]*style="background-image:.*?url\(')([^']+)'/g, (match, p1, p2) => {
  count++;
  if (count > 4 && count <= 24) {
    const newBg = `assets/proj_bg_${count}.jpg`;
    console.log(`Replaced ${p2} with ${newBg}`);
    return p1 + newBg + "'";
  }
  return match;
});

fs.writeFileSync(indexPath, html);
console.log('Total project cards found:', count);
