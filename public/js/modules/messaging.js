// public/js/modules/messaging.js

async function loadMessages() {
    try {
        const res = await fetch('/api/messages');
        const data = await res.json();
        
        const list = document.getElementById('messages-list');
        const ticker = document.getElementById('ticker-messages');
        
        if (list) list.innerHTML = '';
        if (ticker) ticker.innerHTML = '';

        if (!data.messages || data.messages.length === 0) {
            if (list) list.innerHTML = '<div class="text-slate-400 italic text-xs">No messages found.</div>';
            if (ticker) ticker.innerHTML = '<div class="text-slate-400 italic text-xs">No active announcements.</div>';
            return;
        }

        data.messages.forEach(m => {
            const isSender = currentUser && m.sender === currentUser.name;
            const isPublicBroadcast = m.target_id === 'All';
            
            let isAuthorizedRecipient = false;
            if (currentUser && currentUser.role === 'Super-Alpha-Admin') {
                isAuthorizedRecipient = true;
            } else if (currentUser && (m.target_id === currentUser.role || m.target_id === currentUser.email)) {
                isAuthorizedRecipient = true;
            }

            // Strict privacy filter: skip if not public broadcast, not sent by me, and not targeted to me
            if (!isPublicBroadcast && !isSender && !isAuthorizedRecipient) {
                return; 
            }

            const localTime = m.created_at ? new Date(m.created_at).toLocaleString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }) : 'Just now';

            const card = `
                <div class="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-xs">
                    <div class="flex justify-between text-[10px] text-slate-400">
                        <span class="font-bold text-[#a16836]">From: ${m.sender} (${m.sender_role}) → Target: ${m.target_id}</span>
                        <span>🕒 ${localTime}</span>
                    </div>
                    <p class="text-xs text-slate-800 dark:text-slate-200">${m.message_text}</p>
                </div>`;

            if (list) list.innerHTML += card;
            if (ticker && (isPublicBroadcast || isAuthorizedRecipient)) {
                ticker.innerHTML += card;
            }
        });

        if (list && list.innerHTML === '') {
            list.innerHTML = '<div class="text-slate-400 italic text-xs">No private messages found.</div>';
        }
        if (ticker && ticker.innerHTML === '') {
            ticker.innerHTML = '<div class="text-slate-400 italic text-xs">No active announcements.</div>';
        }
    } catch (err) {
        console.error('Error loading messages:', err);
    }
}

async function postMessage() {
    const target_type = 'ROLE';
    const target_id = document.getElementById('msg-target-role').value;
    const message_text = document.getElementById('msg-text').value;

    if (!message_text) return alert('Enter message text.');

    try {
        const res = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                target_type, 
                target_id, 
                message_text, 
                sender: currentUser.name,
                sender_role: currentUser.role 
            })
        });
        const data = await res.json();
        if (data.success) {
            alert(data.message);
            document.getElementById('msg-text').value = '';
            loadMessages();
        } else { 
            alert(data.message); 
        }
    } catch (err) {
        alert('Failed to post message.');
    }
}
