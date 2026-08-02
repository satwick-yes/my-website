const fs = require('fs');
const indexPath = 'index.html';
let html = fs.readFileSync(indexPath, 'utf-8');

const cssToAdd = `
    /* Achievements Rise Reveal Animation */
    @keyframes riseReveal {
      0% { opacity: 0; transform: translateY(40px); filter: blur(10px); }
      100% { opacity: 1; transform: translateY(0); filter: blur(0); }
    }
    
    .achievement-card {
      opacity: 0;
    }
    
    .achievements-grid.is-visible .achievement-card {
       animation: riseReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    
    .achievements-grid.is-visible .achievement-card:nth-child(1) { animation-delay: 0.1s; }
    .achievements-grid.is-visible .achievement-card:nth-child(2) { animation-delay: 0.3s; }
    .achievements-grid.is-visible .achievement-card:nth-child(3) { animation-delay: 0.5s; }
    .achievements-grid.is-visible .achievement-card:nth-child(4) { animation-delay: 0.7s; }
`;

if (!html.includes('riseReveal')) {
  html = html.replace('.achievement-card {', cssToAdd + '\n    .achievement-card {');
}

const jsToAdd = `
    // 24. ACHIEVEMENTS STAGGERED REVEAL
    function initAchievementsReveal() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      const grid = document.querySelector('.achievements-grid');
      if (grid) observer.observe(grid);
    }
    initAchievementsReveal();
`;

if (!html.includes('initAchievementsReveal()')) {
  html = html.replace('initSkillsReveal();', 'initSkillsReveal();\n' + jsToAdd);
}

fs.writeFileSync(indexPath, html);
console.log('Added Staggered Rise & Reveal to Achievements!');
