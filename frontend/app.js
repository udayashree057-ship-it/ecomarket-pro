// ============================================================================
// ECOMARKET - VANILLA JS APPLICATION
// Global State, Authentication, and Page Management
// ============================================================================

// Global state
let currentUser = null;
let currentRole = null;
let products = [];
let cart = [];
let orders = [];
let customers = [];

// Initialize app when DOM is ready
function initializeApp() {
    loadData();
    checkAuth();
    initializeChatbot();
}

// If DOM is already loaded, initialize immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ============================================================================
// DATA PERSISTENCE
// ============================================================================

function loadData() {
    products = JSON.parse(localStorage.getItem('products')) || [];
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    customers = JSON.parse(localStorage.getItem('customers')) || [];
}

function saveData() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('customers', JSON.stringify(customers));
}

// ============================================================================
// AUTHENTICATION & CORE PAGE MANAGEMENT
// ============================================================================

function checkAuth() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        showRoleSelection();
    } else {
        showAuth();
    }
}

function showAuth() {
    document.getElementById('authPage').style.display = 'block';
    document.getElementById('roleSelection').style.display = 'none';
    document.getElementById('navbar').style.display = 'none';
}

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value;
    const address = document.getElementById('regAddress').value;

    if (!name || !email || !password || !phone || !address) {
        alert('Please fill all fields');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.email === email)) {
        alert('Email already registered');
        return;
    }

    const user = { name, email, password, phone, address };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful! Please login.');
    showLogin();
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please fill all fields');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showRoleSelection();
    } else {
        alert('Invalid credentials');
    }
}

function logout() {
    currentUser = null;
    currentRole = null;
    localStorage.removeItem('currentUser');
    cart = [];
    saveData();
    showAuth();
}

function showRoleSelection() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('roleSelection').style.display = 'block';
    document.getElementById('navbar').style.display = 'block';
    document.getElementById('userGreeting').textContent = `Hello, ${currentUser.name}`;
    hideAllPages();
}

function selectRole(role) {
    currentRole = role;
    document.getElementById('roleSelection').style.display = 'none';
    hideAllPages();

    if (role === 'buyer') {
        showBuyerPage();
    } else if (role === 'seller') {
        showSellerPage();
    } else if (role === 'renter') {
        showRenterPage();
    } else if (role === 'orders') {
        showOrdersPage();
    }
}

function backToRoleSelection() {
    currentRole = null;
    hideAllPages();
    document.getElementById('roleSelection').style.display = 'block';
}

function hideAllPages() {
    document.getElementById('buyerPage').style.display = 'none';
    document.getElementById('sellerPage').style.display = 'none';
    document.getElementById('renterPage').style.display = 'none';
    document.getElementById('customerPage').style.display = 'none';
    document.getElementById('ordersPage').style.display = 'none';
}

// ============================================================================
// BUYER PAGE - Product Browsing & Shopping Cart
// ============================================================================

function showBuyerPage() {
    document.getElementById('buyerPage').style.display = 'block';
    displayProducts();
    updateCartCount();
}

function displayProducts(filter = null) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    let filteredProducts = products.filter(p => !p.forRent);

    if (filter) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(filter.toLowerCase()) ||
            (p.description || '').toLowerCase().includes(filter.toLowerCase())
        );
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="showProductDetail('${product.id}')">
            <img src="${product.image || getPlaceholderImage()}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">₹${product.price}</div>
                <div class="eco-rating">
                    <span>🌿 ${translate('ecoRating')}: ${'⭐'.repeat(product.ecoRating)}</span>
                </div>
                <div class="carbon-footprint">
                    🌍 ${translate('carbonFootprint')}: ${product.carbonFootprint} kg CO₂
                </div>
                <div class="seller-info">
                    Seller: ${product.sellerName}
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart('${product.id}')">${translate('addToCart')}</button>
            </div>
        </div>
    `).join('');
}

function searchProducts() {
    const query = document.getElementById('searchInput').value;
    displayProducts(query);
}

function filterByCategory() {
    const category = document.getElementById('categoryFilter').value;
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    let filteredProducts = products.filter(p => !p.forRent);

    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="showProductDetail('${product.id}')">
            <img src="${product.image || getPlaceholderImage()}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">₹${product.price}</div>
                <div class="eco-rating">
                    <span>🌿 ${translate('ecoRating')}: ${'⭐'.repeat(product.ecoRating)}</span>
                </div>
                <div class="carbon-footprint">
                    🌍 ${translate('carbonFootprint')}: ${product.carbonFootprint} kg CO₂
                </div>
                <div class="seller-info">
                    Seller: ${product.sellerName}
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart('${product.id}')">${translate('addToCart')}</button>
            </div>
        </div>
    `).join('');
}

function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('productModal');
    const detail = document.getElementById('productDetail');

    detail.innerHTML = `
        <div class="product-detail-content">
            <div>
                <img src="${product.image || getPlaceholderImage()}" alt="${product.name}" class="product-detail-image">
                <div class="barcode-container">
                    <h4>Product Barcode</h4>
                    <canvas id="productBarcode"></canvas>
                    <div class="barcode-id">ID: ${product.barcodeId || 'N/A'}</div>
                    <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Scan this code to get complete product information</p>
                </div>
            </div>
            <div>
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <div class="product-price">₹${product.price}</div>
                
                <div class="product-specs">
                    <h4>🌿 Eco Information</h4>
                    <p><strong>Eco Rating:</strong> ${'⭐'.repeat(product.ecoRating)}</p>
                    <p><strong>Carbon Footprint:</strong> ${product.carbonFootprint} kg CO₂</p>
                    <p><em>By choosing this product, you're helping reduce environmental impact!</em></p>
                </div>
                
                <div class="product-specs">
                    <h4>📦 Product Details</h4>
                    <p><strong>Barcode ID:</strong> ${product.barcodeId || 'N/A'}</p>
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Manufacturer:</strong> ${product.manufacturer || 'N/A'}</p>
                    <p><strong>Manufacturing Location:</strong> ${product.manufacturerLocation || 'N/A'}</p>
                    <p><strong>Manufacture Date:</strong> ${product.manufactureDate || 'N/A'}</p>
                    ${product.expiryDate ? `<p><strong>Expiry Date:</strong> ${product.expiryDate}</p>` : ''}
                </div>
                
                ${product.usageInstructions ? `
                <div class="product-specs">
                    <h4>📖 Usage Instructions</h4>
                    <p>${product.usageInstructions}</p>
                </div>
                ` : ''}
                
                ${product.recyclingInfo ? `
                <div class="product-specs">
                    <h4>♻️ Recycling Information</h4>
                    <p>${product.recyclingInfo}</p>
                </div>
                ` : ''}
                
                <div class="product-specs">
                    <h4>👤 Seller Information</h4>
                    <p><strong>Name:</strong> ${product.sellerName}</p>
                    <p><strong>Email:</strong> ${product.sellerEmail}</p>
                </div>
                
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}'); closeProductModal();">${translate('addToCart')}</button>
            </div>
        </div>
    `;

    modal.style.display = 'block';

    // Generate QR code with barcode ID
    setTimeout(() => {
        const canvas = document.getElementById('productBarcode');
        if (canvas && typeof QRCode !== 'undefined') {
            const barcodeData = {
                barcodeId: product.barcodeId,
                productId: product.id,
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                ecoRating: product.ecoRating,
                carbonFootprint: product.carbonFootprint
            };
            QRCode.toCanvas(canvas, JSON.stringify(barcodeData), { width: 200 });
        }
    }, 100);
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

