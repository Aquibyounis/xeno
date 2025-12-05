import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLogin, switchToSignup }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('https://xeno-backend-3ddp.onrender.com/api/auth/login', formData);
      if (res.data.success) {
        onLogin(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to manage your store</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              name="username" 
              placeholder="Enter username" 
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>

          <button type="submit" className="auth-btn">Login</button>
        </form>

        <p className="auth-switch">
            New to Xeno? <span onClick={switchToSignup}>Create Account</span>
        </p>
      </div>
    </div>
  );
}

export default Login;