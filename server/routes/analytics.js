const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('../database');
const Customer = require('../models/Customer');
const Order = require('../models/Order');

router.get('/dashboard-stats', async (req, res) => {
    try {
        const { shop, startDate, endDate } = req.query;

        if (!shop) return res.status(400).json({ success: false, error: 'Shop Domain required' });

        const tenantFilter = { where: { shop_domain: shop } };
        const orderFilter = { where: { shop_domain: shop } };
        
        if (startDate && endDate) {
            orderFilter.where.created_at_date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }

        // 1. Calculate Totals
        const totalCustomers = await Customer.count(tenantFilter);
        const totalOrders = await Order.count(orderFilter);
        const totalRevenueResult = await Order.sum('total_price', orderFilter);
        const totalRevenue = totalRevenueResult || 0;
        const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

        // 2. Fetch Full Lists
        const customersList = await Customer.findAll({
            where: { shop_domain: shop },
            order: [['total_spent', 'DESC']],
        });

        const ordersList = await Order.findAll({
            where: orderFilter.where,
            order: [['created_at_date', 'DESC']],
            // --- FETCH EMAIL ---
            attributes: ['shopify_id', 'total_price', 'created_at_date', 'customer_email']
        });

        // 3. Top 5 Customers
        const topCustomers = await Customer.findAll({
            where: { shop_domain: shop },
            limit: 5,
            order: [['total_spent', 'DESC']],
            attributes: ['first_name', 'email', 'total_spent']
        });

        // 4. Recent Orders
        const recentOrders = await Order.findAll({
            where: orderFilter.where,
            limit: 5,
            order: [['created_at_date', 'DESC']],
            // --- FETCH EMAIL ---
            attributes: ['shopify_id', 'total_price', 'created_at_date', 'customer_email']
        });

        // 5. Chart Data
        const salesByDate = {};
        ordersList.forEach(order => {
            const dateStr = new Date(order.created_at_date).toISOString().split('T')[0];
            salesByDate[dateStr] = (salesByDate[dateStr] || 0) + parseFloat(order.total_price);
        });
        
        const chartData = Object.keys(salesByDate).sort().map(date => ({
            date,
            amount: salesByDate[date]
        }));

        res.json({ 
            success: true, 
            totalCustomers, 
            totalOrders, 
            totalRevenue, 
            averageOrderValue, 
            customersList, 
            ordersList,    
            topCustomers,
            recentOrders,
            chartData 
        });

    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;