// ============================================================================
// SELLER PAGE - Product Management
// ============================================================================

function showSellerPage() {
    document.getElementById('sellerPage').style.display = 'block';
    renderSellerProducts();
    attachProductFormListener();
    attachSellerSearchListeners();
}

function attachSellerSearchListeners() {
    const searchInput = document.getElementById('sellerSearchInput');
    const categoryFilter = document.getElementById('sellerCategoryFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', searchSellerProducts);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', searchSellerProducts);
    }
}

function attachProductFormListener() {
    const form = document.getElementById('productForm');
    if (form && !form._bound) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            addProductToInventory();
        });
        form._bound = true;
    }
}

function addProductToInventory() {
    const id = Date.now().toString();
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDesc').value;
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const category = document.getElementById('productCategory').value;
    const ecoRating = parseInt(document.getElementById('ecoRating').value) || 1;
    const carbonFootprint = parseFloat(document.getElementById('carbonFootprint').value) || 0;
    const manufacturer = document.getElementById('manufacturer').value || '';
    const manufacturerLocation = document.getElementById('manufacturerLocation').value || '';
    const manufactureDate = document.getElementById('manufactureDate').value || '';
    const expiryDate = document.getElementById('expiryDate').value || '';
    const usageInstructions = document.getElementById('usageInstructions').value || '';
    const recyclingInfo = document.getElementById('recyclingInfo').value || '';
    const forRent = document.getElementById('forRent').checked;
    const sellerName = currentUser ? currentUser.name : 'Seller';
    const sellerEmail = currentUser ? currentUser.email : '';

    const fileInput = document.getElementById('productImage');
    const processAndSaveProduct = (imageData) => {
        const product = {
            id,
            name,
            description,
            price,
            category,
            ecoRating,
            carbonFootprint,
            manufacturer,
            manufacturerLocation,
            manufactureDate,
            expiryDate,
            usageInstructions,
            recyclingInfo,
            sellerName,
            sellerEmail,
            forRent,
            image: imageData || '',
            barcodeId: id
        };

        products.push(product);
        saveData();
        alert('Product added successfully!');
        renderSellerProducts();
        displayProducts();
        document.getElementById('productForm').reset();
    };

    if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            processAndSaveProduct(e.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        processAndSaveProduct('');
    }
}

function renderSellerProducts() {
    const list = document.getElementById('sellerProductList');
    if (!list) return;

    const sellerProducts = products.filter(p => 
        p.sellerEmail === (currentUser && currentUser.email)
    );

    // Update product count
    const countEl = document.getElementById('productCount');
    if (countEl) {
        countEl.textContent = sellerProducts.length + ' product' + (sellerProducts.length !== 1 ? 's' : '');
    }

    if (sellerProducts.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <div class="empty-state-text">No products added yet. Add your first product to get started!</div>
            </div>
        `;
        return;
    }

    list.innerHTML = sellerProducts.map(p => `
        <div class="seller-product-card">
            <img src="${p.image || getPlaceholderImage()}" alt="${p.name}" class="seller-product-image">
            <div class="seller-product-info">
                <div class="seller-product-name">${p.name}</div>
                <div class="seller-product-price">₹${p.price.toLocaleString('en-IN')}</div>
                <div class="seller-product-meta">
                    <span class="seller-product-badge">${p.category}</span>
                    ${p.forRent ? '<span class="seller-product-badge" style="background:#d4edda;color:#155724;">For Rent</span>' : ''}
                </div>
                <div class="seller-product-rating">⭐ ${p.ecoRating}/5 Eco Rating</div>
                <small style="color:#999;margin-top:0.5rem;">Carbon: ${p.carbonFootprint} kg CO₂</small>
                <div class="seller-product-actions">
                    <button class="btn-small btn-edit" onclick="editProduct('${p.id}')">✏️ Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteProduct('${p.id}')">🗑️ Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Store the ID of the product being edited
    window.editingProductId = productId;

    // Populate the edit form with product details
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductDesc').value = product.description || '';
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editEcoRating').value = product.ecoRating;
    document.getElementById('editCarbonFootprint').value = product.carbonFootprint;
    document.getElementById('editManufacturer').value = product.manufacturer || '';
    document.getElementById('editManufacturerLocation').value = product.manufacturerLocation || '';
    document.getElementById('editManufactureDate').value = product.manufactureDate || '';
    document.getElementById('editExpiryDate').value = product.expiryDate || '';
    document.getElementById('editUsageInstructions').value = product.usageInstructions || '';
    document.getElementById('editRecyclingInfo').value = product.recyclingInfo || '';
    document.getElementById('editForRent').checked = product.forRent || false;

    // Show the edit modal
    document.getElementById('editProductModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editProductModal').style.display = 'none';
    window.editingProductId = null;
}

function saveEditProduct() {
    const productId = window.editingProductId;
    if (!productId) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const imageInput = document.getElementById('editProductImage');
    
    // Update product details
    product.name = document.getElementById('editProductName').value;
    product.description = document.getElementById('editProductDesc').value;
    product.price = parseFloat(document.getElementById('editProductPrice').value);
    product.category = document.getElementById('editProductCategory').value;
    product.ecoRating = parseInt(document.getElementById('editEcoRating').value);
    product.carbonFootprint = parseFloat(document.getElementById('editCarbonFootprint').value);
    product.manufacturer = document.getElementById('editManufacturer').value;
    product.manufacturerLocation = document.getElementById('editManufacturerLocation').value;
    product.manufactureDate = document.getElementById('editManufactureDate').value;
    product.expiryDate = document.getElementById('editExpiryDate').value;
    product.usageInstructions = document.getElementById('editUsageInstructions').value;
    product.recyclingInfo = document.getElementById('editRecyclingInfo').value;
    product.forRent = document.getElementById('editForRent').checked;

    // Handle image upload if a new image is selected
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            product.image = e.target.result;
            saveData();
            renderSellerProducts();
            displayProducts();
            closeEditModal();
            alert('✅ Product updated successfully!');
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        // Save without changing image
        saveData();
        renderSellerProducts();
        displayProducts();
        closeEditModal();
        alert('✅ Product updated successfully!');
    }
}

