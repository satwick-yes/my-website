const fs = require('fs');
const indexPath = 'index.html';
let html = fs.readFileSync(indexPath, 'utf-8');

// The injected code ended up between <script type="importmap"> ... </script>
// I need to strip it out from there, and put it at the actual bottom of the file (before </body>)

const regex = /\/\/ 25\. SECTION HEADERS REVEAL[\s\S]*?initHeadersReveal\(\);\n/;
// First remove it completely wherever it is
html = html.replace(regex, '');

// Now inject it right before </body>
const jsToAdd = `
    // 25. SECTION HEADERS REVEAL
    function initHeadersReveal() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      }, { threshold: 0.2 });

      document.querySelectorAll('.section-header').forEach(el => observer.observe(el));
    }
    initHeadersReveal();
`;

html = html.replace('</body>', jsToAdd + '\n</body>');

fs.writeFileSync(indexPath, html);
console.log('Fixed JS placement!');
