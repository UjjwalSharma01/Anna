import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, signup } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useFlash } from '../context/FlashContext';

const Auth = () => {
  console.log('[AUTH] Auth component rendering');
  
  useEffect(() => {
    console.log('[AUTH] Auth component mounted');
    return () => console.log('[AUTH] Auth component unmounted');
  }, []);

  // Default to login tab when coming from /login path
  const location = useLocation();
  console.log('[AUTH] Current location:', location);

  const [activeTab, setActiveTab] = useState(
    location.pathname === '/login' ? 'login' : 'login'
  );
  const [loading, setLoading] = useState(false);
  
  // Login form state - updated to match EJS form fields
  const [loginData, setLoginData] = useState({
    username: '',
    email: '',  // Added email field to match EJS login form
    password: ''
  });
  
  // Register form state - updated to match EJS form fields
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',  // Added to match EJS signup form
    land_area: '',  // Added to match EJS signup form
    income: ''  // Added to match EJS signup form
  });
  
  const { login: authLogin, signup: authSignup } = useAuth();
  const { addFlash } = useFlash();
  const navigate = useNavigate();
  
  // Get redirect path from location state or default to home
  const from = location.state?.from || '/';

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Updated to pass all required fields
      const response = await login(loginData);
      authLogin(response.token);
      navigate(from, { replace: true });
    } catch (error) {
      addFlash(error.message || 'Login failed. Please check your credentials.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      return addFlash('Passwords do not match', 'danger');
    }

    setLoading(true);
    
    try {
      // Remove confirmPassword as it's not needed in the API
      const { confirmPassword, ...signupData } = registerData;
      const response = await signup(signupData);
      authSignup(response.token);
      navigate(from, { replace: true });
    } catch (error) {
      addFlash(error.message || 'Registration failed. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {console.log('[AUTH] Rendering Auth UI')}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-light">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => setActiveTab('login')}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
                    onClick={() => setActiveTab('register')}
                  >
                    Register
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="card-body p-4">
              {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={loginData.username}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="login-email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="login-email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit}>
                  <div className="mb-3">
                    <label htmlFor="register-username" className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="register-username"
                      name="username"
                      value={registerData.username}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="register-password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="register-password"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirm-password"
                      name="confirmPassword"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      name="location"
                      value={registerData.location}
                      onChange={handleRegisterChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="land_area" className="form-label">Land Area</label>
                    <input
                      type="number"
                      className="form-control"
                      id="land_area"
                      name="land_area"
                      value={registerData.land_area}
                      onChange={handleRegisterChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="income" className="form-label">Income</label>
                    <input
                      type="number"
                      className="form-control"
                      id="income"
                      name="income"
                      value={registerData.income}
                      onChange={handleRegisterChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registering...
                      </>
                    ) : (
                      'Register'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;