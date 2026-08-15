let currentFilter = 'pending';

function filterOrders(status) {
    currentFilter = status;
    loadOrders();
}

function loadOrders() {
    db.ref('orders').on('value', snap => {
        const orders = snap.val() || {};
        let html = '';
        const orderArr = Object.keys(orders).map(k => ({id:k, ...orders[k]})).sort((a,b) => b.createdAt - a.createdAt);

        orderArr.forEach(o => {
            if (o.status === currentFilter) {
                let actions = '';
                if (o.status === 'pending') {
                    actions = `
                        <button class="btn-cyber" style="padding:5px 15px;font-size:0.8rem;border-color:var(--neon-green);color:var(--neon-green);" onclick="approveOrder('${o.id}')">Approve</button>
                        <button class="btn-cyber" style="padding:5px 15px;font-size:0.8rem;" onclick="openRejectModal('${o.id}')">Reject</button>`;
                }

                html += `
                    <tr>
                        <td>${o.orderId}</td>
                        <td>${o.userEmail}</td>
                        <td>₹${o.amount}</td>
                        <td><a href="${o.paymentProof}" target="_blank" style="color:var(--vivid-red);">View Proof</a></td>
                        <td style="text-transform:uppercase;font-weight:bold;">${o.status}</td>
                        <td>${actions}</td>
                    </tr>`;
            }
        });
        document.getElementById('orders-table-body').innerHTML = html || '<tr><td colspan="6" style="text-align:center;padding:30px;">No orders found.</td></tr>';
    });
}

function approveOrder(id) {
    if (confirm('Approve this payment?')) {
        db.ref('orders/' + id).update({ status: 'approved' });
        showToast('Order approved. User can now download.');
    }
}

function openRejectModal(id) {
    document.getElementById('reject-order-id').value = id;
    document.getElementById('reject-modal').style.display = 'flex';
}

function confirmReject() {
    const id = document.getElementById('reject-order-id').value;
    const reason = document.getElementById('reject-reason').value;
    
    db.ref('orders/' + id).update({ status: 'rejected', rejectionReason: reason });
    document.getElementById('reject-modal').style.display = 'none';
    showToast('Order rejected.');
}