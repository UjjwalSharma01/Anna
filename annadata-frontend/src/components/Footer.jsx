import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-success text-white py-4">
      <div className="container">
        {/* Company Info */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h4 className="mb-2">Annadata</h4>
            <p className="mb-0">
              © {currentYear} Annadata<br />
              Created for farmers, by farmers
            </p>
          </div>
        </div>
        
        <hr className="border-light opacity-25 my-4" />
        
        {/* Two Column Layout: Quick Links (left) and Contact (right) */}
        <div className="row">
          {/* Quick Links Column - Left Side */}
          <div className="col-md-6 mb-4 mb-md-0">
            <h5 className="mb-3 fw-bold">Quick Links</h5>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="/" className="text-white text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/schemes" className="text-white text-decoration-none">Schemes</Link></li>
              <li className="mb-2"><Link to="/forum" className="text-white text-decoration-none">Forum</Link></li>
              {/* Example of fixing login links if they exist */}
              {/* <Link to="/auth" className="text-white text-decoration-none">Login/Register</Link> */}
            </ul>
          </div>
          
          {/* Contact Column - Right Side with custom class */}
          <div className="col-md-6 mb-4 mb-md-0 text-md-end contact-column">
            <h5 className="mb-3 fw-bold">Contact</h5>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <a href="mailto:info@annadata.org" className="text-white text-decoration-none">
                  <i className="bi bi-envelope me-2"></i>info@annadata.org
                </a>
              </li>
              <li className="mb-2">
                <span className="text-white">
                  <i className="bi bi-telephone me-2"></i>+91-123-456-7890
                </span>
              </li>
              <li className="mb-2">
                <span className="text-white">
                  <i className="bi bi-geo-alt me-2"></i>New Delhi, India
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
