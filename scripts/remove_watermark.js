const fs = require('fs');
const indexPath = 'index.html';
let html = fs.readFileSync(indexPath, 'utf-8');

// The HTML contains <div class="card-watermark">SOME_TEXT</div>
const regex = /<div class="card-watermark">.*?<\/div>/g;
const matches = html.match(regex);
console.log(`Found ${matches ? matches.length : 0} watermarks.`);

html = html.replace(regex, '');
fs.writeFileSync(indexPath, html);
console.log('Watermarks successfully removed!');
