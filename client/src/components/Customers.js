import React from 'react';
import './Dashboard.css';

function Customers({ customers }) {
    return (
        <div className="glass-panel fade-in">
             <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h2>Customer Database</h2>
                <span className="badge-success" style={{background: '#e0f2fe', color: '#0369a1'}}>
                    {customers?.length || 0} Profiles
                </span>
            </div>

            <div className="table-responsive">
                <table className="modern-table full-width">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Total Spend</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers?.map((c, i) => (
                            <tr key={i}>
                                <td style={{fontWeight: '600'}}>{c.first_name || 'Guest'}</td>
                                <td style={{color: '#666'}}>{c.email}</td>
                                <td style={{color: '#008060', fontWeight: 'bold'}}>${c.total_spent}</td>
                                <td><span className="badge-success">Active</span></td>
                            </tr>
                        ))}
                         {(!customers?.length) && <tr><td colSpan="4" style={{textAlign: 'center', padding: '30px'}}>No customers found</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default Customers;