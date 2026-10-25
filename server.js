const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Enterprise and User database simulation
let enterprises = [
    { id: 1, company_name: 'Apex Manufacturing Corp', industry: 'Automotive Parts', status: 'Active' }
];

let superAlphaMaster = {
    email: 'alpha@onteam.com',
    pinCode: '7777'
};

// Company users across the 4 lower tiers
let companyUsers = [
    { id: 2, company_id: 1, name: 'John Boss', email: 'admin@apex.com', password: 'password123', role: 'Company-Super-Admin', department: 'Executive' },
    { id: 3, company_id: 1, name: 'Sarah Manager', email: 'dept@apex.com', password: 'password123', role: 'Department-Head', department: 'Assembly' },
    { id: 4, company_id: 1, name: 'Mike Shift', email: 'shift@apex.com', password: 'password123', role: 'Shift-Head', department: 'Assembly' },
    { id: 5, company_id: 1, name: 'David Worker', email: 'worker@apex.com', password: 'password123', role: 'Worker', department: 'Assembly' }
];

// 1. Status Endpoint
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'online', 
        message: 'OnTeam Enterprise Security Protocols Active.',
        aiInsight: 'Tenant isolation and gateway routing operational.'
    });
});

// 2. Super-Alpha Exclusive Login
app.post('/api/super-alpha/login', (req, res) => {
    const { email, pinCode } = req.body;
    if (email === superAlphaMaster.email && pinCode === superAlphaMaster.pinCode) {
        res.json({ success: true, token: 'ALPHA_MASTER_TOKEN' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid master credentials.' });
    }
});

// 3. Unified Company User Login (For Company Admin down to Worker)
app.post('/api/secure/login', (req, res) => {
    const { email, password } = req.body;
    const user = companyUsers.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid corporate credentials.' });
    }

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

// 4. Super-Alpha Enterprise Management APIs
app.get('/api/super-alpha/enterprises', (req, res) => {
    res.json({ success: true, enterprises });
});

app.post('/api/super-alpha/enterprises', (req, res) => {
    const { company_name, industry, adminEmail } = req.body;
    if (!company_name || !adminEmail) {
        return res.status(400).json({ success: false, message: 'Company name and Admin email required.' });
    }

    const newEnt = { id: enterprises.length + 1, company_name, industry: industry || 'General', status: 'Active' };
    enterprises.push(newEnt);

    // Automatically create the Company Super Admin account for this new tenant
    companyUsers.push({
        id: companyUsers.length + 1,
        company_id: newEnt.id,
        name: `${company_name} Admin`,
        email: adminEmail,
        password: 'password123', // Default initial password
        role: 'Company-Super-Admin',
        department: 'Executive'
    });

    res.json({ success: true, message: `Enterprise '${company_name}' provisioned successfully!`, enterprise: newEnt });
});

// --- Route Mappings ---

// Unified Secure Login Gateway for all company personnel
app.get('/secure/login/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'secure-login.html'));
});

// Hidden Super-Alpha Gateway
app.get('/super-alpha-admin-panel/login/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'super-alpha-login.html'));
});

// Base public redirect or landing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'secure-login.html'));
});

app.listen(PORT, () => {
    console.log(`OnTeam Server running on port ${PORT}`);
});
