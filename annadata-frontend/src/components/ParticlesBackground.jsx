import React, { useEffect, useRef } from 'react';

// Improved canvas-based particle system with better error handling
const ParticlesBackground = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    console.log("🆕 Using improved Canvas API implementation");
    
    // Create our own canvas for particles
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1'; // Lower z-index to be behind content
    canvas.style.pointerEvents = 'none';
    canvas.id = 'particles-canvas'; // Add ID for easier debugging
    
    // Find the hero section - try multiple selectors for better reliability
    const heroSection = document.querySelector('.hero-section') || 
                        document.querySelector('[class*="hero"]') || 
                        document.querySelector('section:first-of-type');
    
    if (!heroSection) {
      console.error("Hero section not found! Creating fallback container");
      // Create a fallback container if hero section isn't found
      const fallbackContainer = document.createElement('div');
      fallbackContainer.style.position = 'relative';
      fallbackContainer.className = 'fallback-hero-container';
      document.body.prepend(fallbackContainer);
      fallbackContainer.appendChild(canvas);
    } else {
      // Ensure hero section has position relative for absolute positioning to work
      const heroStyle = window.getComputedStyle(heroSection);
      if (heroStyle.position !== 'relative' && heroStyle.position !== 'absolute') {
        heroSection.style.position = 'relative';
      }
      
      // Add canvas to hero section
      heroSection.insertBefore(canvas, heroSection.firstChild);
    }
    
    // Set canvas dimensions with error handling
    const resizeCanvas = () => {
      try {
        const container = canvas.parentElement;
        if (!container) return;
        
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        console.log(`Canvas resized to ${canvas.width}x${canvas.height}`);
      } catch (err) {
        console.error("Error resizing canvas:", err);
      }
    };
    
    // Initial sizing
    setTimeout(resizeCanvas, 100); // Small delay to ensure DOM is ready
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Get rendering context with error handling
    let ctx;
    try {
      ctx = canvas.getContext('2d');
    } catch (err) {
      console.error("Failed to get canvas context:", err);
      // Clean up the canvas if we can't get context
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      return;
    }
    
    if (!ctx) {
      console.error("Canvas context not supported!");
      return;
    }
    
    // Create particles with a high-performance approach
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 70; // Fewer particles on mobile
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1, // Smaller radius
        color: '#4CAF50',
        vx: Math.random() * 0.4 - 0.2, // Slower movement
        vy: Math.random() * 0.4 - 0.2, // Slower movement
        connected: []
      });
    }
    
    particlesRef.current = particles;
    canvasRef.current = canvas;
    
    // Animation function with performance optimization
    const animate = () => {
      try {
        // Only proceed if we have a valid context and canvas
        if (!ctx || !canvas.parentNode) {
          console.log("Animation stopped: missing context or canvas removed");
          return;
        }
        
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw and update each particle
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          
          // Only draw connections for a subset of particles to improve performance
          if (i % 2 === 0) { // Process every other particle
            p.connected = [];
            for (let j = i + 1; j < particles.length; j += 2) { // Skip particles for better performance
              const p2 = particles[j];
              const dx = p.x - p2.x;
              const dy = p.y - p2.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              // Connect particles if they're close enough
              if (distance < 100) { // Reduced connection distance for better performance
                p.connected.push(j);
                
                // Draw line with alpha based on distance
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(76, 175, 80, ${0.8 - distance/125})`;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }
          }
          
          // Move particle
          p.x += p.vx;
          p.y += p.vy;
          
          // Bounce off walls
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }
        
        // Continue animation
        animationRef.current = requestAnimationFrame(animate);
      } catch (err) {
        console.error("Animation error:", err);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }
    };
    
    // Start animation with a small delay to ensure canvas is ready
    setTimeout(() => {
      animate();
      console.log("✅ Canvas particles animation started!");
    }, 200);
    
    // Cleanup function
    return () => {
      console.log("Cleaning up canvas particles");
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return null; // Component doesn't render anything itself
};

export default ParticlesBackground;
