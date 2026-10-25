const express = require('express');
const path = require('path');
const supabase = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Super-Alpha Authentication
app.post('/api/super-alpha/login', async (req, res) => {
    const { email, pinCode } = req.body;
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', pinCode)
        .eq('role', 'Super-Alpha-Admin')
        .single();

    if (error || !data) {
        return res.status(401).json({ success: false, message: 'Invalid Master Credentials.' });
    }
    res.json({ success: true, token: 'ALPHA_SECURE_TOKEN', adminName: data.name });
});

// 2. Companies CRUD with Unified Limits & Profile Fields
app.get('/api/super-alpha/companies', async (req, res) => {
    const { data, error } = await supabase.from('companies').select('*').order('id', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: 'Error fetching companies' });
    res.json({ success: true, companies: data });
});

app.post('/api/super-alpha/companies', async (req, res) => {
    const { company_name, industry, max_users, logo_url, contact_person, contact_phone, contact_email, company_size } = req.body;
    
    if (!company_name) {
        return res.status(400).json({ success: false, message: 'Company name is required.' });
    }

    const { data, error } = await supabase
        .from('companies')
        .insert([{ 
            company_name, 
            industry: industry || 'General', 
            max_users: max_users || 100, 
            logo_url: logo_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + encodeURIComponent(company_name),
            contact_person: contact_person || 'N/A',
            contact_phone: contact_phone || 'N/A',
            contact_email: contact_email || 'N/A',
            company_size: company_size || '1-50 Employees (Limit: 100)',
            status: 'Active' 
        }])
        .select()
        .single();

    if (error) return res.status(500).json({ success: false, message: 'Failed to create company in database.' });
    res.json({ success: true, message: 'Company provisioned successfully!', company: data });
});

app.put('/api/super-alpha/companies/:id', async (req, res) => {
    const { id } = req.params;
    const { company_name, industry, max_users, logo_url, contact_person, contact_phone, contact_email, company_size, status } = req.body;
    
    const { error } = await supabase
        .from('companies')
        .update({ company_name, industry, max_users, logo_url, contact_person, contact_phone, contact_email, company_size, status })
        .eq('id', id);

    if (error) return res.status(500).json({ success: false, message: 'Failed to update company profile.' });
    res.json({ success: true, message: 'Company profile updated successfully!' });
});

app.delete('/api/super-alpha/companies/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('companies').delete().eq('id', id);
    if (error) return res.status(500).json({ success: false, message: 'Failed to delete company.' });
    res.json({ success: true, message: 'Company deleted successfully.' });
});

// 3. Users CRUD
app.get('/api/super-alpha/users', async (req, res) => {
    const { data, error } = await supabase.from('users').select('id, company_id, name, email, password_hash, role, department, created_at').order('id', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: 'Error fetching users' });
    res.json({ success: true, users: data });
});

app.post('/api/super-alpha/users', async (req, res) => {
    const { company_id, name, email, password_hash, role, department } = req.body;
    if (role === 'Super-Alpha-Admin') {
        return res.status(403).json({ success: false, message: 'Super-Alpha-Admin can only be seeded via database.' });
    }

    const { data, error } = await supabase
        .from('users')
        .insert([{ company_id: company_id ? parseInt(company_id) : null, name, email, password_hash, role, department: department || 'General' }])
        .select()
        .single();

    if (error) return res.status(500).json({ success: false, message: 'Failed to create user.' });
    res.json({ success: true, message: 'User created successfully!', user: data });
});

app.put('/api/super-alpha/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password_hash, role, department, company_id } = req.body;

    if (role === 'Super-Alpha-Admin') {
        return res.status(403).json({ success: false, message: 'Cannot assign Super-Alpha-Admin role.' });
    }

    const updateData = { name, email, role, department, company_id: company_id ? parseInt(company_id) : null };
    if (password_hash && password_hash.trim() !== '') {
        updateData.password_hash = password_hash;
    }

    const { error } = await supabase.from('users').update(updateData).eq('id', id);
    if (error) return res.status(500).json({ success: false, message: 'Failed to update user.' });
    res.json({ success: true, message: 'User updated successfully!' });
});

app.delete('/api/super-alpha/users/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) return res.status(500).json({ success: false, message: 'Failed to delete user.' });
    res.json({ success: true, message: 'User deleted successfully.' });
});

// 4. Messaging System
app.get('/api/super-alpha/messages', async (req, res) => {
    const { data, error } = await supabase.from('system_messages').select('*').order('id', { ascending: false });
    if (error) return res.json({ success: true, messages: [] });
    res.json({ success: true, messages: data });
});

app.post('/api/super-alpha/messages', async (req, res) => {
    const { target_type, target_id, message_text, sender } = req.body;
    const { data, error } = await supabase
        .from('system_messages')
        .insert([{ target_type, target_id, message_text, sender: sender || 'Super-Alpha' }])
        .select()
        .single();

    if (error) return res.status(500).json({ success: false, message: 'Failed to post message.' });
    res.json({ success: true, message: 'Message broadcasted successfully!' });
});

// Routes
app.get('/super-alpha-admin-panel/login/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'super-alpha-login.html'));
});

app.get('/secure/login/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'secure-login.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'secure-login.html'));
});

app.listen(PORT, () => console.log(`OnTeam Server running on port ${PORT}`));
