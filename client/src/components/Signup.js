import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // Shared CSS for Login/Signup

function Signup({ onSignupSuccess, switchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    shop_domain: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic Validation for "zbc-shop" issue
    if (!formData.shop_domain.includes('.')) {
        setError("Please enter a valid URL (e.g. store.myshopify.com)");
        return;
    }

    try {
      const res = await axios.post('https://xeno-backend-3ddp.onrender.com/api/auth/signup', formData);
      if (res.data.success) {
        alert('Account Created! Logging you in...');
        onSignupSuccess(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Signup Failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Start your Xeno journey</p>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input name="username" placeholder="johndoe" onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Shopify Domain</label>
            <input name="shop_domain" placeholder="shop.myshopify.com" onChange={handleChange} required />
            <small>This connects your specific store data.</small>
          </div>

          <button type="submit" className="auth-btn">Sign Up</button>
        </form>
        
        <p className="auth-switch">
            Already have an account? <span onClick={switchToLogin}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;