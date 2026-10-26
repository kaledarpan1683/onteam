// public/js/modules/adminModule.js

function renderAdminDashboard(user, containerNav, containerContent) {
    // 1. Update Header Branding: ♾️ + Company Logo
    const headerLogoArea = document.getElementById('role-header-badge');
    if (headerLogoArea) {
        headerLogoArea.outerHTML = `
            <div id="company-brand-container" class="flex items-center space-x-2 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800">
                <span class="text-lg text-[#a16836] font-bold">♾️</span>
                <img src="${user.company_logo || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + user.company_name}" class="w-7 h-7 rounded-lg object-cover border border-slate-700" alt="Company Logo">
                <span class="text-xs font-bold text-slate-800 dark:text-slate-200">${user.company_name || 'Company Head'}</span>
            </div>
        `;
    }

    // 2. Define Admin Sidebar Tabs in exact requested sequence
    const adminTabs = [
        {
            id: 'home',
            label: 'Home',
            html: `
                <div class="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white">Welcome, ${user.name} (Company Head)</h2>
                    <p class="text-xs text-slate-500">Managing Company ID: ${user.company_id} | Highest Corporate Authority</p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div class="text-xs text-slate-400">Active Departments</div>
                            <div class="text-2xl font-bold text-[#a16836] mt-1">7 Units</div>
                        </div>
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div class="text-xs text-slate-400">Department Heads</div>
                            <div class="text-2xl font-bold text-indigo-600 mt-1">Active</div>
                        </div>
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div class="text-xs text-slate-400">Company Status</div>
                            <div class="text-2xl font-bold text-emerald-600 mt-1">Operational</div>
                        </div>
                    </div>
                </div>`
        },
        {
            id: 'departments',
            label: 'Departments',
            html: `
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div class="flex justify-between items-center">
                        <h3 class="text-sm font-bold text-[#a16836] uppercase tracking-wider">Company Department Units</h3>
                        <button onclick="alert('Add Department Head modal coming up!')" class="px-3 py-1.5 bg-[#a16836] text-white rounded-lg text-xs font-semibold">+ Assign Department Head</button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800"><strong class="text-[#a16836] text-sm">Sales</strong><p class="text-slate-500 mt-1">Client pipelines, commercial accounts, and revenue tracking.</p></div>
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800"><strong class="text-[#a16836] text-sm">Marketing</strong><p class="text-slate-500 mt-1">Brand campaigns, digital reach, and market analytics.</p></div>
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800"><strong class="text-[#a16836] text-sm">Admin Office</strong><p class="text-slate-500 mt-1">Corporate governance, HR compliance, and internal records.</p></div>
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800"><strong class="text-[#a16836] text-sm">Accounts</strong><p class="text-slate-500 mt-1">General ledgers, payroll auditing, invoicing, and tax filings.</p></div>
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800"><strong class="text-[#a16836] text-sm">Production</strong><p class="text-slate-500 mt-1">Floor manufacturing output, machinery telemetry, and shift logs.</p></div>
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800"><strong class="text-[#a16836] text-sm">Store</strong><p class="text-slate-500 mt-1">Raw material inventory, stock reserves, and supply chain audit.</p></div>
                        <div class="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 col-span-2"><strong class="text-[#a16836] text-sm">Dispatch & installation</strong><p class="text-slate-500 mt-1">Logistics, shipping manifests, delivery tracking, and field installation coordination.</p></div>
                    </div>
                </div>`
        },
        {
            id: 'imp-schedules',
            label: 'IMP schedules',
            html: `
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <h3 class="text-sm font-bold text-[#a16836] uppercase tracking-wider">Important Corporate Schedules</h3>
                    <p class="text-xs text-slate-500">Monitor milestone deadlines, shift changeovers, and quarterly audit timelines across all departments.</p>
                </div>`
        },
        {
            id: 'meetings-calendar',
            label: 'Meetings calendar',
            html: `
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <h3 class="text-sm font-bold text-[#a16836] uppercase tracking-wider">Executive Meetings Calendar</h3>
                    <p class="text-xs text-slate-500">Scheduled board meetings, department head syncs, and operational review sessions.</p>
                </div>`
        },
        {
            id: 'leave-message',
            label: 'Leave a Message',
            html: `
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <h3 class="text-sm font-bold text-[#a16836] uppercase tracking-wider">Company Directives & Announcements</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <select id="admin-msg-target" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white">
                            <option value="Department-Head">All Department Heads</option>
                            <option value="Shift-Head">All Shift Heads</option>
                            <option value="Worker">All Workers</option>
                        </select>
                        <input id="admin-msg-text" type="text" placeholder="Type announcement or directive..." class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white">
                    </div>
                    <button onclick="postAdminMessage()" class="w-full py-2.5 bg-[#a16836] hover:bg-[#84532b] text-white font-semibold rounded-xl text-xs transition">Broadcast Directive</button>
                    <div id="admin-messages-list" class="space-y-2 text-xs max-h-60 overflow-y-auto pt-2"></div>
                </div>`
        }
    ];

    // Render Sidebar Navigation & Content Tabs
    containerNav.innerHTML = '';
    containerContent.innerHTML = '';

    adminTabs.forEach((tab, index) => {
        containerNav.innerHTML += `
            <button onclick="switchAdminTab('${tab.id}')" id="nav-${tab.id}" class="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                ${tab.label}
            </button>`;
        containerContent.innerHTML += `
            <div id="tab-${tab.id}" class="${index === 0 ? '' : 'hidden'} space-y-6">
                ${tab.html}
            </div>`;
    });
}

function switchAdminTab(tabId) {
    document.querySelectorAll('[id^="tab-"]').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('[id^="nav-"]').forEach(el => {
        el.className = "w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition";
    });
    document.getElementById(`tab-${tabId}`).classList.remove('hidden');
    document.getElementById(`nav-${tabId}`).className = "w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#a16836]/10 text-[#a16836] transition";
}

async function postAdminMessage() {
    const target_type = 'ROLE';
    const target_id = document.getElementById('admin-msg-target').value;
    const message_text = document.getElementById('admin-msg-text').value;
    if (!message_text) return alert('Enter directive message.');

    const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_type, target_id, message_text, sender: currentUser.name })
    });
    const data = await res.json();
    if (data.success) {
        alert(data.message);
        document.getElementById('admin-msg-text').value = '';
    } else {
        alert(data.message);
    }
}
