const fs = require('fs');
const https = require('https');
const path = require('path');

const keywords = [
  'chatbot',        // 1
  'cybersecurity',  // 2
  'ui',             // 3
  'trading'         // 4
];

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
            redirectUrl = new URL(redirectUrl, url).href;
        }
        https.get(redirectUrl, (res2) => {
          res2.pipe(file);
          file.on('finish', () => { file.close(resolve); });
        }).on('error', reject);
      } else {
        res.pipe(file);
        file.on('finish', () => { file.close(resolve); });
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

(async () => {
  const assetsDir = path.join(__dirname, '..', 'assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
  
  const indexPath = path.join(__dirname, '..', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf-8');
  let count = 0;

  for (let i = 0; i < keywords.length; i++) {
    const imgUrl = `https://loremflickr.com/800/600/${keywords[i]}?lock=${i+1}`;
    const destPath = path.join(assetsDir, `proj_bg_${i + 1}.jpg`);
    console.log(`Downloading ${imgUrl}...`);
    await downloadImage(imgUrl, destPath);
  }

  html = html.replace(/(<article class="project-card[^>]*style="background-image:.*?url\(')([^']+)'/g, (match, p1, p2) => {
    count++;
    if (count >= 1 && count <= 4) {
      const newBg = `assets/proj_bg_${count}.jpg`;
      console.log(`Replaced ${p2} with ${newBg}`);
      return p1 + newBg + "'";
    }
    return match;
  });

  fs.writeFileSync(indexPath, html);
  console.log('Fixed cards 1 to 4!');
})();
