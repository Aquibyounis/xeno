import React from 'react';
import './Dashboard.css'; // Reusing dashboard styles

function Navbar({ currentView, setView, onLogout, user }) {
    return (
        <nav className="glass-panel" style={styles.nav}>
            <div style={styles.logoSection}>
                <div style={styles.logo}>X</div>
                <span style={styles.brand}>Xeno<span style={{fontWeight: '300'}}>Insights</span></span>
            </div>

            <div style={styles.links}>
                <button 
                    style={currentView === 'dashboard' ? styles.activeLink : styles.link}
                    onClick={() => setView('dashboard')}
                >
                    Overview
                </button>
                <button 
                    style={currentView === 'transactions' ? styles.activeLink : styles.link}
                    onClick={() => setView('transactions')}
                >
                    Transactions
                </button>
                <button 
                    style={currentView === 'customers' ? styles.activeLink : styles.link}
                    onClick={() => setView('customers')}
                >
                    Customers
                </button>
            </div>

            <div style={styles.userSection}>
                <span style={styles.username}>{user.split('@')[0]}</span>
                <button onClick={onLogout} className="logout-btn" style={{padding: '8px 16px', fontSize: '13px'}}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        marginBottom: '30px',
        borderRadius: '16px'
    },
    logoSection: { display: 'flex', alignItems: 'center', gap: '10px' },
    logo: {
        width: '32px', height: '32px', background: '#008060', color: 'white',
        borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', fontSize: '18px'
    },
    brand: { fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a' },
    links: { display: 'flex', gap: '10px', background: 'rgba(0,0,0)', padding: '5px', borderRadius: '12px'},
    link: {
        padding: '10px 20px', border: 'none', background: 'transparent',
        color: 'bisque', cursor: 'pointer', borderRadius: '8px', fontWeight: '500',
        transition: 'all 0.2s'
    },
    activeLink: {
        padding: '10px 20px', border: 'none', background: 'white',
        color: '#008060', cursor: 'pointer', borderRadius: '8px', fontWeight: '600',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    userSection: { display: 'flex', alignItems: 'center', gap: '15px' },
    username: { fontWeight: '600', color: '#333' }
};

export default Navbar;