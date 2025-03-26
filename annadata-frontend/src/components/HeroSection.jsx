import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    // Try to load images from assets in a specific order
    const tryImages = async () => {
      const possibleImages = [
        'farmer.jpg',
        'farmer.png',
        'farming.jpg',
        'farming.png',
        'agriculture.jpg',
        'agriculture.png',
        'crop.jpg',
        'crop.png',
        'field.jpg',
        'field.png'
      ];
      
      let foundImage = false;
      
      // Try to load each image until one works
      for (const imgName of possibleImages) {
        try {
          // Dynamic import to find an existing image
          const img = await import(`../assets/images/${imgName}`).catch(() => null);
          if (img && img.default) {
            setImageSrc(img.default);
            console.log(`Successfully loaded image: ${imgName}`);
            foundImage = true;
            break;
          }
        } catch (error) {
          console.log(`Image ${imgName} not found, trying next...`);
        }
      }
      
      // If no image was found, use the fallback
      if (!foundImage) {
        console.log("No local images found, using fallback image");
        setImageSrc("https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
      }
      
      setImageLoaded(true);
    };
    
    tryImages();
  }, []);

  return (
    <section className="hero-section hero-animated-bg">
      {/* Decorative elements */}
      <div className="dot-pattern"></div>
      <div className="shape-1"></div>
      <div className="shape-2"></div>
      
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 className="display-4 fw-bold mb-4">Empowering Farmers Across India</h1>
              <p className="lead mb-4">Connect with resources, knowledge, and markets to enhance your agricultural practices</p>
              <div className="d-flex gap-3 hero-buttons-container">
                <a href="/schemes" className="btn btn-success hero-btn">Explore Schemes</a>
                <a href="/about" className="btn btn-outline-success hero-btn">Learn More</a>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-image-container">
              <img 
                src={imageSrc || "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                className="hero-image" 
                alt="Indian Farmer in Field"
                onError={(e) => {
                  console.log("Image failed to load, using fallback");
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
