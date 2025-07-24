// Footer component for the Beej application

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <span className="text-muted">
              © {currentYear} कृषि विभाग, छत्तीसगढ़ शासन
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <span className="text-muted">
              बीज वितरण एवं गुण नियंत्रण मॉड्यूल
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
