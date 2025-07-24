// Login page for the Beej application

import React, { useState } from 'react';
import { authService } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would redirect to dashboard
      await authService.signIn(email, password);
      alert('Login successful! Redirecting...');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card login-card shadow-lg">
        <div className="card-header bg-primary text-white text-center py-3">
          <h3>बीज (Beej) - लॉगिन</h3>
          <p className="mb-0">छत्तीसगढ़ राज्य बीज वितरण एवं गुण नियंत्रण मॉड्यूल</p>
        </div>
        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email">ईमेल</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password">पासवर्ड</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'लोड हो रहा है...' : 'लॉगिन करें'}
            </button>
          </form>
        </div>
        <div className="card-footer text-center">
          <small className="text-muted">
            कृषि विभाग, छत्तीसगढ़ शासन
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
