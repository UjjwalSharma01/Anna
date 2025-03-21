// Create a SchemeDetail component to handle scheme/:id routes

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSchemeById } from '../services/annadataService';
import { useFlash } from '../context/FlashContext';
import { defaultSchemeImage } from '../utils/defaultImages';

const SchemeDetail = () => {
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { addFlash } = useFlash();
  
  useEffect(() => {
    const fetchScheme = async () => {
      try {
        setLoading(true);
        const data = await getSchemeById(id);
        setScheme(data);
      } catch (error) {
        console.error('Error fetching scheme details:', error);
        setError(error);
        addFlash(error.message || 'Failed to load scheme details', 'danger');
      } finally {
        setLoading(false);
      }
    };
    
    fetchScheme();
  }, [id, addFlash]);
  
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
        <h4>Error loading scheme</h4>
        <p>{error.message || "Unknown error occurred"}</p>
        <Link to="/schemes" className="btn btn-outline-success mt-3">
          Back to Schemes
        </Link>
      </div>
    );
  }
  
  if (!scheme) {
    return (
      <div className="alert alert-info">
        <h4>Scheme not found</h4>
        <Link to="/schemes" className="btn btn-outline-success mt-3">
          Back to Schemes
        </Link>
      </div>
    );
  }
  
  return (
    <div className="scheme-detail-page container">
      <div className="row mb-4">
        <div className="col-12">
          <Link to="/schemes" className="btn btn-outline-success mb-4">
            &larr; Back to Schemes
          </Link>
          
          <div className="card shadow-sm">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={scheme.imageUrl || defaultSchemeImage}
                  className="img-fluid rounded-start h-100 w-100"
                  alt={scheme.title}
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultSchemeImage;
                  }}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h1 className="card-title">{scheme.title}</h1>
                  <span className="badge bg-success mb-3">{scheme.category}</span>
                  <p className="card-text">{scheme.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Eligibility</h5>
            </div>
            <div className="card-body">
              <p>{scheme.eligibility || "No eligibility criteria specified."}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Benefits</h5>
            </div>
            <div className="card-body">
              <p>{scheme.benefits || "No benefits specified."}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Application Process</h5>
            </div>
            <div className="card-body">
              <p>{scheme.applicationProcess || "No application process specified."}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Documents Required</h5>
            </div>
            <div className="card-body">
              {scheme.documentRequired && scheme.documentRequired.length > 0 ? (
                <ul>
                  {scheme.documentRequired.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              ) : (
                <p>No documents specified.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="d-grid gap-2 col-md-6 mx-auto mb-4">
        {scheme.website && (
          <a 
            href={scheme.website} 
            className="btn btn-success" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Visit Official Website
          </a>
        )}
        <Link to={`/schemes/${scheme._id}/apply`} className="btn btn-outline-success">
          Apply for this Scheme
        </Link>
      </div>
    </div>
  );
};

export default SchemeDetail;
