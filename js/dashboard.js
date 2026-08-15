function loadDashboard() {
    // Users count
    db.ref('users').on('value', snap => {
        const count = snap.numChildren();
        document.getElementById('stat-users').innerText = count;
    });

    // Products count
    db.ref('products').on('value', snap => {
        const count = snap.numChildren();
        document.getElementById('stat-products').innerText = count;
    });

    // Orders (Pending + Revenue)
    db.ref('orders').on('value', snap => {
        const orders = snap.val() || {};
        let pending = 0, revenue = 0;
        let recentHtml = '';

        const orderArr = Object.keys(orders).map(k => ({id:k, ...orders[k]})).sort((a,b) => b.createdAt - a.createdAt);
        
        orderArr.slice(0, 5).forEach(o => {
            const date = new Date(o.createdAt).toLocaleDateString();
            let color = 'var(--silver)';
            if (o.status === 'pending') color = '#ffbf00';
            if (o.status === 'approved') color = 'var(--neon-green)';
            if (o.status === 'rejected') color = 'var(--vivid-red)';
            
            recentHtml += `<tr><td>${o.orderId}</td><td>${o.userEmail}</td><td>₹${o.amount}</td><td style="color:${color};font-weight:bold;">${o.status}</td><td>${date}</td></tr>`;
        });
        document.getElementById('recent-orders-body').innerHTML = recentHtml;

        orderArr.forEach(o => {
            if (o.status === 'pending') pending++;
            if (o.status === 'approved') revenue += o.amount;
        });

        document.getElementById('stat-pending').innerText = pending;
        document.getElementById('stat-revenue').innerText = '₹' + revenue;
    });
}