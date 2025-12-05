const express = require('express');
const axios = require('axios');
const router = express.Router();
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Order = require('../models/Order');

router.post('/ingest', async (req, res) => {
    try {
        const { shop, accessToken } = req.body || {};
        
        // Fallback to .env if not provided
        const SHOP_URL = shop || process.env.SHOPIFY_STORE_URL;
        const ACCESS_TOKEN = accessToken || process.env.SHOPIFY_ACCESS_TOKEN;

        if (!SHOP_URL || !ACCESS_TOKEN) {
            return res.status(400).json({ success: false, error: 'Missing Shop URL or Access Token' });
        }

        // Clean up URL and use a NEWER API Version (2024-04 is stable)
        const cleanShopUrl = SHOP_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const apiVersion = '2025-04'; 
        const baseURL = `https://${cleanShopUrl}/admin/api/${apiVersion}`;

        console.log(`🔄 Starting Ingestion for: ${cleanShopUrl} using API ${apiVersion}`);

        const config = {
            headers: {
                'X-Shopify-Access-Token': ACCESS_TOKEN,
                'Content-Type': 'application/json'
            }
        };

        // 1. Fetch & Save Customers
        const customerRes = await axios.get(`${baseURL}/customers.json`, config);
        const customers = customerRes.data.customers;
        
        for (const c of customers) {
            await Customer.upsert({
                shopify_id: c.id,
                first_name: c.first_name,
                email: c.email,
                total_spent: c.total_spent,
                shop_domain: cleanShopUrl
            });
        }
        console.log(`✅ Synced ${customers.length} Customers`);

        // 2. Fetch & Save Products
        const productRes = await axios.get(`${baseURL}/products.json`, config);
        const products = productRes.data.products;

        for (const p of products) {
            await Product.upsert({
                shopify_id: p.id,
                title: p.title,
                price: p.variants[0] ? p.variants[0].price : 0.00,
                shop_domain: cleanShopUrl
            });
        }
        console.log(`✅ Synced ${products.length} Products`);

        // 3. Fetch & Save Orders
        const orderRes = await axios.get(`${baseURL}/orders.json?status=any`, config);
        const orders = orderRes.data.orders;

        for (const o of orders) {
            await Order.upsert({
                shopify_id: o.id,
                total_price: o.total_price,
                created_at_date: o.created_at,
                shop_domain: cleanShopUrl
            });
        }
        console.log(`✅ Synced ${orders.length} Orders`);

        res.json({ 
            success: true, 
            message: `Ingestion Complete! Processed ${customers.length} customers, ${products.length} products, and ${orders.length} orders.` 
        });

    } catch (error) {
        console.error('❌ Ingestion Error:', error.message);
        // Better error logging to see exactly what URL failed
        if (error.response) {
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
        }
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;