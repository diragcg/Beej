// Navbar component for the Beej application

import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          बीज (Beej)
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">डैशबोर्ड</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/seed-inspection">बीज निरीक्षण</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/seed-samples">नमूने</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/reports">रिपोर्ट</a>
            </li>
          </ul>
          <div className="d-flex">
            <span className="navbar-text me-3">
              User Name
            </span>
            <button className="btn btn-outline-light" type="button">
              लॉग आउट
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
