const fs = require('fs');
const https = require('https');
const path = require('path');
const crypto = require('crypto');

const keywords = [
  "ecommerce",               // 5
  "dashboard",               // 6
  "realestate",              // 7
  "socialmedia",             // 8
  "crypto",                  // 9
  "artificialintelligence",  // 10
  "healthcare",              // 11
  "food",                    // 12
  "fitness",                 // 13
  "education",               // 14
  "travel",                  // 15
  "portfolio",               // 16
  "job",                     // 17
  "video",                   // 18
  "finance",                 // 19
  "smart",                   // 20
  "concert",                 // 21
  "support",                 // 22
  "freelance",               // 23
  "crm"                      // 24
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
  if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
  }
  
  const indexPath = path.join(__dirname, '..', 'index.html');
  let htmlContent = fs.readFileSync(indexPath, 'utf-8');
  let newHtmlContent = htmlContent;

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    console.log(`Fetching image for ${keyword}...`);
    // Using loremflickr as it allows keyword-based fetching without blocking automated scripts.
    const imgUrl = `https://loremflickr.com/800/600/${keyword}?lock=${i+5}`;
    const imgFilename = `proj_bg_${i + 5}.jpg`;
    const destPath = path.join(assetsDir, imgFilename);
    
    console.log(`Downloading ${imgUrl} to ${destPath}`);
    await downloadImage(imgUrl, destPath);
    
    // Replace the (i+5)-th occurrence of background-image url in .project-card
    // The first 4 cards already have good images.
    let matchCount = 0;
    newHtmlContent = newHtmlContent.replace(/<article class="project-card[^>]*style="background-image:[^url]*url\('([^']+)'\)/g, (match, p1) => {
      matchCount++;
      if (matchCount === (i + 5)) {
        return match.replace(p1, `assets/${imgFilename}`);
      }
      return match;
    });
  }

  fs.writeFileSync(indexPath, newHtmlContent);
  console.log("Done! HTML updated with 20 unique images.");
})();
