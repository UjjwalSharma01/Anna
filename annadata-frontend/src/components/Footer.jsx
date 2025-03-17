import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-success py-3 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <span className="text-white">© {currentYear} Annadata</span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <span className="text-white">
              Created for farmers, by farmers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