function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    products = products.filter(p => p.id !== productId);
    saveData();
    renderSellerProducts();
    displayProducts();
    alert('Product deleted');
}

function searchSellerProducts() {
    const query = document.getElementById('sellerSearchInput').value.toLowerCase();
    const category = document.getElementById('sellerCategoryFilter').value;
    const list = document.getElementById('sellerProductList');
    if (!list) return;

    let filtered = products.filter(p => 
        p.sellerEmail === (currentUser && currentUser.email)
    );

    if (query) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(query) ||
            (p.description || '').toLowerCase().includes(query)
        );
    }

    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-text">No products match your search</div>
            </div>
        `;
        return;
    }

    list.innerHTML = filtered.map(p => `
        <div class="seller-product-card">
            <img src="${p.image || getPlaceholderImage()}" alt="${p.name}" class="seller-product-image">
            <div class="seller-product-info">
                <div class="seller-product-name">${p.name}</div>
                <div class="seller-product-price">₹${p.price.toLocaleString('en-IN')}</div>
                <div class="seller-product-meta">
                    <span class="seller-product-badge">${p.category}</span>
                    ${p.forRent ? '<span class="seller-product-badge" style="background:#d4edda;color:#155724;">For Rent</span>' : ''}
                </div>
                <div class="seller-product-rating">⭐ ${p.ecoRating}/5 Eco Rating</div>
                <small style="color:#999;margin-top:0.5rem;">Carbon: ${p.carbonFootprint} kg CO₂</small>
                <div class="seller-product-actions">
                    <button class="btn-small btn-edit" onclick="editProduct('${p.id}')">✏️ Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteProduct('${p.id}')">🗑️ Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================================================
// RENTER PAGE - Rental Products
// ============================================================================

function showRenterPage() {
    document.getElementById('renterPage').style.display = 'block';
    displayRentProducts();
}

function displayRentProducts(filter = null) {
    const grid = document.getElementById('rentProductGrid');
    if (!grid) return;

    let rentProducts = products.filter(p => p.forRent);

    if (filter) {
        rentProducts = rentProducts.filter(p =>
            p.name.toLowerCase().includes(filter.toLowerCase()) ||
            (p.description || '').toLowerCase().includes(filter.toLowerCase())
        );
    }

    grid.innerHTML = rentProducts.map(product => `
        <div class="product-card" onclick="showProductDetail('${product.id}')">
            <img src="${product.image || getPlaceholderImage()}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">₹${product.price}/day</div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart('${product.id}')">${translate('addToCart')}</button>
            </div>
        </div>
    `).join('');
}

function searchRentProducts() {
    const query = document.getElementById('rentSearchInput').value;
    displayRentProducts(query);
}

// ============================================================================
// SELLER PAYMENT MANAGEMENT - UPI & Bank Details
// ============================================================================

function togglePaymentForm(type) {
    document.getElementById('upiForm').style.display = type === 'upi' ? 'block' : 'none';
    document.getElementById('bankForm').style.display = type === 'bank' ? 'block' : 'none';
}

function saveUpiDetails() {
    const upiId = document.getElementById('sellerUpiId').value;
    const upiName = document.getElementById('sellerUpiName').value;

    if (!upiId || !upiName) {
        alert('Please fill all UPI details');
        return;
    }

    if (!currentUser.paymentDetails) {
        currentUser.paymentDetails = {};
    }

    currentUser.paymentDetails.upi = {
        upiId: upiId,
        name: upiName
    };

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex].paymentDetails = currentUser.paymentDetails;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    document.getElementById('upiStatus').style.display = 'block';
    document.getElementById('upiStatus').innerHTML = '✅ UPI Details Saved Successfully!';
    setTimeout(() => {
        document.getElementById('upiStatus').style.display = 'none';
    }, 3000);
}

function saveBankDetails() {
    const bankName = document.getElementById('sellerBankName').value;
    const accountNumber = document.getElementById('sellerAccountNumber').value;
    const ifscCode = document.getElementById('sellerIfscCode').value;
    const bankName2 = document.getElementById('sellerBankName2').value;

    if (!bankName || !accountNumber || !ifscCode || !bankName2) {
        alert('Please fill all bank details');
        return;
    }

    if (!currentUser.paymentDetails) {
        currentUser.paymentDetails = {};
    }

    currentUser.paymentDetails.bank = {
        accountName: bankName,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        bankName: bankName2
    };

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex].paymentDetails = currentUser.paymentDetails;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    document.getElementById('bankStatus').style.display = 'block';
    document.getElementById('bankStatus').innerHTML = '✅ Bank Details Saved Successfully!';
    setTimeout(() => {
        document.getElementById('bankStatus').style.display = 'none';
    }, 3000);
}

// ============================================================================
// BUYER UPI QR CODE GENERATION & PAYMENT
// ============================================================================

