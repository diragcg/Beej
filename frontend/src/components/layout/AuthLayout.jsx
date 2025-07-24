// Auth Layout component for the Beej application

import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../common/Footer';

const AuthLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
        {children || <Outlet />}
      </div>
      <Footer />
    </div>
  );
};

export default AuthLayout;
