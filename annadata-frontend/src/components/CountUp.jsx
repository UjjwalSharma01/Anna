import React, { useState, useEffect, useRef } from 'react';

const CountUp = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const startTime = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    // Reset animation when end value changes
    startTime.current = null;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    
    const animate = (timestamp) => {
      if (!startTime.current) {
        startTime.current = timestamp;
      }
      
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      
      // Easing function for a smoother animation
      const easeOutQuad = (t) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      // Calculate current count
      const currentCount = Math.floor(easedProgress * end);
      setCount(currentCount);
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure we reach exactly the final value
        setCount(end);
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration]);
  
  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <span className="count-up">
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default CountUp;
