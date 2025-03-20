import React, { useEffect, useRef } from 'react';

// Simple, reliable canvas-based particle system that doesn't depend on external libraries
const ParticlesBackground = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    console.log("🆕 Using guaranteed Canvas API implementation");
    
    // Create our own canvas for particles
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
    
    // Get the hero section and add our canvas to it
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) {
      console.error("Hero section not found!");
      return;
    }
    
    // Add canvas to hero section
    if (heroSection.firstChild) {
      heroSection.insertBefore(canvas, heroSection.firstChild);
    } else {
      heroSection.appendChild(canvas);
    }
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    };
    
    // Initial sizing
    resizeCanvas();
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Get rendering context
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Canvas context not supported!");
      return;
    }
    
    // Create particles (100 should be enough for our effect)
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: '#4CAF50',
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1 - 0.5,
        connected: []
      });
    }
    
    particlesRef.current = particles;
    canvasRef.current = canvas;
    
    // Animation function to update and render particles
    const animate = () => {
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
        
        // Find nearby particles to connect
        p.connected = [];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Connect particles if they're close enough
          if (distance < 150) {
            p.connected.push(j);
            
            // Draw line
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(76, 175, 80, ${0.8 - distance/150})`;
            ctx.lineWidth = 1;
            ctx.stroke();
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
    };
    
    // Start animation
    animate();
    console.log("✅ Canvas particles animation started!");
    
    // Cleanup function
    return () => {
      console.log("Cleaning up canvas particles");
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.remove();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return null; // Component doesn't render anything itself
};

export default ParticlesBackground;
