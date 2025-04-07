import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHomePageData } from '../services/annadataService';
import { useFlash } from '../context/FlashContext';
import ConnectionStatus from '../components/ConnectionStatus.jsx';
import CountUp from '../components/CountUp';
import HeroSection from '../components/HeroSection';
// Import the CropDiseaseDetection component
import CropDiseaseDetection from '../components/CropDiseaseDetection.jsx';

// Import CSS
import '../styles/Home.css';
import '../styles/Home.part2.css';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [featuredSchemes, setFeaturedSchemes] = useState([]);
  const [latestQuestions, setLatestQuestions] = useState([]);
  const [cropDiseaseDetection, setCropDiseaseDetection] = useState(null);
  const { addFlash } = useFlash();

  // Add a state to track Google Translate initialization
  const [translateInitialized, setTranslateInitialized] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        const data = await getHomePageData();
        
        if (data.featuredSchemes) setFeaturedSchemes(data.featuredSchemes);
        if (data.latestQuestions) setLatestQuestions(data.latestQuestions);
        if (data.cropDiseaseDetection) setCropDiseaseDetection(data.cropDiseaseDetection);
        
      } catch (error) {
        console.error('Home data fetch error:', error);
        
        if (!window.location.hostname.includes('github')) {
          addFlash(error.message || 'Failed to load home data', 'danger');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [addFlash]);

  // Add a new useEffect for Google Translate initialization
  useEffect(() => {
    if (!translateInitialized && !loading) {
      // Define Google Translate callback function if not already defined
      if (!window.googleTranslateElementInit) {
        window.googleTranslateElementInit = function() {
          new window.google.translate.TranslateElement(
            { pageLanguage: 'en' },
            'google_translate_element'
          );
          
          // Fix Google Translate styling issues
          setTimeout(() => {
            const comboBox = document.querySelector('.goog-te-combo');
            if (comboBox) {
              comboBox.style.cssText = `
                display: block !important;
                visibility: visible !important;
                width: 100% !important;
                height: auto !important;
                background-color: white !important;
                color: black !important;
                padding: 8px !important;
                margin: 8px auto !important;
                border-radius: 4px !important;
                border: 1px solid #4CAF50 !important;
                font-size: 16px !important;
                max-width: 250px !important;
              `;
            }
            
            // Fix body positioning
            document.body.style.top = '0px';
            document.body.style.position = 'static';
            
            // Hide Google Translate banner
            const elements = document.querySelectorAll('.goog-te-banner-frame, .skiptranslate');
            elements.forEach(el => {
              if (el) {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
              }
            });
          }, 300);
        };
      }
      
      // Load Google Translate script if it hasn't been loaded
      if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);
      } else if (window.google && window.google.translate) {
        // If script is already loaded but not initialized
        window.googleTranslateElementInit();
      }
      
      setTranslateInitialized(true);
    }
  }, [loading, translateInitialized]);

  useEffect(() => {
    // Initialize Bootstrap carousel
    if (featuredSchemes.length > 0) {
      const carousel = document.getElementById('schemesCarousel');
      if (carousel && typeof window.bootstrap !== 'undefined') {
        new window.bootstrap.Carousel(carousel, {
          interval: 5000,
          touch: true
        });
      }
    }
  }, [featuredSchemes]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-container">
          <div className="spinner-border text-success spinner-lg" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <p className="mt-3 text-center text-success">Loading Annadata...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <ConnectionStatus />
      
      {/* Add Google Translate element container here */}
      <div className="language-container bg-light py-3">
        <div className="container d-flex justify-content-end">
          <div className="language-selector-wrapper">
            <div className="language-label d-flex align-items-center mb-2">
              <i className="bi bi-translate me-2"></i>
              <span>Translate to your language:</span>
            </div>
            <div id="google_translate_element" className="translate-element"></div>
          </div>
        </div>
      </div>
      
      {/* Hero section */}
      <HeroSection />

      <section className="stats-section py-5 bg-light">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3 col-6">
              <div className="stat-card p-4 bg-white rounded-4 shadow-sm h-100">
                <div className="stat-icon mb-3 text-success">
                  <i className="bi bi-flower3 fs-1"></i>
                </div>
                <h3 className="stat-number">
                  <CountUp end={50} suffix="+" />
                </h3>
                <p className="stat-label text-muted">Agricultural Schemes</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card p-4 bg-white rounded-4 shadow-sm h-100">
                <div className="stat-icon mb-3 text-success">
                  <i className="bi bi-people fs-1"></i>
                </div>
                <h3 className="stat-number">
                  <CountUp end={10000} suffix="+" />
                </h3>
                <p className="stat-label text-muted">Farmers Joined</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card p-4 bg-white rounded-4 shadow-sm h-100">
                <div className="stat-icon mb-3 text-success">
                  <i className="bi bi-chat-dots fs-1"></i>
                </div>
                <h3 className="stat-number">
                  <CountUp end={500} suffix="+" />
                </h3>
                <p className="stat-label text-muted">Forum Questions</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card p-4 bg-white rounded-4 shadow-sm h-100">
                <div className="stat-icon mb-3 text-success">
                  <i className="bi bi-bar-chart fs-1"></i>
                </div>
                <h3 className="stat-number">
                  <CountUp end={95} suffix="%" />
                </h3>
                <p className="stat-label text-muted">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add the AI Crop Disease Detection section - using cropDiseaseDetection instead of homeData */}
      {cropDiseaseDetection && (
        <section className="disease-detection-section py-5">
          <div className="container">
            <CropDiseaseDetection data={cropDiseaseDetection} />
          </div>
        </section>
      )}

      <section className="featured-schemes-section py-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h6 className="text-uppercase text-success fw-bold">Explore</h6>
            <h2 className="display-5 fw-bold">Featured Agricultural Schemes</h2>
            <div className="divider mx-auto my-3"></div>
            <p className="text-muted lead">Discover resources and support available to farmers</p>
          </div>

          {featuredSchemes.length > 0 ? (
            <div className="schemes-carousel">
              <div id="schemesCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {Array.from({ length: Math.ceil(featuredSchemes.length / 2) }).map((_, index) => (
                    <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                      <div className="schemes-pair-container">
                        <div className="row schemes-row">
                          {featuredSchemes.slice(index * 2, index * 2 + 2).map((scheme) => (
                            <div className="col-md-6 scheme-column" key={scheme._id}>
                              <div className="scheme-card h-100">
                                <div className="scheme-image-container">
                                  <img 
                                    src={scheme.imageUrl || "https://via.placeholder.com/350x200/4CAF50/FFFFFF?text=Scheme"}
                                    className="scheme-image"
                                    alt={scheme.title}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "https://via.placeholder.com/350x200/4CAF50/FFFFFF?text=Scheme";
                                    }}
                                  />
                                  {scheme.category && (
                                    <div className="scheme-category">
                                      {scheme.category}
                                    </div>
                                  )}
                                </div>
                                <div className="scheme-content">
                                  <h5 className="scheme-title">{scheme.title}</h5>
                                  <p className="scheme-description">{scheme.description?.substring(0, 80)}...</p>
                                  <Link to={`/schemes/${scheme._id}`} className="btn btn-outline-success btn-sm d-flex align-items-center gap-2 justify-content-center mt-auto">
                                    Learn More <i className="bi bi-arrow-right"></i>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="carousel-control-prev" type="button" data-bs-target="#schemesCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon schemes-carousel-control" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#schemesCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon schemes-carousel-control" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
                
                <div className="carousel-indicators schemes-indicators">
                  {Array.from({ length: Math.ceil(featuredSchemes.length / 2) }).map((_, index) => (
                    <button 
                      key={index}
                      type="button" 
                      data-bs-target="#schemesCarousel" 
                      data-bs-slide-to={index} 
                      className={index === 0 ? 'active' : ''}
                      aria-current={index === 0 ? 'true' : 'false'}
                      aria-label={`Slide ${index + 1}`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-info">No featured schemes available.</div>
          )}
          
          <div className="text-center mt-5">
            <Link to="/schemes" className="btn btn-success px-4 py-2 d-inline-flex align-items-center gap-2">
              View All Schemes <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div>
                <h6 className="text-uppercase text-success fw-bold">Why Choose Us</h6>
                <h2 className="display-5 fw-bold mb-4">Empowering Farmers with Knowledge and Resources</h2>
                
                <div className="feature-item d-flex align-items-start mb-4">
                  <div className="feature-icon me-3 mt-1">
                    <div className="icon-circle">
                      <i className="bi bi-lightning text-success"></i>
                    </div>
                  </div>
                  <div>
                    <h5>Quick Access to Schemes</h5>
                    <p className="text-muted">Find and apply for government agricultural schemes all in one place.</p>
                  </div>
                </div>
                
                <div className="feature-item d-flex align-items-start mb-4">
                  <div className="feature-icon me-3 mt-1">
                    <div className="icon-circle">
                      <i className="bi bi-people text-success"></i>
                    </div>
                  </div>
                  <div>
                    <h5>Farmer Community</h5>
                    <p className="text-muted">Connect with other farmers, share experiences, and learn from each other.</p>
                  </div>
                </div>
                
                <div className="feature-item d-flex align-items-start">
                  <div className="feature-icon me-3 mt-1">
                    <div className="icon-circle">
                      <i className="bi bi-file-text text-success"></i>
                    </div>
                  </div>
                  <div>
                    <h5>Expert Knowledge Base</h5>
                    <p className="text-muted">Access agricultural best practices, tips, and techniques from experts.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="feature-animation">
                <img 
                  // src={require('../assets/images/farmer.jpg')} 
                  alt="Community Illustration"
                  className="img-fluid" 
                  onError={(e) => {
                    e.target.onerror = null;
                    // Try a series of fallbacks for maximum reliability
                    try {
                      e.target.src = require('../assets/images/farming.jpg');
                    } catch (err) {
                      try {
                        e.target.src = require('../assets/images/agriculture.jpg');
                      } catch (err2) {
                        // Final fallback to placeholder
                        e.target.src = "https://via.placeholder.com/500x400/4CAF50/FFFFFF?text=Community";
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="forum-questions-section py-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h6 className="text-uppercase text-success fw-bold">Community</h6>
            <h2 className="display-5 fw-bold">Latest Forum Questions</h2>
            <div className="divider mx-auto my-3"></div>
            <p className="text-muted lead">Join the conversation with farmers across the country</p>
          </div>

          <div className="row">
            {latestQuestions.length > 0 ? (
              latestQuestions.slice(0, 4).map((question) => (
                <div key={question._id} className="col-md-6 mb-4">
                  <div className="question-card h-100">
                    <Link to={`/forum/${question._id}`} className="question-link">
                      <div className="question-content">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h5 className="question-title mb-0">{question.title}</h5>
                          <span className="question-date">{new Date(question.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="question-excerpt">{question.content?.substring(0, 120)}...</p>
                        <div className="question-meta d-flex justify-content-between align-items-center">
                          <span className="question-author">By {question.author?.username || 'Anonymous'}</span>
                          <div className="d-flex align-items-center">
                            <span className="question-upvotes me-3">
                              <i className="bi bi-hand-thumbs-up me-1"></i>
                              {question.upvotes || 0}
                            </span>
                            <span className="question-answers">
                              <i className="bi bi-chat-dots me-1"></i>
                              {question.answers?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-info">No questions available.</div>
              </div>
            )}
          </div>

          <div className="text-center mt-4">
            <Link to="/forum" className="btn btn-success px-4 py-2 d-inline-flex align-items-center gap-2">
              Visit Forum <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-section py-5">
        <div className="container">
          <div className="cta-wrapper bg-success text-white text-center p-5 rounded-4">
            <div>
              <h2 className="display-5 fw-bold mb-3">Join Annadata Today</h2>
              <p className="lead mb-4">Connect with farmers, access agricultural schemes, and grow together.</p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/login" className="btn btn-light btn-lg px-4">
                  Sign Up Now
                </Link>
                <Link to="/schemes" className="btn btn-outline-light btn-lg px-4">
                  Explore Schemes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;