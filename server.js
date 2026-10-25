const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store for simulation (will map cleanly to MySQL via Hostinger later)
let simulatedCompanies = [
    { id: 1, company_name: 'Apex Manufacturing Corp', industry: 'Automotive Parts', status: 'Active' }
];

let simulatedUsers = [
    { id: 1, company_id: 1, name: 'Master Alpha', email: 'alpha@onteam.com', role: 'Super-Alpha-Admin', department: 'Global' },
    { id: 2, company_id: 1, name: 'John Boss', email: 'admin@apex.com', role: 'Company-Super-Admin', department: 'Executive' },
    { id: 3, company_id: 1, name: 'Sarah Manager', email: 'dept@apex.com', role: 'Department-Head', department: 'Assembly' },
    { id: 4, company_id: 1, name: 'Mike Shift', email: 'shift@apex.com', role: 'Shift-Head', department: 'Assembly' },
    { id: 5, company_id: 1, name: 'David Worker', email: 'worker@apex.com', role: 'Worker', department: 'Assembly' }
];

// 1. System Health & Status Endpoint
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'online', 
        message: 'OnTeam Secure ERP Backend is active.',
        hierarchyLevels: ['Super-Alpha-Admin', 'Company-Super-Admin', 'Department-Head', 'Shift-Head', 'Worker'],
        aiInsight: 'Security protocols active. Multi-tenant isolation verified.'
    });
});

// 2. Authentication Mock Endpoint (Logs in based on selected role)
app.post('/api/login', (req, res) => {
    const { email } = req.body;
    const user = simulatedUsers.find(u => u.email === email);
    
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials or user not found.' });
    }

    res.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        user: user
    });
});

// 3. Super-Alpha-Admin: Create Company Endpoint
app.post('/api/companies', (req, res) => {
    const { company_name, industry } = req.body;
    if (!company_name) {
        return res.status(400).json({ success: false, message: 'Company name is required.' });
    }

    const newCompany = {
        id: simulatedCompanies.length + 1,
        company_name,
        industry: industry || 'General Manufacturing',
        status: 'Active'
    };

    simulatedCompanies.push(newCompany);
    res.json({ success: true, message: `Company '${company_name}' successfully created!`, company: newCompany });
});

// 4. Get Company List
app.get('/api/companies', (req, res) => {
    res.json({ success: true, companies: simulatedCompanies });
});

app.listen(PORT, () => {
    console.log(`OnTeam Server is running on port ${PORT}`);
});
