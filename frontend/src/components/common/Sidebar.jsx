// Sidebar component for the Beej application

import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-light">
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a href="/" className="nav-link active" aria-current="page">
            <i className="bi bi-speedometer2 me-2"></i>
            डैशबोर्ड
          </a>
        </li>
        <li>
          <a href="/seed-inspection" className="nav-link link-dark">
            <i className="bi bi-clipboard-check me-2"></i>
            बीज निरीक्षण
          </a>
        </li>
        <li>
          <a href="/seed-samples" className="nav-link link-dark">
            <i className="bi bi-collection me-2"></i>
            नमूने
          </a>
        </li>
        <li>
          <a href="/reports" className="nav-link link-dark">
            <i className="bi bi-file-earmark-bar-graph me-2"></i>
            रिपोर्ट
          </a>
        </li>
        <li>
          <a href="/settings" className="nav-link link-dark">
            <i className="bi bi-gear me-2"></i>
            सेटिंग्स
          </a>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <a href="#" className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://via.placeholder.com/32" alt="" width="32" height="32" className="rounded-circle me-2" />
          <strong>उपयोगकर्ता</strong>
        </a>
        <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
          <li><a className="dropdown-item" href="#">प्रोफाइल</a></li>
          <li><hr className="dropdown-divider" /></li>
          <li><a className="dropdown-item" href="#">लॉग आउट</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