function generateUpiQrCode() {
    const upiId = document.getElementById('buyerUpiId').value;
    const amount = document.getElementById('upiAmount').value || '0';
    const qrContainer = document.getElementById('upiQrCode');

    if (!upiId || upiId.trim() === '') {
        qrContainer.innerHTML = '<small style="color:#999;">Enter UPI ID to generate QR code</small>';
        return;
    }

    // Clear previous QR code
    qrContainer.innerHTML = '';

    // Generate QR code using QRCode library
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(currentUser.name || 'EcoMarket Customer')}&am=${amount}&tn=EcoMarket`;
    
    try {
        new QRCode(qrContainer, {
            text: upiString,
            width: 180,
            height: 180,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (e) {
        qrContainer.innerHTML = '<small style="color:#999;">Error generating QR code</small>';
    }
}

function downloadUpiQr() {
    const canvas = document.querySelector('#upiQrCode canvas');
    if (!canvas) {
        alert('Please generate QR code first');
        return;
    }

    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'upi_payment_qr.png';
    link.click();
    alert('✅ QR Code downloaded!');
}

function openUpiApp() {
    const upiId = document.getElementById('buyerUpiId').value;
    const amount = document.getElementById('upiAmount').value || '0';

    if (!upiId || !amount || amount === '0') {
        alert('Please enter seller UPI ID and amount');
        return;
    }

    // Create UPI deep link
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(currentUser.name || 'EcoMarket Customer')}&am=${amount}&tn=EcoMarket`;
    
    // Try to open UPI app
    window.location.href = upiLink;
    
    setTimeout(() => {
        alert('Opening UPI app... If no UPI app is installed, please install Google Pay, PhonePe, or Paytm');
    }, 500);
}

// ============================================================================
// ORDERS PAGE - View Purchase History
// ============================================================================

function showOrdersPage() {
    document.getElementById('ordersPage').style.display = 'block';
    renderOrdersList();
}

function renderOrdersList() {
    const content = document.getElementById('ordersContent');
    if (!content) return;

    // Filter orders for current user
    const userOrders = orders.filter(o => o.customerEmail === (currentUser && currentUser.email));

    if (userOrders.length === 0) {
        content.innerHTML = `
            <div style="text-align:center;padding:40px;color:#999;">
                <h3>📦 No Orders Yet</h3>
                <p>You haven't placed any orders yet.</p>
                <p>Start shopping to see your orders here!</p>
                <button onclick="backToRoleSelection(); selectRole('buyer');" style="margin-top:20px;padding:10px 20px;background:#667eea;color:white;border:none;border-radius:4px;cursor:pointer;font-size:16px;">
                    🛍️ Start Shopping
                </button>
            </div>
        `;
        return;
    }

    content.innerHTML = `
        <h3>📦 My Orders (${userOrders.length})</h3>
        ${userOrders.map((order, index) => `
            <div class="order-item" style="border:1px solid #ddd;border-radius:8px;padding:20px;margin-bottom:20px;background:#f9f9f9;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                    <div>
                        <h4 style="margin:0 0 5px 0;">Order #${index + 1}</h4>
                        <small style="color:#999;">Order Date: ${new Date(order.date).toLocaleDateString()}</small>
                    </div>
                    <span style="background:#667eea;color:white;padding:5px 10px;border-radius:20px;font-size:12px;font-weight:bold;">
                        ${order.status || 'Pending'}
                    </span>
                </div>
                
                <div style="background:white;padding:15px;border-radius:4px;margin-bottom:15px;">
                    <h5 style="margin:0 0 10px 0;">Order Items:</h5>
                    ${order.items.map(item => `
                        <div style="padding:10px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;">
                            <div>
                                <strong>${item.name}</strong><br>
                                <small style="color:#999;">Qty: ${item.quantity}</small>
                            </div>
                            <div style="text-align:right;font-weight:bold;">
                                ₹${(item.price * item.quantity).toLocaleString('en-IN')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;padding:15px;background:white;border-radius:4px;">
                    <div>
                        <small style="color:#999;">Subtotal:</small><br>
                        <strong>₹${order.subtotal.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                        <small style="color:#999;">Total (with tax):</small><br>
                        <strong style="font-size:18px;color:#667eea;">₹${order.total.toLocaleString('en-IN')}</strong>
                    </div>
                </div>

                <div style="margin-top:15px;display:flex;gap:10px;">
                    <button onclick="downloadOrderReceipt(${index})" style="flex:1;padding:10px;background:#28a745;color:white;border:none;border-radius:4px;cursor:pointer;">
                        📄 Download Receipt
                    </button>
                    <button onclick="downloadOrderInvoice(${index})" style="flex:1;padding:10px;background:#17a2b8;color:white;border:none;border-radius:4px;cursor:pointer;">
                        📋 Download Invoice
                    </button>
                </div>
            </div>
        `).join('')}
    `;
}

function downloadOrderReceipt(orderIndex) {
    const userOrders = orders.filter(o => o.customerEmail === (currentUser && currentUser.email));
    const order = userOrders[orderIndex];
    if (!order) return;

    let receiptText = `
ECOMARKET - ORDER RECEIPT
================================

Order Date: ${new Date(order.date).toLocaleDateString()}
Order Status: ${order.status || 'Pending'}

CUSTOMER INFORMATION
${currentUser.name}
${currentUser.email}
${currentUser.phone}

ORDER ITEMS
`;
    
    order.items.forEach(item => {
        receiptText += `\n${item.name}
Quantity: ${item.quantity}
Price: ₹${item.price} x ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}`;
    });

    receiptText += `\n\nORDER SUMMARY
Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}
Tax (18%): ₹${(order.total - order.subtotal).toLocaleString('en-IN')}
Total: ₹${order.total.toLocaleString('en-IN')}

Thank you for shopping with EcoMarket! 🌱
    `;

    downloadFile(receiptText, `receipt_${orderIndex + 1}.txt`);
    alert('✅ Receipt downloaded successfully!');
}

function downloadOrderInvoice(orderIndex) {
    const userOrders = orders.filter(o => o.customerEmail === (currentUser && currentUser.email));
    const order = userOrders[orderIndex];
    if (!order) return;

    let invoiceText = `
ECOMARKET - TAX INVOICE
=====================================

Invoice Number: INV-${order.id || orderIndex + 1}
Invoice Date: ${new Date(order.date).toLocaleDateString()}
Status: ${order.status || 'Pending'}

BILL TO:
${currentUser.name}
${currentUser.email}
${currentUser.phone}
${currentUser.address}

