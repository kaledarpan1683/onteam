const express = require('express');
const path = require('path');
const supabase = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Unified Authentication Endpoint across all 6 tiers
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Mail Id and password required.' });
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .single();

    if (error || !data) {
        return res.status(401).json({ success: false, message: 'Invalid credentials or unauthorized access.' });
    }

    res.json({
        success: true,
        message: `Welcome back, ${data.name}`,
        user: {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            department: data.department,
            company_id: data.company_id
        }
    });
});

// Companies CRUD
app.get('/api/companies', async (req, res) => {
    const { data, error } = await supabase.from('companies').select('*').order('id', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: 'Error fetching companies' });
    res.json({ success: true, companies: data });
});

app.post('/api/companies', async (req, res) => {
    const { company_name, industry, max_users, contact_person, contact_phone, admin_email, admin_password } = req.body;
    
    if (!company_name || !admin_email || !admin_password) {
        return res.status(400).json({ success: false, message: 'Company name, admin email, and password required.' });
    }

    const { data: compData, error: compError } = await supabase
        .from('companies')
        .insert([{ 
            company_name, 
            industry: industry || 'General', 
            max_users: max_users ? parseInt(max_users) : 100, 
            logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + encodeURIComponent(company_name),
            contact_person: contact_person || 'N/A',
            contact_phone: contact_phone || '+10000000000',
            contact_email: admin_email,
            company_size: `Max Limit: ${max_users || 100}`,
            status: 'Active' 
        }])
        .select()
        .single();

    if (compError) return res.status(500).json({ success: false, message: 'Failed to create company: ' + compError.message });

    const { error: userError } = await supabase
        .from('users')
        .insert([{
            company_id: compData.id,
            name: contact_person !== 'N/A' ? contact_person : `${company_name} Head`,
            email: admin_email,
            password_hash: admin_password,
            role: 'Admin',
            department: 'Executive'
        }]);

    if (userError) return res.status(500).json({ success: false, message: 'Company created, but failed to create admin user.' });

    res.json({ success: true, message: `Enterprise '${company_name}' provisioned successfully!`, company: compData });
});

app.put('/api/companies/:id', async (req, res) => {
    const { id } = req.params;
    const { company_name, industry, max_users, contact_person, contact_phone, contact_email, status } = req.body;
    
    const { error } = await supabase
        .from('companies')
        .update({ company_name, industry, max_users: max_users ? parseInt(max_users) : 100, contact_person, contact_phone, contact_email, status })
        .eq('id', id);

    if (error) return res.status(500).json({ success: false, message: 'Failed to update company.' });
    res.json({ success: true, message: 'Company profile updated successfully!' });
});

app.delete('/api/companies/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('companies').delete().eq('id', id);
    if (error) return res.status(500).json({ success: false, message: 'Failed to delete company.' });
    res.json({ success: true, message: 'Company deleted successfully.' });
});

// Users CRUD
app.get('/api/users', async (req, res) => {
    const { company_id } = req.query;
    let query = supabase.from('users').select('id, company_id, name, email, password_hash, role, department, created_at').order('id', { ascending: false });
    if (company_id) query = query.eq('company_id', company_id);

    const { data, error } = await query;
    if (error) return res.status(500).json({ success: false, message: 'Error fetching users' });
    res.json({ success: true, users: data });
});

app.post('/api/users', async (req, res) => {
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

app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password_hash, role, department, company_id } = req.body;

    if (role === 'Super-Alpha-Admin') {
        return res.status(403).json({ success: false, message: 'Cannot assign Super-Alpha-Admin role.' });
    }

    const updateData = { name, email, role, department, company_id: company_id ? parseInt(company_id) : null };
    if (password_hash && password_hash.trim() !== '') updateData.password_hash = password_hash;

    const { error } = await supabase.from('users').update(updateData).eq('id', id);
    if (error) return res.status(500).json({ success: false, message: 'Failed to update user.' });
    res.json({ success: true, message: 'User updated successfully!' });
});

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) return res.status(500).json({ success: false, message: 'Failed to delete user.' });
    res.json({ success: true, message: 'User deleted successfully.' });
});

// Messaging System
app.get('/api/messages', async (req, res) => {
    const { data, error } = await supabase.from('system_messages').select('*').order('id', { ascending: false });
    if (error) return res.json({ success: true, messages: [] });
    res.json({ success: true, messages: data });
});

app.post('/api/messages', async (req, res) => {
    const { target_type, target_id, message_text, sender } = req.body;
    const { data, error } = await supabase
        .from('system_messages')
        .insert([{ target_type, target_id, message_text, sender: sender || 'System' }])
        .select()
        .single();

    if (error) return res.status(500).json({ success: false, message: 'Failed to post message.' });
    res.json({ success: true, message: 'Directive broadcasted successfully!' });
});

// Single Unified Login Route
app.get('/secure-login/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'secure-login.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'secure-login.html'));
});

app.listen(PORT, () => console.log(`OnTeam Server running on port ${PORT}`));
