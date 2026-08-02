/**
 * Hero Parallax Slide-Over
 * Makes the hero slide-over effect 25% slower and 50% smoother.
 */
document.addEventListener('DOMContentLoaded', () => {
  const homeSection = document.getElementById('home');
  const aboutSection = document.getElementById('about');
  
  if (!homeSection || !aboutSection) return;

  let currentY = 0;
  let targetY = 0;
  
  let currentScale = 1;
  let targetScale = 1;

  let currentOpacity = 1;
  let targetOpacity = 1;

  // 50% smoother: lower lerp factor (0.04) creates a buttery smooth easing
  const lerp = (start, end, factor) => start + (end - start) * factor;

  const renderLoop = () => {
    currentY = lerp(currentY, targetY, 0.04);
    currentScale = lerp(currentScale, targetScale, 0.04);
    currentOpacity = lerp(currentOpacity, targetOpacity, 0.04);

    if (Math.abs(currentY - targetY) > 0.01 || Math.abs(currentScale - targetScale) > 0.001) {
       homeSection.style.transform = `translateY(${currentY}px) scale(${currentScale})`;
       homeSection.style.opacity = currentOpacity;
    }
    requestAnimationFrame(renderLoop);
  };

  const onScroll = () => {
    const aboutRect = aboutSection.getBoundingClientRect();
    const windowH = window.innerHeight;
    
    // We only care when aboutRect.top is between 0 and window.innerHeight (during the slide-over)
    if (aboutRect.top <= windowH && aboutRect.top >= -windowH) {
        let overlap = windowH - aboutRect.top;
        if (overlap < 0) overlap = 0;
        
        // 25% slower slide-over: Hero moves down by 25% of the scroll delta, delaying the cover-up
        targetY = overlap * 0.25;
        
        // Subtle 3D depth scale and fade for smoothness
        targetScale = 1 - (overlap / windowH) * 0.04; 
        targetOpacity = 1 - (overlap / windowH) * 0.4; 
    } else if (aboutRect.top > windowH) {
        targetY = 0;
        targetScale = 1;
        targetOpacity = 1;
    }
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  onScroll();
  renderLoop();
});
