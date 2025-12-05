const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Product = sequelize.define('Product', {
    shopify_id: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    shop_domain: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Product;