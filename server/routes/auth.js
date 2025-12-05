const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// SIGNUP
router.post('/signup', async (req, res) => {
    try {
        const { username, password, shop_domain } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Username already taken' });
        }

        // 2. Hash the password (Security)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Clean shop domain
        const cleanShop = shop_domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

        // 4. Create User
        const newUser = await User.create({
            username,
            password: hashedPassword,
            shop_domain: cleanShop
        });

        res.json({ success: true, user: { username: newUser.username, shop_domain: newUser.shop_domain } });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Find User
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ success: false, error: 'User not found' });
        }

        // 2. Check Password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, error: 'Invalid password' });
        }

        res.json({ success: true, user: { username: user.username, shop_domain: user.shop_domain } });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;