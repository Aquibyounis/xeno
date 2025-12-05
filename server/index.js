require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const axios = require('axios');

// Import Routes
const ingestRoutes = require('./routes/ingest');
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');

// Import Models (Order matters! User must be loaded)
require('./models/User');
require('./models/Customer');
require('./models/Order');
require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', ingestRoutes);
app.use('/api', analyticsRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('✅ Xeno Backend is Running!');
});

// SCHEDULER
const SYNC_INTERVAL = 60 * 60 * 1000; 
setInterval(async () => {
    console.log('⏰ Scheduler: Starting automatic data sync...');
    try {
        const shop = process.env.SHOPIFY_STORE_URL;
        const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
        if(shop && accessToken) {
             const port = process.env.PORT || 5000;
             await axios.post(`http://localhost:${port}/api/ingest`, { shop, accessToken });
        }
    } catch (error) {
        console.error('❌ Scheduler Error:', error.message);
    }
}, SYNC_INTERVAL);

// --- UPDATED SYNC: alter: true ---
// This ensures the new 'customer_email' column is added to your existing table
sequelize.sync({ alter: true }) 
    .then(() => {
        console.log('✅ Database & Tables Updated Successfully!');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Database Sync Failed:', err);
    });