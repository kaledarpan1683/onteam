const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection using Hostinger/Environment variables
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'onteam_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 1. System Status Endpoint
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'online', 
        message: 'OnTeam Database-Driven Security Active.',
        aiInsight: 'All credentials isolated and verified via relational database queries.'
    });
});

// 2. Super-Alpha-Admin Database Authentication
app.post('/api/super-alpha/login', (req, res) => {
    const { email, pinCode } = req.body;
    if (!email || !pinCode) {
        return res.status(400).json({ success: false, message: 'Email and PIN required.' });
    }

    const query = `SELECT * FROM users WHERE email = ? AND password_hash = ? AND role = 'Super-Alpha-Admin'`;
    db.query(query, [email, pinCode], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid master credentials.' });
        }
        res.json({ success: true, token: 'ALPHA_DB_SECURE_TOKEN' });
    });
});

// 3. Unified Corporate Login (Database Verified for all 4 lower tiers)
app.post('/api/secure/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required.' });
    }

    const query = `SELECT * FROM users WHERE email = ? AND password_hash = ? AND role != 'Super-Alpha-Admin'`;
    db.query(query, [email, password], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid corporate credentials or unauthorized access.' });
        }

        const user = results[0];
        res.json({
            success: true,
            message: `Welcome, ${user.name}`,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    });
});

// 4. Super-Alpha Enterprise & Admin Provisioning (Stored in DB)
app.get('/api/super-alpha/enterprises', (req, res) => {
    db.query(`SELECT * FROM companies`, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, enterprises: results });
    });
});

app.post('/api/super-alpha/enterprises', (req, res) => {
    const { company_name, industry, adminEmail, adminPassword } = req.body;
    if (!company_name || !adminEmail || !adminPassword) {
        return res.status(400).json({ success: false, message: 'Company name, Admin email, and Password are required.' });
    }

    // Insert Company
    db.query(`INSERT INTO companies (company_name, industry) VALUES (?, ?)`, [company_name, industry || 'General'], (err, compResult) => {
        if (err) return res.status(500).json({ success: false, message: 'Failed to create company.' });
        
        const companyId = compResult.insertId;

        // Automatically create the initial Company-Super-Admin in DB
        db.query(
            `INSERT INTO users (company_id, name, email, password_hash, role, department) VALUES (?, ?, ?, ?, 'Company-Super-Admin', 'Executive')`,
            [companyId, `${company_name} Admin`, adminEmail, adminPassword],
            (userErr) => {
                if (userErr) return res.status(500).json({ success: false, message: 'Company created, but failed to provision Super Admin account.' });
                res.json({ success: true, message: `Enterprise '${company_name}' and Super Admin successfully provisioned in DB!` });
            }
        );
    });
});

// --- Route Mappings ---
app.get('/secure/login/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'secure-login.html'));
});

app.get('/super-alpha-admin-panel/login/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'super-alpha-login.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'secure-login.html'));
});

app.listen(PORT, () => {
    console.log(`OnTeam Database-Driven Server running on port ${PORT}`);
});
