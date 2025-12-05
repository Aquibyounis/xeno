import React from 'react';
import './Dashboard.css';

function Transactions({ orders }) {
    return (
        <div className="glass-panel fade-in">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h2>Transaction History</h2>
                <span className="badge-success">{orders?.length || 0} Records</span>
            </div>
            
            <div className="table-responsive">
                <table className="modern-table full-width">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th style={{textAlign: 'right'}}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((o, i) => (
                            <tr key={i}>
                                <td style={{fontFamily: 'monospace', color: '#555'}}>#{o.shopify_id}</td>
                                <td>{new Date(o.created_at_date).toLocaleDateString()}</td>
                                <td><span className="badge-success">Paid</span></td>
                                <td style={{textAlign: 'right', fontWeight: '600'}}>${o.total_price}</td>
                            </tr>
                        ))}
                        {(!orders?.length) && <tr><td colSpan="4" style={{textAlign: 'center', padding: '30px'}}>No transactions found</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default Transactions;