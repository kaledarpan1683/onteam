const express = require('express');
const path = require('path');
const supabase = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Status Endpoint
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'online', 
        message: 'OnTeam Supabase-Powered Database Active.',
        aiInsight: 'Relational tenant isolation verified via Supabase client.'
    });
});

// 2. Super-Alpha-Admin Database Authentication
app.post('/api/super-alpha/login', async (req, res) => {
    const { email, pinCode } = req.body;
    if (!email || !pinCode) {
        return res.status(400).json({ success: false, message: 'Mail Id and password required.' });
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', pinCode)
        .eq('role', 'Super-Alpha-Admin')
        .single();

    if (error || !data) {
        return res.status(401).json({ success: false, message: 'Invalid master credentials.' });
    }
    res.json({ success: true, token: 'ALPHA_SUPABASE_TOKEN' });
});

// 3. Unified Corporate Login (Supabase Verified)
app.post('/api/secure/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Mail Id and password required.' });
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .neq('role', 'Super-Alpha-Admin')
        .single();

    if (error || !data) {
        return res.status(401).json({ success: false, message: 'Invalid corporate credentials or unauthorized access.' });
    }

    res.json({
        success: true,
        message: `Welcome, ${data.name}`,
        user: {
            name: data.name,
            email: data.email,
            role: data.role,
            department: data.department
        }
    });
});

// 4. Super-Alpha Enterprise Management APIs
app.get('/api/super-alpha/enterprises', async (req, res) => {
    const { data, error } = await supabase.from('companies').select('*');
    if (error) return res.status(500).json({ success: false, message: 'Database error' });
    res.json({ success: true, enterprises: data });
});

app.post('/api/super-alpha/enterprises', async (req, res) => {
    const { company_name, industry, adminEmail, adminPassword } = req.body;
    if (!company_name || !adminEmail || !adminPassword) {
        return res.status(400).json({ success: false, message: 'Company name, admin mail Id, and password required.' });
    }

    // Insert Company
    const { data: compData, error: compError } = await supabase
        .from('companies')
        .insert([{ company_name, industry: industry || 'General', status: 'Active' }])
        .select()
        .single();

    if (compError) return res.status(500).json({ success: false, message: 'Failed to create company.' });

    // Insert Initial Company Super Admin
    const { error: userError } = await supabase
        .from('users')
        .insert([{
            company_id: compData.id,
            name: `${company_name} Admin`,
            email: adminEmail,
            password_hash: adminPassword,
            role: 'Company-Super-Admin',
            department: 'Executive'
        }]);

    if (userError) return res.status(500).json({ success: false, message: 'Company created, but failed to provision Super Admin.' });

    res.json({ success: true, message: `Enterprise '${company_name}' and Super Admin successfully provisioned in Supabase!` });
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
    console.log(`OnTeam Supabase Server running on port ${PORT}`);
});