SHIP TO:
${currentUser.name}
${currentUser.address}

LINE ITEMS:
`;

    order.items.forEach((item, idx) => {
        invoiceText += `\n${idx + 1}. ${item.name}
   Unit Price: ₹${item.price}
   Quantity: ${item.quantity}
   Amount: ₹${(item.price * item.quantity).toLocaleString('en-IN')}`;
    });

    invoiceText += `\n\nTAX CALCULATION:
Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}
SGST (9%): ₹${((order.total - order.subtotal) / 2).toFixed(2)}
CGST (9%): ₹${((order.total - order.subtotal) / 2).toFixed(2)}
─────────────────────────
Total: ₹${order.total.toLocaleString('en-IN')}

Terms & Conditions:
- This is an electronic invoice
- Products are sold as-is
- Return policy: 7 days from purchase
- Eco-friendly packaging used

Thank you for supporting sustainable shopping! 🌱
    `;

    downloadFile(invoiceText, `invoice_${orderIndex + 1}.txt`);
    alert('✅ Invoice downloaded successfully!');
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// ============================================================================
// CUSTOMER MANAGEMENT PAGE
// ============================================================================

function showCustomerPage() {
    document.getElementById('customerPage').style.display = 'block';
    renderCustomerList();
    attachCustomerFormListener();
}

function attachCustomerFormListener() {
    const form = document.getElementById('customerForm');
    if (form && !form._bound) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            addCustomer();
        });
        form._bound = true;
    }
}

function renderCustomerList() {
    const listEl = document.getElementById('customerList');
    if (!listEl) return;

    if (customers.length === 0) {
        listEl.innerHTML = '<p style="text-align:center;color:#999;">No customers added yet</p>';
        return;
    }

    listEl.innerHTML = customers.map(c => `
        <div class="customer-item" style="padding:10px;border-bottom:1px solid #eee;">
            <strong>${c.name}</strong><br>
            <small>${c.email} | ${c.phone}</small>
        </div>
    `).join('');
}

function addCustomer() {
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    const notes = document.getElementById('customerNotes').value;

    if (!name || !email || !phone) {
        alert('Name, email, and phone are required');
        return;
    }

    const customer = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        address,
        notes,
        addedBy: currentUser ? currentUser.name : 'Manual',
        addedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        totalOrders: 0,
        lastOrderDate: null
    };

    customers.push(customer);
    saveData();
    alert('Customer added successfully!');
    renderCustomerList();
    document.getElementById('customerForm').reset();
}

function searchCustomers() {
    const query = document.getElementById('customerSearch').value.toLowerCase();
    const listEl = document.getElementById('customerList');
    if (!listEl) return;

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        (c.phone || '').includes(query)
    );

    if (filtered.length === 0) {
        listEl.innerHTML = '<p style="text-align:center;color:#999;">No customers match your search</p>';
        return;
    }

    listEl.innerHTML = filtered.map(c => `
        <div class="customer-item" style="padding:10px;border-bottom:1px solid #eee;">
            <strong>${c.name}</strong><br>
            <small>${c.email} | ${c.phone}</small>
        </div>
    `).join('');
}

function exportCustomers() {
    const dataStr = JSON.stringify(customers, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customers-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// ============================================================================
// CART & CHECKOUT
// ============================================================================

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveData();
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const el = document.getElementById('cartCount');
    if (el) el.textContent = count;
}

function viewCart() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    if (!modal || !cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align:center;padding:40px;color:#999;">
                <h3 style="font-size:1.5rem;margin-bottom:10px;">🛒 Your Cart is Empty</h3>
                <p>Add products to your cart to get started!</p>
            </div>
        `;
        document.getElementById('cartTotal').textContent = '0.00';
        document.getElementById('cartSubtotal').textContent = '₹0.00';
    } else {
        let html = '<div style="max-height:400px;overflow-y:auto;">';
        
        cart.forEach((item, index) => {
            const itemTotal = (item.price * item.quantity).toLocaleString('en-IN');
            html += `
                <div style="padding:15px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;background:#fff;margin-bottom:10px;border-radius:4px;box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                    <div style="flex:1;">
                        <strong style="font-size:1rem;color:#333;display:block;margin-bottom:5px;">${item.name}</strong>
                        <small style="color:#999;display:block;margin-bottom:8px;">₹${item.price.toLocaleString('en-IN')} each</small>
                        <div style="display:flex;gap:8px;align-items:center;">
                            <button onclick="updateCartQuantity(${index}, -1)" style="width:28px;height:28px;border:1px solid #ddd;background:#f5f5f5;cursor:pointer;border-radius:4px;font-weight:bold;color:#667eea;">−</button>
                            <span style="min-width:30px;text-align:center;font-weight:bold;">${item.quantity}</span>
                            <button onclick="updateCartQuantity(${index}, 1)" style="width:28px;height:28px;border:1px solid #ddd;background:#f5f5f5;cursor:pointer;border-radius:4px;font-weight:bold;color:#667eea;">+</button>
                        </div>
                    </div>
                    <div style="text-align:right;min-width:150px;">
                        <div style="font-size:1.3rem;font-weight:bold;color:#667eea;margin-bottom:10px;">₹${itemTotal}</div>
                        <button onclick="removeFromCart(${index})" style="padding:6px 12px;background:#dc3545;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;">🗑️ Remove</button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        cartItems.innerHTML = html;

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal;
        
        document.getElementById('cartSubtotal').textContent = '₹' + subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2});
        document.getElementById('cartTotal').textContent = total.toLocaleString('en-IN', {minimumFractionDigits: 2});
    }

    modal.style.display = 'block';
}

function updateCartQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveData();
    viewCart();
    updateCartCount();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveData();
    viewCart();
    updateCartCount();
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    closeCart();
    document.getElementById('checkoutModal').style.display = 'block';
    document.getElementById('deliveryAddress').value = currentUser.address;

    // Calculate and display order summary
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;
    
    document.getElementById('orderSubtotal').textContent = '₹' + subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2});
    document.getElementById('orderTotal').textContent = total.toLocaleString('en-IN', {minimumFractionDigits: 2});

    // Handle payment method change
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.removeEventListener('change', handlePaymentChange);
        radio.addEventListener('change', handlePaymentChange);
    });
}

function handlePaymentChange(e) {
    // Hide all payment detail sections
    document.getElementById('upiPaymentDetails').style.display = 'none';
    document.getElementById('cardPaymentDetails').style.display = 'none';
    
    // Show the selected payment method details
    if (e.target.value === 'upi') {
        document.getElementById('upiPaymentDetails').style.display = 'block';
        loadUpiPaymentSection();
    } else if (e.target.value === 'online') {
        document.getElementById('cardPaymentDetails').style.display = 'block';
    }
}

function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

function showSellerOrders() {
    // Show orders page filtered for seller
    hideAllPages();
    document.getElementById('ordersPage').style.display = 'block';
    renderSellerOrders();
}

function renderSellerOrders() {
    const ordersContent = document.getElementById('ordersContent');
    if (!ordersContent) return;
    const sellerEmail = currentUser && currentUser.email;
    const sellerOrders = orders.filter(o => o.sellerEmail === sellerEmail);

    if (sellerOrders.length === 0) {
        ordersContent.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">No orders yet for your store.</div></div>`;
        return;
    }

    ordersContent.innerHTML = sellerOrders.map(o => `
        <div class="order-item">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <strong>Order #${o.id}</strong>
                    <div style="color:#666;font-size:0.95rem;">${new Date(o.orderDate).toLocaleString()}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:bold;color:#333;">₹${(o.total||o.subtotal).toFixed(2)}</div>
                    <div style="font-size:0.9rem;color:${o.status==='Confirmed'?'#28a745':(o.status==='Pending Payment'?'#ff9800':'#999')};">${o.status}</div>
                </div>
            </div>
            <div style="margin-top:8px;color:#444;">Items: ${o.items ? o.items.map(i=>i.name).join(', ') : '—'}</div>
            <div style="margin-top:8px;display:flex;gap:8px;justify-content:flex-end;">
                ${o.status === 'Pending Payment' ? `<button onclick="markOrderConfirmed('${o.id}')" style="padding:6px 10px;background:#28a745;color:white;border:none;border-radius:4px;">Mark Confirmed</button>` : ''}
                <button onclick="downloadOrderReceipt('${o.id}')" style="padding:6px 10px;background:#667eea;color:white;border:none;border-radius:4px;">Download</button>
            </div>
        </div>
    `).join('');
}

function markOrderConfirmed(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return alert('Order not found');
    order.status = 'Confirmed';
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({ status: 'Confirmed', timestamp: new Date().toISOString(), note: 'Marked confirmed by seller' });
    saveData();
    renderSellerOrders();
    alert('Order marked as confirmed');
}

function placeOrder() {
    const address = document.getElementById('deliveryAddress').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    if (!address) {
        alert('Please enter delivery address');
        return;
    }

    const orderDate = new Date();
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;

    const order = {
        id: Date.now().toString(),
        user: currentUser.email,
        customerEmail: currentUser.email,
        userName: currentUser.name,
        userPhone: currentUser.phone,
        items: [...cart],
        subtotal: subtotal,
        total: total,
        address: address,
        paymentMethod: paymentMethod,
        orderDate: orderDate.toISOString(),
        expectedDeliveryDate: expectedDeliveryDate.toISOString(),
        status: 'Confirmed',
        statusHistory: [
            {
                status: 'Order Placed',
                timestamp: orderDate.toISOString(),
                note: 'Order successfully placed'
            }
        ]
    };

    orders.push(order);
    
    let customer = customers.find(c => c.email === currentUser.email);
    if (!customer) {
        customer = {
            id: Date.now().toString(),
            name: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phone,
            address: currentUser.address,
            notes: 'Auto-added from order',
            addedBy: 'system',
            addedDate: new Date().toISOString(),
            totalOrders: 1,
            lastOrderDate: orderDate.toISOString()
        };
        customers.push(customer);
    } else {
        customer.totalOrders = (customer.totalOrders || 0) + 1;
        customer.lastOrderDate = orderDate.toISOString();
    }

    const message = `✅ Order #${order.id} Confirmed!\n\n📦 Details:\n₹${order.total} | ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}\n\nDelivery: ${expectedDeliveryDate.toLocaleDateString()}\n\nThank you!`;
    alert(message);

    cart = [];
    saveData();
    updateCartCount();
    closeCheckout();
}

// ============================================================================
// VOICE, CHATBOT & BARCODE SCANNER
// ============================================================================

function initializeChatbot() {
    window.chatbotActive = false;
}

function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    if (chatbot) {
        window.chatbotActive = !window.chatbotActive;
        chatbot.style.display = window.chatbotActive ? 'block' : 'none';
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if (!input || !input.value) return;

    const messages = document.getElementById('chatMessages');
    if (!messages) return;

    const userMsg = document.createElement('div');
    userMsg.textContent = 'You: ' + input.value;
    userMsg.style.cssText = 'padding:8px;background:#e3f2fd;border-radius:4px;margin:4px 0;';
    messages.appendChild(userMsg);

    const botMsg = document.createElement('div');
    botMsg.textContent = 'Bot: Thank you for your message. How can I help?';
    botMsg.style.cssText = 'padding:8px;background:#f5f5f5;border-radius:4px;margin:4px 0;';
    messages.appendChild(botMsg);

    messages.scrollTop = messages.scrollHeight;
    input.value = '';
}

function toggleVoiceAssistant() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Speech recognition not supported in this browser');
        return;
    }
    
    const recognition = new webkitSpeechRecognition();
    recognition.onstart = () => alert('Listening...');
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        processVoiceCommand(transcript);
    };
    recognition.onerror = (event) => console.error('Speech error:', event.error);
    recognition.start();
}

