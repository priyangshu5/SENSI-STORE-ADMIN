// ==========================================
// ADMIN PANEL - PRODUCTS MANAGEMENT (No Backend ImageKit)
// ==========================================

function loadProducts() {
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;

    db.ref('products').on('value', snap => {
        const products = snap.val() || {};
        let html = '';
        
        Object.keys(products).forEach(id => {
            const p = products[id];
            const imgSrc = p.image || 'https://via.placeholder.com/50';
            
            html += `
                <tr>
                    <td><img src="${imgSrc}" alt="${p.name}" style="width: 50px; height: 50px; object-fit: cover; border: 1px solid var(--vivid-red);"></td>
                    <td>${p.name}</td>
                    <td>₹${p.price}</td>
                    <td>${p.badge || 'None'}</td>
                    <td>
                        <button class="btn-cyber" style="padding:5px 15px;font-size:0.8rem;" onclick="editProduct('${id}')">Edit</button>
                        <button class="btn-google" style="padding:5px 15px;font-size:0.8rem;background:var(--vivid-red);color:white;border:none;" onclick="deleteProduct('${id}')">Delete</button>
                    </td>
                </tr>`;
        });
        
        tbody.innerHTML = html || '<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--silver);">No products found. Add one!</td></tr>';
    });
}

function openProductModal(id = null) {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    document.getElementById('modal-title').innerText = id ? 'Edit Product' : 'Add Product';
    document.getElementById('prod-id').value = id || '';
    
    if (id) {
        db.ref('products/' + id).once('value').then(snap => {
            const p = snap.val();
            if (!p) return;
            
            document.getElementById('prod-name').value = p.name || '';
            document.getElementById('prod-price').value = p.price || '';
            document.getElementById('prod-desc').value = p.description || '';
            document.getElementById('prod-features').value = p.features || '';
            document.getElementById('prod-device').value = p.device || '';
            document.getElementById('prod-category').value = p.category || '';
            document.getElementById('prod-badge').value = p.badge || '';
            document.getElementById('prod-mediafire').value = p.mediafireLink || '';
            document.getElementById('file-name').innerText = p.image ? 'Current image saved' : 'No file selected';
        });
    } else {
        document.querySelectorAll('.modal-content .cyber-input').forEach(el => el.value = '');
        document.getElementById('file-name').innerText = 'No file selected';
    }
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.style.display = 'none';
}

async function saveProduct() {
    const id = document.getElementById('prod-id').value;
    const file = document.getElementById('prod-image').files[0];
    
    let imageUrl = id 
        ? (await db.ref('products/' + id + '/image').once('value')).val() 
        : 'https://via.placeholder.com/150';

    if (file) {
        showLoader();
        try {
            // 1. Generate ImageKit Authentication Signature in Browser
            const token = Math.random().toString(36).substring(2, 12);
            const expire = Math.floor(Date.now() / 1000) + 3600;
            const stringToSign = token + expire;
            const signature = CryptoJS.HmacSHA1(stringToSign, ImageKitConfig.privateKey).toString(CryptoJS.enc.Hex);

            // 2. Upload to ImageKit
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileName", Date.now() + ".jpg");
            formData.append("folder", "sensi_pack/");
            formData.append("publicKey", ImageKitConfig.publicKey);
            
            // Attach the generated signature
            formData.append("signature", signature);
            formData.append("expire", expire);
            formData.append("token", token);

            const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", { 
                method: "POST", 
                body: formData 
            });
            
            const uploadData = await uploadRes.json();
            
            if (uploadData.url) {
                imageUrl = uploadData.url;
                showToast('Image uploaded successfully.');
            } else {
                throw new Error(uploadData.message || 'Unknown ImageKit error');
            }
            hideLoader();
        } catch(e) {
            hideLoader();
            console.error(e);
            showToast('Image upload failed: ' + e.message, true);
            return; // Stop saving if image upload fails, because images are mandatory for products
        }
    }

    const productData = {
        name: document.getElementById('prod-name').value,
        price: parseFloat(document.getElementById('prod-price').value) || 0,
        description: document.getElementById('prod-desc').value,
        features: document.getElementById('prod-features').value,
        device: document.getElementById('prod-device').value,
        category: document.getElementById('prod-category').value,
        badge: document.getElementById('prod-badge').value,
        mediafireLink: document.getElementById('prod-mediafire').value,
        image: imageUrl
    };

    if (!productData.name || !productData.price) {
        return showToast('Please fill in at least the name and price.', true);
    }

    if (id) {
        db.ref('products/' + id).update(productData);
        showToast('Product updated.');
    } else {
        db.ref('products').push(productData);
        showToast('Product added.');
    }
    
    closeProductModal();
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product? This cannot be undone.')) {
        db.ref('products/' + id).remove();
        showToast('Product deleted.');
    }
}

// ==========================================
// UI UTILITIES (Admin Loader)
// ==========================================
function showLoader() {
    document.body.style.opacity = '0.7';
    document.body.style.pointerEvents = 'none';
}

function hideLoader() {
    document.body.style.opacity = '1';
    document.body.style.pointerEvents = 'auto';
}