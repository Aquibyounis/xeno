import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Navbar from './Navbar';
import Transactions from './Transactions';
import Customers from './Customers';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function Dashboard({ user, shopDomain, onLogout }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [view, setView] = useState('dashboard');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const baseUrl = 'http://localhost:5000/api/dashboard-stats';
      let url = `${baseUrl}?shop=${shopDomain}`;
      if (startDate && endDate) url += `&startDate=${startDate}&endDate=${endDate}`;
      
      const response = await axios.get(url);
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await axios.post('http://localhost:5000/api/ingest', { shop: shopDomain });
      alert('Synced!');
      fetchStats();
    } catch (error) {
      alert('Sync Failed');
    }
    setSyncing(false);
  };

  useEffect(() => { fetchStats(); }, [shopDomain, startDate, endDate]);

  if (loading && !stats) return <div className="dashboard-container">Loading...</div>;

  const chartData = {
    labels: stats?.chartData?.map((d) => d.date) || [],
    datasets: [{
      label: 'Revenue',
      data: stats?.chartData?.map((d) => d.amount) || [],
      borderColor: '#008060',
      backgroundColor: (ctx) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0,0,0,300);
        gradient.addColorStop(0, 'rgba(0,128,96,0.4)');
        gradient.addColorStop(1, 'rgba(0,128,96,0.0)');
        return gradient;
      },
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="dashboard-container">
      <Navbar currentView={view} setView={setView} onLogout={onLogout} user={user} />

      {view === 'dashboard' && (
          <>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                <div className="filter-bar" style={{margin:0}}>
                    <span className="filter-label">📅 Period:</span>
                    <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="date-input"/>
                    <span>to</span>
                    <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="date-input"/>
                </div>
                <button onClick={handleSync} disabled={syncing} className="sync-btn">
                    {syncing ? 'Syncing...' : '🔄 Sync Data'}
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p className="stat-number">${stats?.totalRevenue?.toLocaleString(undefined,{minimumFractionDigits:2})}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="stat-number">{stats?.totalOrders}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Customers</h3>
                    <p className="stat-number">{stats?.totalCustomers}</p>
                </div>
                <div className="stat-card">
                    <h3>Avg Order Value</h3>
                    <p className="stat-number">${stats?.averageOrderValue}</p>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card glass-panel" style={{height:'420px'}}>
                    <h3>Revenue Velocity</h3>
                    <div className="chart-container" style={{height:'340px'}}>
                        <Line options={{maintainAspectRatio:false, plugins:{legend:{display:false}}}} data={chartData} />
                    </div>
                </div>

                <div className="customers-card glass-panel">
                    <h3>🏆 Top Customers</h3>
                    <div className="table-responsive">
                        <table className="modern-table">
                            <tbody>
                                {stats?.customersList?.slice(0, 5).map((c, i) => (
                                    <tr key={i}>
                                        <td>
                                            {/* DISPLAYING FULL NAME HERE */}
                                            <div style={{fontWeight: '500'}}>
                                                {c.first_name} {c.last_name || ''}
                                            </div>
                                            <div style={{fontSize: '12px', color: '#888'}}>{c.email}</div>
                                        </td>
                                        <td style={{textAlign: 'right', color: '#008060', fontWeight: 'bold'}}>
                                            ${c.total_spent}
                                        </td>
                                    </tr>
                                ))}
                                {(!stats?.customersList?.length) && <tr><td style={{textAlign: 'center', color: '#999', padding:'20px'}}>No data found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
          </>
      )}

      {/* Pass Customers List AND Orders List to the Customers Component */}
      {view === 'transactions' && <Transactions orders={stats?.ordersList} />}
      {view === 'customers' && <Customers customers={stats?.customersList} orders={stats?.ordersList} />}

    </div>
  );
}

export default Dashboard;