const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Order = sequelize.define('Order', {
    shopify_id: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    created_at_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    shop_domain: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Order;