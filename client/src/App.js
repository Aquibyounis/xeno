import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup'; // Import Signup
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [shopDomain, setShopDomain] = useState(null);
  const [view, setView] = useState('login'); // 'login' or 'signup'

  // Persistence logic
  useEffect(() => {
    const savedUser = localStorage.getItem('xeno_username');
    const savedShop = localStorage.getItem('xeno_shop');
    if (savedUser && savedShop) {
      setUser(savedUser);
      setShopDomain(savedShop);
    }
  }, []);

  // Handle successful auth (from Login OR Signup)
  const handleAuthSuccess = (userData) => {
    localStorage.setItem('xeno_username', userData.username);
    localStorage.setItem('xeno_shop', userData.shop_domain);
    setUser(userData.username);
    setShopDomain(userData.shop_domain);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setShopDomain(null);
    setView('login');
  };

  // Rendering Logic
  if (user && shopDomain) {
    return <Dashboard user={user} shopDomain={shopDomain} onLogout={handleLogout} />;
  }

  return (
    <div className="App">
      {view === 'login' ? (
        <Login 
            onLogin={handleAuthSuccess} 
            switchToSignup={() => setView('signup')} 
        />
      ) : (
        <Signup 
            onSignupSuccess={handleAuthSuccess} 
            switchToLogin={() => setView('login')} 
        />
      )}
    </div>
  );
}

export default App;