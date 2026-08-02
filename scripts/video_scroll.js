/**
 * Scroll-Synced Video Animation
 * Loads frames progressively and draws to canvas based on scroll position.
 */

document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('video-intro');
  const canvas = document.getElementById('video-canvas');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Total number of frames available
  const frameCount = 240;
  
  // Cache to hold loaded Image objects
  const images = [];
  
  // Load frames progressively
  const currentFrame = index => (
    `assets/frames_2k/${index.toString().padStart(5, '0')}.webp`
  );

  const preloadImages = async () => {
    for (let i = 1; i <= frameCount; i++) {
      if (i % 5 === 0) await new Promise(r => setTimeout(r, 30));
      const img = new Image();
      img.src = currentFrame(i);
      images[i] = img;
    }
  };

  // Draw the first frame once it loads to prevent empty canvas flash
  const firstImage = new Image();
  firstImage.src = currentFrame(1);
  firstImage.onload = () => {
    ctx.drawImage(firstImage, 0, 0, canvas.width, canvas.height);
    canvas.classList.add('loaded');
  };
  images[1] = firstImage;

  // Start preloading the rest of the images
  preloadImages();

  // Overlay text elements
  const vt1 = document.getElementById('vt-1');
  const vt2 = document.getElementById('vt-2');
  const vt3 = document.getElementById('vt-3');

  let targetFrame = 1;
  let currentFrameFloat = 1;
  let lastDrawnFrame = 0;

  // Animation logic on scroll
  const handleScroll = () => {
    const sectionRect = section.getBoundingClientRect();
    
    // Calculate how far we've scrolled into the section (0 to 1)
    const scrollDistance = section.offsetHeight - window.innerHeight;
    let scrollFraction = -sectionRect.top / scrollDistance;
    
    // Clamp between 0 and 1
    scrollFraction = Math.max(0, Math.min(1, scrollFraction));
    
    // Calculate the target frame based on scroll fraction
    targetFrame = Math.min(
      frameCount,
      Math.max(1, (scrollFraction * (frameCount - 1)) + 1)
    );
  };

  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  });
  observer.observe(section);

  const renderLoop = () => {
    if (!isVisible) {
      requestAnimationFrame(renderLoop);
      return;
    }
    
    // Lerp (linear interpolation) for ultra-smooth gliding animation
    currentFrameFloat += (targetFrame - currentFrameFloat) * 0.08;
    
    const frameIndex = Math.round(currentFrameFloat);
    
    // Only draw if the frame actually changed to save performance
    if (frameIndex !== lastDrawnFrame) {
      if (images[frameIndex] && images[frameIndex].complete) {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         ctx.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
         lastDrawnFrame = frameIndex;
      }
      
      // Handle Text Overlays Fading In and Out
      if (frameIndex > 20 && frameIndex < 80) {
        vt1.classList.add('active');
      } else {
        vt1.classList.remove('active');
      }
      
      if (frameIndex > 100 && frameIndex < 160) {
        vt2.classList.add('active');
      } else {
        vt2.classList.remove('active');
      }
      
      if (frameIndex > 180 && frameIndex < 235) {
        vt3.classList.add('active');
      } else {
        vt3.classList.remove('active');
      }
    }
    
    requestAnimationFrame(renderLoop);
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Initial call
  handleScroll();
  requestAnimationFrame(renderLoop);
});
