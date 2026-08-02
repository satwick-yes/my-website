const fs = require('fs');
const indexPath = 'index.html';
let html = fs.readFileSync(indexPath, 'utf-8');

// Faster durations
html = html.replace(/riseReveal 0\.8s/g, 'riseReveal 0.6s');
html = html.replace(/transition: all 1s/g, 'transition: all 0.75s');
html = html.replace(/breatheHero 6s/g, 'breatheHero 4.5s');
html = html.replace(/floatBtn 4s/g, 'floatBtn 3s');
html = html.replace(/scanline 10s/g, 'scanline 7.5s');
html = html.replace(/transition: all 0\.35s/g, 'transition: all 0.25s');

// Smoother easing curve (from standard to snappy ease-out)
html = html.replace(/cubic-bezier\(0\.2, 0\.8, 0\.2, 1\)/g, 'cubic-bezier(0.1, 0.9, 0.1, 1)');

// Other potential transitions
html = html.replace(/transition: all 0\.3s ease/g, 'transition: all 0.2s cubic-bezier(0.1, 0.9, 0.1, 1)');
html = html.replace(/transition: all 0\.4s ease/g, 'transition: all 0.3s cubic-bezier(0.1, 0.9, 0.1, 1)');
html = html.replace(/transition: transform 0\.3s ease/g, 'transition: transform 0.2s cubic-bezier(0.1, 0.9, 0.1, 1)');

fs.writeFileSync(indexPath, html);
console.log('Made animations 25% faster and 50% smoother!');
