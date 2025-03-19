import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSchemes } from '../services/annadataService';
import { useFlash } from '../context/FlashContext';
import { defaultSchemeImage } from '../utils/defaultImages';

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);
  const { addFlash } = useFlash();

  // Enhanced error handling for API calls
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching schemes...");
        const data = await getSchemes();
        console.log("Schemes data received:", data);
        
        // Check if data exists and has schemes property
        if (!data || !Array.isArray(data.schemes)) {
          console.error("Invalid data format:", data);
          throw new Error('Invalid data format received from server');
        }
        
        setSchemes(data.schemes || []);
        
        // Extract unique categories with null check
        const validSchemes = data.schemes || [];
        const uniqueCategories = [...new Set(validSchemes
          .map(s => s?.category)
          .filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching schemes:', error);
        setError(error);
        addFlash(error.message || 'Failed to load schemes', 'danger');
        // Set empty defaults on error
        setSchemes([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [addFlash]);

  // Filter schemes based on search and category
  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.title?.toLowerCase().includes(filter.toLowerCase()) || 
                        (scheme.description && scheme.description.toLowerCase().includes(filter.toLowerCase()));
    const matchesCategory = selectedCategory === '' || scheme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h4>Error loading schemes</h4>
        <p>{error.message || "Unknown error occurred"}</p>
        <button 
          className="btn btn-outline-danger" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="schemes-page container">
      <div className="fade-in">
        <h1 className="mb-4 border-bottom border-success pb-2">Agricultural Schemes</h1>
        
        <div className="row mb-4">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="Search schemes..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select shadow-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredSchemes.length > 0 ? (
        <div className="row">
          {filteredSchemes.map((scheme, index) => (
            <div
              key={scheme._id || index}
              className="col-lg-4 col-md-6 mb-4 fade-in"
              style={{ animationDelay: `${(index % 6) * 0.1}s` }}
            >
              <div className="card h-100 shadow-sm">
                {scheme.imageUrl ? (
                  <img
                    src={scheme.imageUrl}
                    className="card-img-top"
                    alt={scheme.title}
                    loading="lazy"
                    style={{height: '160px', objectFit: 'cover'}}
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = defaultSchemeImage;
                    }}
                  />
                ) : (
                  <img
                    src={defaultSchemeImage}
                    className="card-img-top"
                    alt={scheme.title}
                    loading="lazy"
                    style={{height: '160px', objectFit: 'cover'}}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{scheme.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {scheme.category && (
                      <span className="badge bg-success me-2">{scheme.category}</span>
                    )}
                  </h6>
                  <p className="card-text">
                    {scheme.description?.length > 120
                      ? `${scheme.description.substring(0, 120)}...`
                      : scheme.description}
                  </p>
                </div>
                <div className="card-footer bg-white border-top-0">
                  <Link
                    to={`/schemes/${scheme._id}`}
                    className="btn btn-outline-success btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          No schemes match your search criteria. Try adjusting your filters.
        </div>
      )}
    </div>
  );
};

export default Schemes;