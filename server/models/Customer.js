const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // We will fix this import in a second

const Customer = sequelize.define('Customer', {
    shopify_id: {
        type: DataTypes.BIGINT,
        unique: true, // Prevent duplicates
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    total_spent: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    // The Tenant Identifier
    shop_domain: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Customer;