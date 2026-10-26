function renderModularDashboard(user) {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('dashboard-shell').classList.remove('hidden');
    document.getElementById('role-header-badge').classList.remove('hidden');
    document.getElementById('role-header-badge').innerText = user.role;

    document.getElementById('sidebar-username').innerText = user.name;
    document.getElementById('sidebar-role').innerText = `${user.role} • ${user.department}`;
    document.getElementById('user-avatar').innerText = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const nav = document.getElementById('sidebar-nav');
    const content = document.getElementById('main-content-area');

    if (user.role === 'Super-Alpha-Admin') {
        renderSuperAlphaDashboard(user, nav, content);
    } else if (user.role === 'Admin') {
        renderAdminDashboard(user, nav, content); // Loads our clean Company Head module!
    } else {
        // Lower tiers will plug in here cleanly without touching Admin/Super-Alpha code
        renderDefaultDashboard(user, nav, content);
    }
}