function processVoiceCommand(command) {
    command = command.toLowerCase();
    if (command.includes('buy') || command.includes('shop')) selectRole('buyer');
    else if (command.includes('sell')) selectRole('seller');
    else if (command.includes('rent')) selectRole('renter');
    else if (command.includes('cart')) viewCart();
    else if (command.includes('logout')) logout();
    else alert('Command not recognized');
}

function openBarcodeScanner() {
    const modal = document.getElementById('scannerModal');
    if (modal) {
        modal.style.display = 'block';
        startCamera();
    }
}

function closeScannerModal() {
    const modal = document.getElementById('scannerModal');
    if (modal) modal.style.display = 'none';
    stopCamera();
}

function startCamera() {
    const video = document.getElementById('cameraVideo');
    if (!video || !('mediaDevices' in navigator)) {
        alert('Camera not available');
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => alert('Camera access denied: ' + err.message));
}

function stopCamera() {
    const video = document.getElementById('cameraVideo');
    if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(t => t.stop());
        video.srcObject = null;
    }
}

function captureBarcode() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
            stopCamera();
            closeScannerModal();
            searchProductByBarcode(code.data);
            return;
        } else {
            alert('No barcode detected. Try again.');
        }
    } catch (err) {
        console.error('Error scanning barcode:', err);
        alert('Error scanning barcode');
    }
}

