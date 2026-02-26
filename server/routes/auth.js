const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        console.log(`Register API called for username: ${username}`);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
            [username, hashedPassword, email]
        );
        console.log(`User registered successfully with id: ${newUser.rows[0].id}`);
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Password or Email is incorrect" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).json({ message: "Password or Email is incorrect" });
        }

        const token = jwt.sign({ user_id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.rows[0].id, username: user.rows[0].username } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Mock OTP Storage (In production, use Redis or similar)
const otps = new Map();

// Send OTP
router.post('/send-otp', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store with 5 min expiry
        otps.set(username, {
            otp,
            expires: Date.now() + 5 * 60 * 1000
        });

        console.log(`[OTP] Generated OTP for ${username}: ${otp}`);

        // Save to file for easy access in dev
        try {
            fs.writeFileSync(path.join(__dirname, '../current_otp.txt'), `User: ${username}\nOTP: ${otp}\nGenerated At: ${new Date().toLocaleString()}`);
        } catch (fileErr) {
            console.error("Failed to write OTP to file:", fileErr);
        }

        // In dev, we can return it for ease of use, or just console log it
        res.json({ message: "OTP sent successfully", otp: process.env.NODE_ENV === 'development' ? otp : undefined });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { username, otp } = req.body;
        const stored = otps.get(username);

        if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
            return res.status(401).json({ message: "Invalid or expired OTP" });
        }

        // OTP valid, clear it
        otps.delete(username);

        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const token = jwt.sign({ user_id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.rows[0].id, username: user.rows[0].username } });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
