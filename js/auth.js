// ==========================================
// ADMIN AUTHENTICATION & SECURITY
// ==========================================
// This uses Firebase Realtime DB to check user role.
// DO NOT trust frontend email checks alone.

let currentAdmin = null;

function adminLogin(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            checkAdminAuth();
        })
        .catch(error => {
            showToast(error.message, true);
        });
}

function checkAdminAuth() {
    auth.onAuthStateChanged(user => {
        if (user) {
            // Check if user is admin in DB
            db.ref('users/' + user.uid + '/role').once('value').then(snapshot => {
                if (snapshot.val() === 'admin') {
                    currentAdmin = user;
                    const emailDisplay = document.getElementById('admin-email-display');
                    if (emailDisplay) emailDisplay.innerText = user.email;
                    
                    // Redirect if on login page
                    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '/YT-AIMBOT-SENSI-ADMIN/') {
                        window.location.href = 'dashboard.html';
                    }
                } else {
                    // Not an admin, sign out
                    auth.signOut().then(() => {
                        showToast('Access Denied: You are not an admin.', true);
                    });
                }
            });
        } else {
            // Redirect to login if trying to access protected page
            const isProtected = !window.location.pathname.includes('index.html') && window.location.pathname !== '/' && !window.location.pathname.endsWith('/YT-AIMBOT-SENSI-ADMIN/');
            if (isProtected) {
                window.location.href = 'index.html';
            }
        }
    });
}

function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}

// UI Utils
function showToast(message, isError = false) {
    const toast = document.getElementById('toast') || createToastElement();
    toast.innerText = message;
    toast.style.borderLeftColor = isError ? '#ff0033' : '#0aff00';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
function createToastElement() { const t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); return t; }