import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHomePageData } from '../services/annadataService';
import { useFlash } from '../context/FlashContext';
import ConnectionStatus from '../components/ConnectionStatus.jsx';
import { defaultSchemeImage } from '../utils/defaultImages';

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
        
        // Only show flash message if it's not a GitHub environment
        // Since we expect network errors in GitHub environment
        if (!window.location.hostname.includes('github')) {
          addFlash(error.message || 'Failed to load home data', 'danger');
        }
        
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
      <section className="hero-section py-5 bg-light rounded mb-5 shadow-lg text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <h1 className="display-4 fw-bold text-success mb-3">{heroData.title}</h1>
              <p className="lead text-dark mb-4">{heroData.subtitle}</p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/schemes" className="btn btn-success btn-lg px-4 shadow-sm">
                  Explore Schemes
                </Link>
                <Link to="/forum" className="btn btn-outline-success btn-lg px-4 shadow-sm">
                  Join Forum
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Schemes */}
      <section className="featured-schemes mb-5">
        <div className="container">
          <h2 className="section-heading">Featured Agricultural Schemes</h2>
          <div className="row">
            {featuredSchemes.length > 0 ? (
              featuredSchemes.map((scheme) => (
                <div key={scheme._id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    {scheme.imageUrl ? (
                      <img 
                        src={scheme.imageUrl}
                        className="card-img-top"
                        alt={scheme.title}
                        style={{height: '160px', objectFit: 'cover'}}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultSchemeImage;
                        }}
                      />
                    ) : null}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-success">{scheme.title}</h5>
                      <p className="card-text flex-grow-1">{scheme.description?.substring(0, 100)}...</p>
                      <Link to={`/schemes/${scheme._id}`} className="btn btn-sm btn-outline-success mt-auto">
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
        </div>
      </section>

      {/* Latest Forum Questions */}
      <section className="latest-questions mb-4">
        <div className="container">
          <h2 className="section-heading">Latest Forum Questions</h2>
          <div className="list-group shadow-sm">
            {latestQuestions.length > 0 ? (
              latestQuestions.map((question) => (
                <Link
                  key={question._id}
                  to={`/forum/${question._id}`}
                  className="list-group-item list-group-item-action border-start border-success border-3"
                >
                  <div className="d-flex w-100 justify-content-between align-items-center mb-2">
                    <h5 className="mb-0 fw-bold">{question.title}</h5>
                    <small className="text-muted">
                      {new Date(question.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <p className="mb-2">{question.content?.substring(0, 150)}...</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      By {question.author?.username || 'Anonymous'}
                    </small>
                    <span className="badge bg-secondary">
                      {question.answers?.length || 0} answers
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="list-group-item">
                <p className="text-muted mb-0">No questions available.</p>
              </div>
            )}
          </div>
          <div className="text-end mt-3">
            <Link to="/forum" className="text-success text-decoration-none">
              Visit Forum <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;