import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, signup } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useFlash } from '../context/FlashContext';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const { login: authLogin, signup: authSignup } = useAuth();
  const { addFlash } = useFlash();
  const navigate = useNavigate();
  const location = useLocation();
  
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
      const response = await login(loginData.username, loginData.password);
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
      const response = await signup(registerData);
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