import React from 'react';
import './Navbar.css';

function Navbar({ currentView, setView, onLogout, user }) {
    return (
        <nav className="navbar glass-panel">
            
            {/* Logo Section */}
            <div className="logo-section">
                <div className="logo">X</div>
                <span className="brand">
                    Xeno<span style={{ fontWeight: '300' }}>Insights</span>
                </span>
            </div>

            {/* Links */}
            <div className="links">
                <button
                    className={currentView === 'dashboard' ? "active-link" : "link"}
                    onClick={() => setView('dashboard')}
                >
                    Overview
                </button>

                <button
                    className={currentView === 'transactions' ? "active-link" : "link"}
                    onClick={() => setView('transactions')}
                >
                    Transactions
                </button>

                <button
                    className={currentView === 'customers' ? "active-link" : "link"}
                    onClick={() => setView('customers')}
                >
                    Customers
                </button>
            </div>

            {/* User Section */}
            <div className="user-section">
                <span className="username">{user.split('@')[0]}</span>
                <button onClick={onLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
