const fs = require('fs');
const indexPath = 'index.html';
let html = fs.readFileSync(indexPath, 'utf-8');

const premiumCSS = `
    /* --- NEW PREMIUM ANIMATIONS --- */

    /* 1. Breathing Hero Glow */
    @keyframes breatheHero {
      0%, 100% { filter: drop-shadow(0 0 20px rgba(207, 128, 71, 0.1)); }
      50% { filter: drop-shadow(0 0 60px rgba(207, 128, 71, 0.4)); }
    }
    .hero-content h1 {
      animation: breatheHero 6s infinite ease-in-out;
    }

    /* 2. Floating Action Buttons */
    @keyframes floatBtn {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(207, 128, 71, 0.15); }
    }
    .btn-primary, .btn-secondary, .slider-btn {
      animation: floatBtn 4s infinite ease-in-out;
    }
    .btn-primary:hover, .btn-secondary:hover, .slider-btn:hover {
      animation-play-state: paused;
    }

    /* 3. CRT Scanlines on Terminal */
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }
    #terminal-card {
      position: relative;
      overflow: hidden;
    }
    #terminal-card::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(rgba(255,255,255,0) 50%, rgba(207, 128, 71, 0.03) 50%);
      background-size: 100% 4px;
      animation: scanline 10s linear infinite;
      pointer-events: none;
      z-index: 10;
    }

    /* 4. Section Header Slide-Ins */
    .section-header {
      opacity: 0;
      transform: translateX(-40px);
      transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .section-header.is-visible {
      opacity: 1;
      transform: translateX(0);
    }
`;

if (!html.includes('breatheHero')) {
  html = html.replace('</style>', premiumCSS + '\n  </style>');
}

const premiumJS = `
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

if (!html.includes('initHeadersReveal')) {
  html = html.replace('</script>', premiumJS + '\n  </script>');
}

fs.writeFileSync(indexPath, html);
console.log('Added 4 premium animations successfully!');
