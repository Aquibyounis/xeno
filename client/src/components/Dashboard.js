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

  // Helper to clear filters
  const clearFilters = () => {
      setStartDate('');
      setEndDate('');
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const baseUrl = 'https://xeno-backend-3ddp.onrender.com/api/dashboard-stats';
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
      await axios.post('https://xeno-backend-3ddp.onrender.com/api/ingest', { shop: shopDomain });
      alert('Synced!');
      fetchStats();
    } catch (error) {
      alert('Sync Failed');
    }
    setSyncing(false);
  };

  useEffect(() => { fetchStats(); }, [shopDomain, startDate, endDate]);

  if (loading && !stats) return <div className="dashboard-container">Loading...</div>;

  // --- CHART DATA PREPARATION ---
  // We need to group orders by date to get count AND amount
  const salesMap = {};
  // Initialize with 0 for all dates present in chartData (which comes from backend sorted)
  stats?.chartData?.forEach(d => {
      salesMap[d.date] = { amount: d.amount, count: 0 };
  });

  // Count orders per day from the full orders list
  stats?.ordersList?.forEach(order => {
      const dateStr = new Date(order.created_at_date).toISOString().split('T')[0];
      if (salesMap[dateStr]) {
          salesMap[dateStr].count += 1;
      }
  });

  const chartData = {
    labels: stats?.chartData?.map((d) => d.date) || [],
    datasets: [{
      label: 'Revenue',
      data: stats?.chartData?.map((d) => d.amount) || [],
      // Store order counts in a custom property so tooltip can access it
      orderCounts: stats?.chartData?.map((d) => salesMap[d.date]?.count || 0), 
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

  const chartOptions = {
      maintainAspectRatio: false,
      plugins: {
          legend: { display: false },
          tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              titleColor: '#000',
              bodyColor: '#666',
              borderColor: '#ddd',
              borderWidth: 1,
              padding: 10,
              displayColors: false,
              callbacks: {
                  // Custom Label to show Revenue AND Order Count
                  label: function(context) {
                      const revenue = context.raw;
                      // Access the custom orderCounts array we passed in dataset
                      const count = context.dataset.orderCounts[context.dataIndex]; 
                      return [
                          `Revenue: $${revenue.toLocaleString()}`,
                          `Orders: ${count}`
                      ];
                  }
              }
          }
      },
      interaction: {
          mode: 'index',
          intersect: false,
      },
  };

  return (
    <div className="dashboard-container">
      <Navbar currentView={view} setView={setView} onLogout={onLogout} user={user} />

      {view === 'dashboard' && (
          <>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                <div className="filter-bar" style={{margin:0, display:'flex', alignItems:'center', gap:'10px'}}>
                    <span className="filter-label"><i className="fa-regular fa-calendar"></i> Period:</span>
                    <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="date-input"/>
                    <span>to</span>
                    <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="date-input"/>
                    
                    {/* RESET BUTTON - Shows only if filters are active */}
                    {(startDate || endDate) && (
                        <button 
                            onClick={clearFilters} 
                            style={{
                                background: '#f1f1f1', 
                                border: '1px solid #ccc', 
                                padding: '5px 10px', 
                                borderRadius: '5px', 
                                cursor: 'pointer',
                                color: '#333',
                                fontSize: '13px'
                            }}
                        >
                            ✕ Clear
                        </button>
                    )}
                </div>
                <button onClick={handleSync} disabled={syncing} className="sync-btn">
                  <i className="fa-solid fa-rotate"></i>
                    {syncing ? ' Syncing...' : ' Sync Data'}
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
                        {/* Pass updated options */}
                        <Line options={chartOptions} data={chartData} />
                    </div>
                </div>

                <div className="customers-card glass-panel">
                    <h3><i className="fa-regular fa-user"></i> Top Customers</h3>
                    <div className="table-responsive">
                        <table className="modern-table">
                            <tbody>
                                {stats?.customersList?.slice(0, 5).map((c, i) => (
                                    <tr key={i}>
                                        <td>
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

      {view === 'transactions' && <Transactions orders={stats?.ordersList} />}
      {view === 'customers' && <Customers customers={stats?.customersList} orders={stats?.ordersList} />}

    </div>
  );
}

export default Dashboard;