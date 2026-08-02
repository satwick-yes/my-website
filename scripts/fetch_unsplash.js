const fs = require('fs');
const https = require('https');
const path = require('path');

const keywords = [
  "artificial-intelligence", // 1
  "data-science",            // 2
  "neural-network",          // 3
  "machine-learning",        // 4
  "ecommerce",               // 5
  "analytics-dashboard",     // 6
  "real-estate-modern",      // 7
  "social-media-network",    // 8
  "cryptocurrency-exchange", // 9
  "generative-ai",           // 10
  "healthcare-technology",   // 11
  "food-delivery-app",       // 12
  "fitness-tracker",         // 13
  "edtech",                  // 14
  "travel-booking",          // 15
  "portfolio-website",       // 16
  "job-board",               // 17
  "video-streaming",         // 18
  "fintech",                 // 19
  "iot-smart-home",          // 20
  "event-concert",           // 21
  "customer-support",        // 22
  "freelance-work",          // 23
  "crm-software"             // 24
];

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

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

async function getUnsplashImageUrl(keyword) {
  try {
    const html = await fetchHtml('https://unsplash.com/s/photos/' + encodeURIComponent(keyword));
    const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^\"]+/g;
    const matches = [...html.matchAll(regex)];
    if (matches && matches.length > 0) {
      for (const match of matches) {
        if (!match[0].includes('premium')) { 
           let cleanUrl = match[0].split('?')[0];
           return cleanUrl + '?q=80&w=800&auto=format&fit=crop';
        }
      }
      let cleanUrl = matches[0][0].split('?')[0];
      return cleanUrl + '?q=80&w=800&auto=format&fit=crop';
    }
  } catch(e) {
    console.error("Error fetching keyword:", keyword, e);
  }
  return 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=800&auto=format&fit=crop';
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
    console.log(`Fetching image for ${keywords[i]}...`);
    const imgUrl = await getUnsplashImageUrl(keywords[i]);
    const imgFilename = `unsplash_proj_${i + 1}.jpg`;
    const destPath = path.join(assetsDir, imgFilename);
    
    console.log(`Downloading ${imgUrl} to ${destPath}`);
    await downloadImage(imgUrl, destPath);
    
    let matchCount = 0;
    newHtmlContent = newHtmlContent.replace(/<article class="project-card[^>]*style="background-image:[^url]*url\('([^']+)'\)/g, (match, p1) => {
      matchCount++;
      if (matchCount === (i + 1)) {
        return match.replace(p1, `assets/${imgFilename}`);
      }
      return match;
    });
  }

  fs.writeFileSync(indexPath, newHtmlContent);
  console.log("Done! HTML updated with 24 unique Unsplash images.");
})();
