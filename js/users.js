// ==========================================
// ADMIN PANEL - USERS MANAGEMENT
// ==========================================

function loadUsers() {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    db.ref('users').on('value', snap => {
        const users = snap.val() || {};
        let html = '';
        
        // Convert to array and sort by joined date (newest first)
        const userArr = Object.keys(users).map(uid => ({uid, ...users[uid]}));
        userArr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        if (userArr.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:30px;color:var(--silver);">No users registered yet.</td></tr>';
            return;
        }

        userArr.forEach(u => {
            const date = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A';
            const roleColor = u.role === 'admin' ? 'var(--neon-green)' : 'var(--silver)';
            
            html += `
                <tr>
                    <td style="font-size:0.8rem;word-break:break-all;color:var(--silver);">${u.uid}</td>
                    <td>${u.email || 'No Email'}</td>
                    <td style="color:${roleColor};font-weight:bold;text-transform:uppercase;">${u.role || 'user'}</td>
                    <td>${date}</td>
                </tr>`;
        });
        
        tbody.innerHTML = html;
    }, error => {
        console.error("Error loading users:", error);
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:30px;color:var(--vivid-red);">Permission Denied. Check Firebase Rules.</td></tr>`;
    });
}