function uploadBarcodeImage() {
    const input = document.getElementById('barcodeImageInput');
    if (input) input.click();
}

function processBarcodeImage(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
                closeScannerModal();
                searchProductByBarcode(code.data);
            } else {
                alert('No barcode found in image');
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function searchProductByBarcode(barcodeId) {
    const product = products.find(p => p.barcodeId === barcodeId);
    if (product) {
        showProductDetail(product.id);
    } else {
        alert('Product not found with barcode: ' + barcodeId);
    }
}

// ============================================================================
// LANGUAGE & INTERNATIONALIZATION
// ============================================================================

function changeLanguage() {
    const language = document.getElementById('languageSelector').value;
    localStorage.setItem('selectedLanguage', language);
    updatePageTranslations(language);
}

function updatePageTranslations(language = 'en') {
    const dict = (window.translations || typeof translations !== 'undefined' && translations) || {};
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (dict[language] && dict[language][key]) {
            el.textContent = dict[language][key];
        } else if (dict['en'] && dict['en'][key]) {
            el.textContent = dict['en'][key];
        }
    });

    const placeholders = document.querySelectorAll('[data-translate-placeholder]');
    placeholders.forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (dict[language] && dict[language][key]) {
            el.placeholder = dict[language][key];
        } else if (dict['en'] && dict['en'][key]) {
            el.placeholder = dict['en'][key];
        }
    });
}

// Observe DOM changes and translate newly added elements automatically
function translateElement(el, language, dict) {
    if (!el) return;
    const key = el.getAttribute && el.getAttribute('data-translate');
    if (key) {
        if (dict[language] && dict[language][key]) el.textContent = dict[language][key];
        else if (dict['en'] && dict['en'][key]) el.textContent = dict['en'][key];
    }
    const pkey = el.getAttribute && el.getAttribute('data-translate-placeholder');
    if (pkey) {
        if (dict[language] && dict[language][pkey]) el.placeholder = dict[language][pkey];
        else if (dict['en'] && dict['en'][pkey]) el.placeholder = dict['en'][pkey];
    }
}

function observeTranslations() {
    const dict = (window.translations || typeof translations !== 'undefined' && translations) || {};
    const language = localStorage.getItem('selectedLanguage') || 'en';

    // Translate existing nodes once more to be safe
    updatePageTranslations(language);

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.addedNodes && m.addedNodes.length) {
                m.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return; // element
                    // translate node itself
                    translateElement(node, language, dict);
                    // translate children with attributes
                    node.querySelectorAll && node.querySelectorAll('[data-translate],[data-translate-placeholder]').forEach(child => {
                        translateElement(child, language, dict);
                    });
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    // store observer for possible future disconnect
    window.__translationObserver = observer;
}

function translate(key) {
    const language = localStorage.getItem('selectedLanguage') || 'en';
    const dict = (window.translations || typeof translations !== 'undefined' && translations) || {};
    return (dict[language] && dict[language][key]) || (dict['en'] && dict['en'][key]) || key;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getPlaceholderImage() {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="140"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="14">No Image</text></svg>';
}

// ============================================================================
// PAGE INITIALIZATION
// ============================================================================

const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => updatePageTranslations(savedLanguage));
} else {
    updatePageTranslations(savedLanguage);
}

// Set language selector to saved language (if present in DOM)
try {
    const langSel = document.getElementById('languageSelector');
    if (langSel) langSel.value = savedLanguage;
} catch (e) {
    console.warn('Language selector not ready yet');
}

// Ensure the translation functions are the ones from this file (override any from translations.js)
window.changeLanguage = changeLanguage;
window.updatePageTranslations = updatePageTranslations;
window.translate = translate;

// Attach a reliable event listener to the language selector (removes inline/onchange collisions)
try {
    const langSel = document.getElementById('languageSelector');
    if (langSel) {
        // remove inline attribute if present to avoid duplicate calls
        langSel.removeAttribute('onchange');
        langSel.value = savedLanguage;
        langSel.addEventListener('change', changeLanguage);
    }
} catch (e) {
    console.warn('Unable to attach language selector handler', e);
}

function goHome() {
    currentRole = null;
    cart = [];
    // small click animation for logo
    const logo = document.querySelector('#navbar h1');
    if (logo) {
        logo.classList.add('logo-pulse');
        setTimeout(() => logo.classList.remove('logo-pulse'), 450);
    }
    showRoleSelection();
}


