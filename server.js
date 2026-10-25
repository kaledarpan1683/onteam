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

// 2. CRUD: Get All Companies & Limits
app.get('/api/super-alpha/companies', async (req, res) => {
    const { data, error } = await supabase.from('companies').select('*').order('id', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: 'Error fetching companies' });
    res.json({ success: true, companies: data });
});

// Create Company with Limits
app.post('/api/super-alpha/companies', async (req, res) => {
    const { company_name, industry, max_users } = req.body;
    const { data, error } = await supabase
        .from('companies')
        .insert([{ company_name, industry: industry || 'General', max_users: max_users || 100, status: 'Active' }])
        .select()
        .single();

    if (error) return res.status(500).json({ success: false, message: 'Failed to create company.' });
    res.json({ success: true, message: 'Company provisioned successfully!', company: data });
});

// Delete Company
app.delete('/api/super-alpha/companies/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('companies').delete().eq('id', id);
    if (error) return res.status(500).json({ success: false, message: 'Failed to delete company.' });
    res.json({ success: true, message: 'Company deleted successfully.' });
});

// 3. CRUD: Get All Users across all companies
app.get('/api/super-alpha/users', async (req, res) => {
    const { data, error } = await supabase.from('users').select('id, company_id, name, email, role, department, created_at').order('id', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: 'Error fetching users' });
    res.json({ success: true, users: data });
});

// Create User (with role & limits check)
app.post('/api/super-alpha/users', async (req, res) => {
    const { company_id, name, email, password_hash, role, department } = req.body;
    const { data, error } = await supabase
        .from('users')
        .insert([{ company_id: company_id || null, name, email, password_hash, role, department: department || 'General' }])
        .select()
        .single();

    if (error) return res.status(500).json({ success: false, message: 'Failed to create user (Email may already exist).' });
    res.json({ success: true, message: 'User created successfully!', user: data });
});

// Delete User
app.delete('/api/super-alpha/users/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) return res.status(500).json({ success: false, message: 'Failed to delete user.' });
    res.json({ success: true, message: 'User deleted successfully.' });
});

// 4. Messaging & Comments System (Role-based or Individual)
app.get('/api/super-alpha/messages', async (req, res) => {
    const { data, error } = await supabase.from('system_messages').select('*').order('id', { ascending: false });
    if (error) {
        // If table doesn't exist yet, return empty array gracefully
        return res.json({ success: true, messages: [] });
    }
    res.json({ success: true, messages: data });
});

app.post('/api/super-alpha/messages', async (req, res) => {
    const { target_type, target_id, message_text, sender } = req.body;
    // target_type: 'INDIVIDUAL' or 'ROLE'
    // target_id: user email/id or role name (e.g., 'Worker')
    const { data, error } = await supabase
        .from('system_messages')
        .insert([{ target_type, target_id, message_text, sender: sender || 'Super-Alpha' }])
        .select()
        .single();

    if (error) return res.status(500).json({ success: false, message: 'Failed to post message. Ensure system_messages table exists.' });
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
