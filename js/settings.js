function loadSettings() {
    db.ref('settings/support').on('value', snap => {
        const data = snap.val() || {};
        document.getElementById('discord-link').value = data.discord || '';
        document.getElementById('youtube-link').value = data.youtube || '';
    });
}

function saveSettings() {
    const discord = document.getElementById('discord-link').value;
    const youtube = document.getElementById('youtube-link').value;
    
    db.ref('settings/support').set({ discord, youtube });
    showToast('Settings saved.');
}