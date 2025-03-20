import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getHomePageData } from '../services/annadataService';
import { useFlash } from '../context/FlashContext';
import ConnectionStatus from '../components/ConnectionStatus.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaLeaf, FaUsers, FaFileAlt, FaSeedling } from 'react-icons/fa';
import { HiLightningBolt, HiOutlineChatAlt, HiChartBar } from 'react-icons/hi';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper';
import Lottie from 'lottie-react';
import AOS from 'aos';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import { defaultSchemeImage } from '../utils/defaultImages';

// Register Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);

// Import styles - use the original Home.css for now
import '../styles/Home.css';
import '../styles/Home.part2.css'; // Import part2 separately until merge script runs

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

// Import AOS styles
import 'aos/dist/aos.css';

// Import animation data
import farmingAnimation from '../assets/animations/farming-animation.json';
import communityAnimation from '../assets/animations/community-animation.json';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroData, setHeroData] = useState({
    title: 'Welcome to Annadata',
    subtitle: 'Your one-stop platform for agricultural resources and community'
  });
  const [featuredSchemes, setFeaturedSchemes] = useState([]);
  const [latestQuestions, setLatestQuestions] = useState([]);
  const { addFlash } = useFlash();

  // Stats section with animation
  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Initialize AOS for scroll animations
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);

  // Particles initialization
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // console.log(container);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getHomePageData();
        
        if (data.hero) {
          setHeroData({
            title: data.hero.title || 'Welcome to Annadata',
            subtitle: data.hero.subtitle || 'Your one-stop platform for agricultural resources and community'
          });
        }
        
        if (data.featuredSchemes) setFeaturedSchemes(data.featuredSchemes);
        if (data.latestQuestions) setLatestQuestions(data.latestQuestions);
        
      } catch (error) {
        console.error('Home data fetch error:', error);
        setError(error);
        
        if (!window.location.hostname.includes('github')) {
          addFlash(error.message || 'Failed to load home data', 'danger');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [addFlash]);

  // Card variants for animations
  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-container">
          <div className="spinner-border text-success spinner-lg" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 text-center text-success"
        >
          Loading Annadata...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Connection status indicator */}
      <ConnectionStatus />
      
      {/* Hero Section with Particles Background */}
      <section className="hero-section position-relative overflow-hidden">
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 60,
            particles: {
              color: {
                value: "#4CAF50",
              },
              links: {
                color: "#4CAF50",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
          style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}
        />

        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center py-5">
            <div className="col-lg-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="hero-content"
              >
                <h1 className="display-3 fw-bold text-success mb-3">
                  {heroData.title}
                </h1>
                <p className="lead fs-4 mb-4">
                  {heroData.subtitle}
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/schemes" className="btn btn-success btn-lg px-4 py-3 d-flex align-items-center gap-2">
                      Explore Schemes <FaArrowRight />
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/forum" className="btn btn-outline-success btn-lg px-4 py-3 d-flex align-items-center gap-2">
                      Join Forum <HiOutlineChatAlt size={18} />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hero-animation"
              >
                <Lottie 
                  animationData={farmingAnimation} 
                  loop={true} 
                  style={{ height: 400, maxWidth: '100%' }} 
                />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,160L48,138.7C96,117,192,75,288,69.3C384,64,480,96,576,128C672,160,768,192,864,176C960,160,1056,96,1152,74.7C1248,53,1344,75,1392,85.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-light">
        <div className="container">
          <div 
            className="row g-4 text-center" 
            ref={statsRef}
          >
            <div className="col-md-3 col-6">
              <div className="stat-card p-4 bg-white rounded-4 shadow-sm h-100">
                <div className="stat-icon mb-3 text-success">
                  <FaSeedling size={32} />
                </div>
                <h3 className="stat-number">
                  {statsInView && <CountUp end={50} duration={2.5} />}+
                </h3>
                <p className="stat-label text-muted">Agricultural Schemes</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card p-4 bg-white rounded-4 shadow-sm h-100">
                <div className="stat-icon mb-3 text-success">
                  <FaUsers size={32} />
                </div>
                <h3 className="stat-number">
                  {statsInView && <CountUp end={10000} duration={2.5} />}+
                </h3>
                <p className="stat-label text-muted">Farmers Joined</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card p-4 bg-white rounded-4 shadow-sm h-100">
                <div className="stat-icon mb-3 text-success">
                  <HiOutlineChatAlt size={32} />
                </div>
                <h3 className="stat-number">
                  {statsInView && <CountUp end={500} duration={2.5} />}+
                </h3>
                <p className="stat-label text-muted">Forum Questions</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card p-4 bg-white rounded-4 shadow-sm h-100">
                <div className="stat-icon mb-3 text-success">
                  <HiChartBar size={32} />
                </div>
                <h3 className="stat-number">
                  {statsInView && <CountUp end={95} duration={2.5} suffix="%" />}
                </h3>
                <p className="stat-label text-muted">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Schemes with Carousel */}
      <section className="featured-schemes-section py-5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="section-header text-center mb-5"
          >
            <h6 className="text-uppercase text-success fw-bold">Explore</h6>
            <h2 className="display-5 fw-bold">Featured Agricultural Schemes</h2>
            <div className="divider mx-auto my-3"></div>
            <p className="text-muted lead">Discover resources and support available to farmers</p>
          </motion.div>

          {featuredSchemes.length > 0 ? (
            <Swiper
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              className="mySwiper py-5"
            >
              {featuredSchemes.map((scheme) => (
                <SwiperSlide key={scheme._id} className="swiper-slide-custom">
                  <div className="scheme-card h-100">
                    <div className="scheme-image-container">
                      <img 
                        src={scheme.imageUrl || defaultSchemeImage}
                        className="scheme-image"
                        alt={scheme.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultSchemeImage;
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
                      <p className="scheme-description">{scheme.description?.substring(0, 100)}...</p>
                      <Link to={`/schemes/${scheme._id}`} className="btn btn-outline-success btn-sm d-flex align-items-center gap-2 justify-content-center">
                        Learn More <FaArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="alert alert-info">No featured schemes available.</div>
          )}
          
          <div className="text-center mt-4">
            <Link to="/schemes" className="btn btn-success px-4 py-2 d-inline-flex align-items-center gap-2">
              View All Schemes <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h6 className="text-uppercase text-success fw-bold">Why Choose Us</h6>
                <h2 className="display-5 fw-bold mb-4">Empowering Farmers with Knowledge and Resources</h2>
                
                <div className="feature-item d-flex align-items-start mb-4">
                  <div className="feature-icon me-3 mt-1">
                    <div className="icon-circle">
                      <HiLightningBolt className="text-success" size={24} />
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
                      <FaUsers className="text-success" size={24} />
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
                      <FaFileAlt className="text-success" size={24} />
                    </div>
                  </div>
                  <div>
                    <h5>Expert Knowledge Base</h5>
                    <p className="text-muted">Access agricultural best practices, tips, and techniques from experts.</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="col-lg-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="feature-animation"
              >
                <Lottie 
                  animationData={communityAnimation} 
                  loop={true} 
                  style={{ maxWidth: '100%', height: 400 }} 
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Forum Questions */}
      <section className="forum-questions-section py-5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="section-header text-center mb-5"
          >
            <h6 className="text-uppercase text-success fw-bold">Community</h6>
            <h2 className="display-5 fw-bold">Latest Forum Questions</h2>
            <div className="divider mx-auto my-3"></div>
            <p className="text-muted lead">Join the conversation with farmers across the country</p>
          </motion.div>

          <div className="row">
            {latestQuestions.length > 0 ? (
              <AnimatePresence>
                {latestQuestions.map((question, index) => (
                  <motion.div 
                    key={question._id}
                    className="col-md-6 mb-4"
                    variants={cardVariants}
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: index * 0.1 }}
                  >
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
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="col-12">
                <div className="alert alert-info">No questions available.</div>
              </div>
            )}
          </div>

          <div className="text-center mt-4">
            <Link to="/forum" className="btn btn-success px-4 py-2 d-inline-flex align-items-center gap-2">
              Visit Forum <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="cta-wrapper bg-success text-white text-center p-5 rounded-4">
            <motion.div
              whileInView={{ scale: [0.9, 1] }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
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
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;