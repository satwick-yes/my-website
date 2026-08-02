const fs = require('fs');
const indexPath = 'index.html';
let html = fs.readFileSync(indexPath, 'utf-8');

// 1. aboutStmt
html = html.replace(
  /aboutStmt\.classList\.add\('animated'\);\s*observer\.unobserve\(entry\.target\);/,
  "aboutStmt.classList.add('animated');\n          } else {\n            aboutStmt.classList.remove('animated');"
);

// 2. statsObserver
html = html.replace(
  /requestAnimationFrame\(animateStats\);\s*statsObserver\.unobserve\(item\);/,
  "requestAnimationFrame(animateStats);\n        } else {\n          const item = entry.target;\n          const suffix = item.getAttribute('data-suffix') || '';\n          item.querySelector('.stat-num').textContent = '0' + suffix;"
);

// 3. sketchTargets
html = html.replace(
  /entry\.target\.classList\.add\('sketched'\);\s*observer\.unobserve\(entry\.target\);/,
  "entry.target.classList.add('sketched');\n          } else {\n            entry.target.classList.remove('sketched');"
);

// 4. initSkillsReveal
html = html.replace(
  /entry\.target\.classList\.add\('is-visible'\);\s*observer\.unobserve\(entry\.target\);\s*}\s*}\);\s*},\s*{\s*threshold:\s*0\.1\s*}/,
  "entry.target.classList.add('is-visible');\n          } else {\n            entry.target.classList.remove('is-visible');\n          }\n        });\n      }, { threshold: 0.1 }"
);

// 5. initAchievementsReveal
html = html.replace(
  /entry\.target\.classList\.add\('is-visible'\);\s*observer\.unobserve\(entry\.target\);\s*}\s*}\);\s*},\s*{\s*threshold:\s*0\.15\s*}/,
  "entry.target.classList.add('is-visible');\n          } else {\n            entry.target.classList.remove('is-visible');\n          }\n        });\n      }, { threshold: 0.15 }"
);

fs.writeFileSync(indexPath, html);
console.log("Updated IntersectionObservers to trigger repeatedly.");
