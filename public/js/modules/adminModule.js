// public/js/modules/adminModule.js

function renderAdminDashboard(user) {
    // 1. Update Header Branding: ♾️ + Company Logo
    const headerLogoArea = document.getElementById('role-header-badge');
    if (headerLogoArea) {
        headerLogoArea.outerHTML = `
            <div id="company-brand-container" class="flex items-center space-x-2 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800">
                <span class="text-lg text-[#a16836] font-bold">♾️</span>
                <img src="${user.company_logo || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + user.company_name}" class="w-7 h-7 rounded-lg object-cover border border-slate-700" alt="Logo">
                <span class="text-xs font-bold text-slate-800 dark:text-slate-200">${user.company_name || 'Enterprise Head'}</span>
            </div>
        `;
    }

    // 2. Define Sidebar Navigation Tabs (Exact Sequence)
    const nav = document.getElementById('sidebar-nav');
    const content = document.getElementById('main-content-area');
    nav.innerHTML = '';
    content.innerHTML = '';

    const adminTabs = [
        {
            id: 'home',
            label: '🏠 Home',
            html: `
                <div class="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h2 class="text-xl font-bold">Welcome, ${user.name} (Company Head)</h2>
                    <p class="text-xs text-slate-500">Managing Company ID: ${user.company_id} | Supreme Operational Control</p>
                    <div id="dashboard-inbox-ticker" class="space-y-2 pt-2">
                        <h4 class="text-xs font-bold text-[#a16836] uppercase tracking-wider">📢 Company Announcements & Directives</h4>
                        <div id="ticker-messages" class="space-y-2 max-h-40 overflow-y-auto text-xs"></div>
                    </div>
                </div>`
        },
        {
            id: 'departments',
            label: '🏢 Departments',
            html: `
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <h3 class="text-sm font-bold text-[#a16836] uppercase">Company Department Units</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800"><strong class="text-[#a16836]">Sales</strong><p class="text-slate-500 mt-1">Manage client pipelines and commercial targets.</p></div>
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800"><strong class="text-[#a16836]">Marketing</strong><p class="text-slate-500 mt-1">Brand campaigns and outreach analytics.</p></div>
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800"><strong class="text-[#a16836]">Admin Office</strong><p class="text-slate-500 mt-1">Corporate governance and internal compliance.</p></div>
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800"><strong class="text-[#a16836]">Accounts</strong><p class="text-slate-500 mt-1">Ledgers, invoicing, and financial audits.</p></div>
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800"><strong class="text-[#a16836]">Production</strong><p class="text-slate-500 mt-1">Manufacturing output and shift telemetry.</p></div>
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800"><strong class="text-[#a16836]">Store</strong><p class="text-slate-500 mt-1">Inventory tracking and supply chain reserves.</p></div>
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 col-span-2"><strong class="text-[#a16836]">Dispatch & Installation</strong><p class="text-slate-500 mt-1">Logistics, delivery status, and field setup coordination.</p></div>
                    </div>
                </div>`
        },
        {
            id: 'imp-schedules',
            label: '📅 IMP schedules',
            html: `
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <h3 class="text-sm font-bold text-[#a16836] uppercase">Important Corporate Schedules</h3>
                    <p class="text-xs text-slate-500">Monitor milestone deadlines, shift changeovers, and audit timelines.</p>
                </div>`
        },
        {
            id: 'meetings-calendar',
            label: '🗓️ Meetings calendar',
            html: `
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <h3 class="text-sm font-bold text-[#a16836] uppercase">Executive Meetings Calendar</h3>
                    <p class="text-xs text-slate-500">Scheduled board meetings, department head syncs, and review sessions.</p>
                </div>`
        },
        {
            id: 'leave-message',
            label: '💬 Leave a Message',
            html: `
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <h3 class="text-sm font-bold text-[#a16836] uppercase">Company Directives & Broadcasts</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <select id="admin-msg-target" class="bg-white dark:bg-slate-900 border rounded-lg p-2.5 text-xs">
                            <option value="Department-Head">All Department Heads</option>
                            <option value="Shift-Head">All Shift Heads</option>
                            <option value="Worker">All Workers</option>
                        </select>
                        <input id="admin-msg-text" type="text" placeholder="Type announcement or directive..." class="bg-white dark:bg-slate-900 border rounded-lg p-2.5 text-xs">
                    </div>
                    <button onclick="postAdminMessage()" class="w-full py-2.5 bg-[#a16836] text-white font-semibold rounded-xl text-xs">Broadcast Directive</button>
                    <div id="admin-messages-list" class="space-y-2 text-xs max-h-60 overflow-y-auto pt-2"></div>
                </div>`
        }
    ];

    adminTabs.forEach((tab, index) => {
        nav.innerHTML += `<button onclick="switchTab('${tab.id}')" id="nav-${tab.id}" class="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">${tab.label}</button>`;
        content.innerHTML += `<div id="tab-${tab.id}" class="${index === 0 ? '' : 'hidden'} space-y-6">${tab.html}</div>`;
    });
}
