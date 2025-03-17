import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHomePageData } from '../services/annadataService';
import { useFlash } from '../context/FlashContext';
import ConnectionStatus from '../components/ConnectionStatus.jsx';
import ImageWithFallback from '../components/ImageWithFallback';
import { defaultHeroImage, fallbackImages } from '../utils/defaultImages';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState({
    title: 'Welcome to Annadata',
    subtitle: 'Your one-stop platform for agricultural resources and community',
    imageUrl: defaultHeroImage // Use the base64 image as default
  });
  const [featuredSchemes, setFeaturedSchemes] = useState([]);
  const [latestQuestions, setLatestQuestions] = useState([]);
  const { addFlash } = useFlash();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const data = await getHomePageData();
        if (data.hero) {
          // Keep the default image if no valid image URL is provided
          setHeroData({
            ...data.hero,
            imageUrl: data.hero.imageUrl || defaultHeroImage
          });
        }
        if (data.featuredSchemes) setFeaturedSchemes(data.featuredSchemes);
        if (data.latestQuestions) setLatestQuestions(data.latestQuestions);
      } catch (error) {
        console.error('Home data fetch error:', error);
        addFlash(error.message || 'Failed to load home data', 'danger');
        // Keep the app functional with default data
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [addFlash]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Connection status indicator */}
      <ConnectionStatus />
      
      {/* Hero Section */}
      <section 
        className="hero-section py-5 bg-light rounded mb-4 shadow-lg fade-in"
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold text-success">{heroData.title}</h1>
              <p className="lead text-dark">{heroData.subtitle}</p>
              <div className="d-flex gap-3 mt-4">
                <Link to="/schemes" className="btn btn-success btn-lg shadow-sm">
                  Explore Schemes
                </Link>
                <Link to="/forum" className="btn btn-outline-success btn-lg shadow-sm">
                  Join Forum
                </Link>
              </div>
            </div>
            <div className="col-md-6">
              <ImageWithFallback
                src={heroData.imageUrl}
                fallbackSrc={fallbackImages.hero}
                alt="Hero"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Schemes */}
      <section 
        className="featured-schemes mb-4 fade-in"
        style={{ animationDelay: '0.2s' }}
      >
        <h2 className="mb-4 border-start border-success ps-3 border-4">Featured Agricultural Schemes</h2>
        <div className="row">
          {featuredSchemes.length > 0 ? (
            featuredSchemes.map((scheme) => (
              <div 
                key={scheme._id} 
                className="col-md-4 mb-3"
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-success">{scheme.title}</h5>
                    <p className="card-text">{scheme.description.substring(0, 100)}...</p>
                    <Link to={`/schemes/${scheme._id}`} className="btn btn-sm btn-outline-success">
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info">No featured schemes available.</div>
            </div>
          )}
        </div>
        <div className="text-end mt-3">
          <Link to="/schemes" className="text-success text-decoration-none">
            View All Schemes <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* Latest Forum Questions */}
      <section 
        className="latest-questions fade-in"
        style={{ animationDelay: '0.4s' }}
      >
        <h2 className="mb-4 border-start border-success ps-3 border-4">Latest Forum Questions</h2>
        <div className="list-group shadow-sm">
          {latestQuestions.length > 0 ? (
            latestQuestions.map((question) => (
              <Link
                key={question._id}
                to={`/forum/${question._id}`}
                className="list-group-item list-group-item-action border-start border-success"
              >
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{question.title}</h5>
                  <small className="text-muted">
                    {new Date(question.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <p className="mb-1">{question.content.substring(0, 150)}...</p>
                <small className="text-muted">
                  By {question.author?.username || 'Anonymous'} · {question.answers?.length || 0} answers
                </small>
              </Link>
            ))
          ) : (
            <div className="list-group-item">
              <p className="text-muted">No questions available.</p>
            </div>
          )}
        </div>
        <div className="text-end mt-3">
          <Link to="/forum" className="text-success text-decoration-none">
            Visit Forum <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;