function loadUpiPaymentSection() {
    // Get seller's UPI details from the current cart (from seller who listed the product)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const sellerUpiDetails = getSellerUpiFromCart();
    
    const amount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('checkoutAmount').textContent = amount.toFixed(2);
    document.getElementById('paymentAmount').value = amount.toFixed(2);
    
    if (sellerUpiDetails && sellerUpiDetails.upiId) {
        // Show seller QR code section
        document.getElementById('sellerQrSection').style.display = 'block';
        document.getElementById('buyerUpiSection').style.display = 'none';
        document.getElementById('sellerUpiDisplay').textContent = sellerUpiDetails.upiId;
        
        // Generate QR code for seller's UPI
        const qrContainer = document.getElementById('sellerUpiQrCode');
        qrContainer.innerHTML = '';
        
        const upiString = `upi://pay?pa=${sellerUpiDetails.upiId}&pn=${encodeURIComponent(sellerUpiDetails.name || 'Seller')}&am=${amount}&tn=EcoMarket Payment`;
        
        try {
            new QRCode(qrContainer, {
                text: upiString,
                width: 180,
                height: 180,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (e) {
            qrContainer.innerHTML = '<small style="color:#999;">Error generating QR code</small>';
        }
    } else {
        // Show buyer UPI input section for payment request
        document.getElementById('sellerQrSection').style.display = 'none';
        document.getElementById('buyerUpiSection').style.display = 'block';
    }
}

function getSellerUpiFromCart() {
    // Get the first product seller's UPI from cart
    if (cart.length === 0) return null;
    
    const firstProduct = cart[0];
    const product = products.find(p => p.id === firstProduct.id);
    
    if (!product) return null;
    
    // Get seller's details from users database
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // product may store seller email under different keys depending on earlier code versions
    const sellerEmail = product.sellerEmail || product.seller || product.seller_email || product.sellerId || '';
    const seller = users.find(u => u.email === sellerEmail);
    
    if (seller && seller.paymentDetails && seller.paymentDetails.upi) {
        return seller.paymentDetails.upi;
    }
    
    return null;
}

function sendPaymentToSellerUpi() {
    const sellerUpi = document.getElementById('sellerUpiDisplay').textContent;
    const amount = document.getElementById('checkoutAmount').textContent;
    
    if (!sellerUpi) {
        alert('Seller UPI not available');
        return;
    }

    // Create pending order record
    const orderId = 'upi-' + Date.now().toString();
    const order = {
        id: orderId,
        user: currentUser.email,
        userName: currentUser.name,
        items: [...cart],
        subtotal: parseFloat(amount),
        total: parseFloat(amount),
        address: document.getElementById('deliveryAddress').value || '',
        paymentMethod: 'upi',
        sellerUpi: sellerUpi,
        sellerEmail: getSellerEmailFromCart(),
        orderDate: new Date().toISOString(),
        status: 'Pending Payment',
        metadata: { initiatedVia: 'buyer-uppi-flow' }
    };

    orders.push(order);
    saveData();

    // Store current pending order id so modal buttons can access
    window.currentPendingOrderId = orderId;
    document.getElementById('pendingOrderId').textContent = orderId;
    document.getElementById('pendingToUpi').textContent = sellerUpi;
    document.getElementById('pendingAmount').textContent = parseFloat(amount).toFixed(2);
    document.getElementById('paymentConfirmationModal').style.display = 'block';
}

function downloadSellerUpiQr() {
    const canvas = document.querySelector('#sellerUpiQrCode canvas');
    if (!canvas) {
        alert('QR code not ready. Please wait a moment.');
        return;
    }
    
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'seller-upi-qr.png';
    link.click();
}

function sendUpiPaymentRequest() {
    const buyerUpi = document.getElementById('buyerUpiId').value;
    const sellerUpi = document.getElementById('sellerUpiIdManual').value;
    const amount = document.getElementById('paymentAmount').value;
    
    if (!buyerUpi || !sellerUpi || !amount) {
        alert('Please fill all UPI details');
        return;
    }
    
    if (parseFloat(amount) <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    // Create UPI string to send payment request from buyer to seller
    const upiString = `upi://pay?pa=${sellerUpi}&pn=${encodeURIComponent('Payment Request')}&am=${amount}&tn=Payment Request from ${currentUser.name}&tr=ECO${Date.now()}`;
    
    // Create pending order record for the payment request
    const orderId = 'upi-' + Date.now().toString();
    const order = {
        id: orderId,
        user: currentUser.email,
        userName: currentUser.name,
        items: [...cart],
        subtotal: parseFloat(amount),
        total: parseFloat(amount),
        address: document.getElementById('deliveryAddress').value || '',
        paymentMethod: 'upi_request',
        sellerUpi: sellerUpi,
        buyerUpi: buyerUpi,
        sellerEmail: getSellerEmailFromCart() || '',
        orderDate: new Date().toISOString(),
        status: 'Pending Payment',
        metadata: { initiatedVia: 'buyer-request-flow' }
    };

    orders.push(order);
    saveData();

    // Store pending id and open modal so user can open UPI app
    window.currentPendingOrderId = orderId;
    document.getElementById('pendingOrderId').textContent = orderId;
    document.getElementById('pendingToUpi').textContent = sellerUpi;
    document.getElementById('pendingAmount').textContent = parseFloat(amount).toFixed(2);
    document.getElementById('paymentConfirmationModal').style.display = 'block';

    // Also prepare upiString in case user taps 'Open UPI App'
    window._lastUpiString = upiString;
}

function getSellerEmailFromCart() {
    if (!cart || cart.length === 0) return '';
    const firstProduct = products.find(p => p.id === cart[0].id);
    return (firstProduct && firstProduct.sellerEmail) ? firstProduct.sellerEmail : '';
}

function openUpiForPendingOrder() {
    const orderId = window.currentPendingOrderId;
    const order = orders.find(o => o.id === orderId);
    if (!order) return alert('Order not found');

    const toUpi = order.sellerUpi || order.buyerUpi || '';
    const amount = (order.total || order.subtotal || 0).toFixed(2);
    const upiString = window._lastUpiString || `upi://pay?pa=${toUpi}&pn=${encodeURIComponent(order.sellerEmail || 'Seller')}&am=${amount}&tn=EcoMarket Payment&tr=${order.id}`;

    window.location.href = upiString;
}

function closePaymentModal() {
    document.getElementById('paymentConfirmationModal').style.display = 'none';
}

function markPendingOrderPaid() {
    const orderId = window.currentPendingOrderId;
    const order = orders.find(o => o.id === orderId);
    if (!order) return alert('Order not found');

    order.status = 'Confirmed';
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({ status: 'Confirmed', timestamp: new Date().toISOString(), note: 'Marked paid by buyer' });
    saveData();

    // Clear cart and close modal
    cart = [];
    saveData();
    updateCartCount();
    document.getElementById('paymentConfirmationModal').style.display = 'none';
    alert('✅ Payment marked as received. Order confirmed!');
}

function cancelPendingOrder() {
    const orderId = window.currentPendingOrderId;
    const order = orders.find(o => o.id === orderId);
    if (!order) return alert('Order not found');

    order.status = 'Cancelled';
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({ status: 'Cancelled', timestamp: new Date().toISOString(), note: 'Cancelled by buyer' });
    saveData();
    document.getElementById('paymentConfirmationModal').style.display = 'none';
    alert('Order cancelled');
}

