// Global State
let cart = [];
let isChefMode = false;
let menuData = {
    appetizers: [
        { id: 1, name: "Olivye salati", description: "An'anaviy rus salati kartoshka, sabzi va mayonez bilan", price: 25000, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop" },
        { id: 2, name: "Grecha salati", description: "Yangi sabzavotlar va zaytun moyi bilan", price: 20000, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop" },
        { id: 3, name: "Sezar salati", description: "Tovuq go'shti, parmesan va maxsus sous bilan", price: 30000, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h:200&fit:crop" }
    ],
    mains: [
        { id: 4, name: "Osh", description: "O'zbek milliy taomi qo'y go'shti bilan", price: 35000, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h:200&fit:crop" },
        { id: 5, name: "Manti", description: "Bug'da pishirilgan manti qiyma bilan", price: 28000, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&h:200&fit:crop" },
        { id: 6, name: "Lag'mon", description: "Qo'l tortilgan pasta go'sht va sabzavotlar bilan", price: 32000, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h:200&fit:crop" },
        { id: 7, name: "Bifshteks", description: "Yumshoq mol go'shti kartoshka garniri bilan", price: 45000, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h:200&fit:crop" }
    ],
    desserts: [
        { id: 8, name: "Tiramisu", description: "Italyan shirinlik kofe ta'mi bilan", price: 18000, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h:200&fit:crop" },
        { id: 9, name: "Cheesecake", description: "Yumshoq tvorog shirinlik mevali", price: 22000, image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=300&h:200&fit:crop" },
        { id: 10, name: "Muzqaymoq", description: "Turli xil ta'mli muzqaymoq", price: 12000, image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=300&h:200&fit:crop" }
    ],
    drinks: [
        { id: 11, name: "Ko'k choy", description: "Issiq ko'k choy shakar bilan", price: 5000, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h:200&fit:crop" },
        { id: 12, name: "Fresh sok", description: "Yangi siqilgan meva soki", price: 15000, image: "https://images.unsplash.com/photo-1553395862-e8b3c61b2e7d?w=300&h:200&fit:crop" },
        { id: 13, name: "Kofe", description: "Arabika don kofe sut bilan", price: 8000, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h:200&fit:crop" },
        { id: 14, name: "Limonad", description: "Uyda tayyorlangan limon sharbati", price: 10000, image: "https://images.unsplash.com/photo-1520342868574-5fa3804e551c?w=300&h:200&fit:crop" }
    ]
};

// **Telegram Bot Configuration**
const BOT_TOKEN = '8144996282:AAESAyXh6BOg1QrSPUDyaMMgGDZJ2ZvDPQQ'; // Sizning bot tokeningiz
const CHAT_ID = '6519831069'; // Sizning chat ID'ngiz
const CHEF_PASSWORD = '12345'; // Oshpaz paroli

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Splash Screen Logic
    const splashScreen = document.getElementById('splashScreen');
    if(splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('hidden');
        }, 3000); // Splash screen will be visible for 2.5 seconds
    }
    
    loadMenuData();
    initializeApp();
});

// Function to add typewriter effect to the header
function typeWriterEffect() {
    const h1Element = document.querySelector('.restaurant-info h1');
    if (!h1Element) return; // Agar element topilmasa, funksiyadan chiqish

    const textToType = "Bella Vista Restorani";
    h1Element.textContent = ''; // Mavjud matnni tozalash
    h1Element.classList.add('typing-effect'); // Kursor uchun klass qo'shish

    let i = 0;
    function type() {
        if (i < textToType.length) {
            h1Element.textContent += textToType.charAt(i);
            i++;
            setTimeout(type, 150); // Yozish tezligi (ms)
        } else {
            // Yozib bo'lgandan so'ng kursorni olib tashlash
            setTimeout(() => {
                h1Element.classList.remove('typing-effect');
            }, 1000);
        }
    }
    type();
}

function initializeApp() {
    typeWriterEffect(); // Sarlavha animatsiyasini ishga tushirish
    setupEventListeners();
    renderMenuItems('appetizers');
    updateCartDisplay();
    goToStep('step2'); // Start at menu step
}

function loadMenuData() {
    try {
        const storedMenuData = localStorage.getItem('menuData');
        if (storedMenuData) {
            menuData = JSON.parse(storedMenuData);
        }
    } catch (e) {
        console.error('Error loading menu data from local storage:', e);
    }
}

function saveMenuData() {
    try {
        localStorage.setItem('menuData', JSON.stringify(menuData));
    } catch (e) {
        console.error('Error saving menu data to local storage:', e);
    }
}

function setupEventListeners() {
    // Step 2: Proceed from menu to order details
    document.getElementById('proceedToDetails').addEventListener('click', () => goToStep('step3'));

    // Step 3: Confirm order
    document.getElementById('confirmOrderBtn').addEventListener('click', confirmOrder);

    // Menu categories (desktop)
    document.querySelectorAll('.menu-categories .category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.menu-categories .category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('menuSearchInput').value = '';
            renderMenuItems(btn.dataset.category);
        });
    });

    // Menu categories (mobile dropdown)
    document.querySelectorAll('.category-dropdown .category-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            closeMobileMenu();
            
            document.querySelectorAll('.menu-categories .category-btn').forEach(b => b.classList.remove('active'));
            const desktopBtn = document.querySelector(`.menu-categories .category-btn[data-category="${category}"]`);
            if (desktopBtn) desktopBtn.classList.add('active');

            document.getElementById('menuSearchInput').value = '';
            renderMenuItems(category);
            goToStep('step2');
            document.getElementById('menuItems').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Search and Chef mode toggle
    const menuSearchInput = document.getElementById('menuSearchInput');
    menuSearchInput.addEventListener('input', (event) => {
        const query = event.target.value.trim();
        const chefPanel = document.getElementById('chefPanel');
        const activeCategory = document.querySelector('.menu-categories .category-btn.active')?.dataset.category || 'appetizers';

        if (query === CHEF_PASSWORD) {
            isChefMode = true;
            chefPanel.classList.remove('hidden');
            document.getElementById('addDishForm').classList.remove('hidden');
            document.getElementById('editDishForm').classList.add('hidden');
            alert('Oshpaz rejimi yoqildi!');
            menuSearchInput.value = '';
            renderMenuItems(activeCategory);
        } else {
            if (isChefMode && query !== '') {
                isChefMode = false;
                chefPanel.classList.add('hidden');
                renderMenuItems(activeCategory);
            }
            renderMenuItems(activeCategory, query.toLowerCase());
        }
    });

    // Chef panel actions
    document.getElementById('addDishBtn').addEventListener('click', addNewDish);
    document.getElementById('saveEditedDishBtn').addEventListener('click', saveEditedDish);
    document.getElementById('cancelEditDishBtn').addEventListener('click', () => {
        document.getElementById('editDishForm').classList.add('hidden');
        document.getElementById('addDishForm').classList.remove('hidden');
    });

    // Form validation for order details form (Step 3)
    document.getElementById('orderDetailsForm').addEventListener('input', validateOrderDetailsForm);

    // Hamburger menu functionality
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Mobile navigation links
    document.querySelectorAll('.main-nav a.nav-link').forEach(link => {
        if (!link.classList.contains('category-link') && !link.parentElement.classList.contains('category-dropdown-toggle')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                goToStep(targetId);
                closeMobileMenu();
            });
        }
    });
    
    // Mobile category dropdown toggle
    const categoryDropdownToggle = document.querySelector('.category-dropdown-toggle');
    if (categoryDropdownToggle) {
        categoryDropdownToggle.addEventListener('click', () => {
            const dropdown = document.querySelector('.category-dropdown');
            dropdown.classList.toggle('active');
            const icon = categoryDropdownToggle.querySelector('i');
            icon.classList.toggle('fa-caret-down');
            icon.classList.toggle('fa-caret-up');
        });
    }
}

function closeMobileMenu() {
    const mainNav = document.getElementById('mainNav');
    const menuToggle = document.getElementById('menuToggle');
    if (mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        
        // Close category dropdown as well
        const dropdown = document.querySelector('.category-dropdown');
        const dropdownIcon = document.querySelector('.category-dropdown-toggle i');
        if (dropdown && dropdown.classList.contains('active')) {
            dropdown.classList.remove('active');
            dropdownIcon.classList.remove('fa-caret-up');
            dropdownIcon.classList.add('fa-caret-down');
        }
    }
}

function goToStep(stepId) {
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });

    const targetSection = document.getElementById(stepId);
    if (targetSection) {
        targetSection.classList.add('active');
        if (stepId === 'step3') {
            updateOrderSummary();
        }
        if (stepId === 'cartItemsSection') {
             targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function renderMenuItems(category, searchQuery = '') {
    const menuItemsContainer = document.getElementById('menuItems');
    let items = menuData[category] || [];

    if (searchQuery) {
        items = Object.values(menuData).flat().filter(item =>
            item.name.toLowerCase().includes(searchQuery) ||
            item.description.toLowerCase().includes(searchQuery)
        );
    }

    if (items.length === 0) {
        menuItemsContainer.innerHTML = `<p class="text-center">${searchQuery ? 'Qidiruvingiz bo\'yicha hech narsa topilmadi.' : 'Bu kategoriyada hozircha taomlar mavjud emas.'}</p>`;
        return;
    }

    menuItemsContainer.innerHTML = items.map(item => `
        <div class="menu-item">
            <img src="${item.image || 'placeholder.jpg'}" alt="${item.name}" loading="lazy">
            <div class="menu-item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="menu-item-bottom">
                    <span class="menu-item-price">${item.price.toLocaleString()} so'm</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Savatga</button>
                </div>
                ${isChefMode ? `
                <div class="btn-group">
                    <button class="btn btn-sm btn-secondary" onclick="editDish(${item.id})">Tahrir</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDish(${item.id})">O'chirish</button>
                </div>` : ''}
            </div>
        </div>
    `).join('');
}

function addToCart(itemId) {
    const item = Object.values(menuData).flat().find(i => i.id === itemId);
    if (!item) return;

    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalAmountElement = document.getElementById('totalAmount');
    const proceedBtn = document.getElementById('proceedToDetails');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="emoji">🍽️</div>
                <p>Savat bo'sh</p>
                <p class="text-sm">Menyudan taomlarni tanlang</p>
            </div>`;
        totalAmountElement.textContent = '0';
        proceedBtn.disabled = true;
    } else {
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h5>${item.name}</h5>
                    <div class="cart-item-price">${item.price.toLocaleString()} so'm</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">×</button>
            </div>
        `).join('');
        totalAmountElement.textContent = totalAmount.toLocaleString();
        proceedBtn.disabled = false;
    }
    updateOrderSummary();
}

function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(itemId);
    } else {
        const item = cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            updateCartDisplay();
        }
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
}

function addNewDish() {
    const name = document.getElementById('dishName').value.trim();
    const description = document.getElementById('dishDescription').value.trim();
    const price = parseInt(document.getElementById('dishPrice').value);
    const category = document.getElementById('dishCategory').value;
    const image = document.getElementById('dishImage').value.trim();

    if (!name || !description || isNaN(price) || price <= 0) {
        alert('Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring!');
        return;
    }

    const newId = Math.max(0, ...Object.values(menuData).flat().map(item => item.id)) + 1;
    const newDish = { id: newId, name, description, price, image };

    if (!menuData[category]) menuData[category] = [];
    menuData[category].push(newDish);
    
    saveMenuData();
    document.getElementById('addDishForm').querySelector('input, textarea').form.reset();
    renderMenuItems(category);
    alert('Yangi taom muvaffaqiyatli qo\'shildi!');
}

function editDish(itemId) {
    let dishToEdit = null;
    let dishCategory = '';
    for (const cat in menuData) {
        const found = menuData[cat].find(i => i.id === itemId);
        if (found) {
            dishToEdit = found;
            dishCategory = cat;
            break;
        }
    }

    if (!dishToEdit) return;

    document.getElementById('addDishForm').classList.add('hidden');
    document.getElementById('editDishForm').classList.remove('hidden');

    document.getElementById('editDishId').value = dishToEdit.id;
    document.getElementById('editDishName').value = dishToEdit.name;
    document.getElementById('editDishDescription').value = dishToEdit.description;
    document.getElementById('editDishPrice').value = dishToEdit.price;
    document.getElementById('editDishCategory').value = dishCategory;
    document.getElementById('editDishImage').value = dishToEdit.image;
    document.getElementById('editDishForm').dataset.originalCategory = dishCategory;
}

function saveEditedDish() {
    const id = parseInt(document.getElementById('editDishId').value);
    const name = document.getElementById('editDishName').value.trim();
    const description = document.getElementById('editDishDescription').value.trim();
    const price = parseInt(document.getElementById('editDishPrice').value);
    const newCategory = document.getElementById('editDishCategory').value;
    const image = document.getElementById('editDishImage').value.trim();
    const originalCategory = document.getElementById('editDishForm').dataset.originalCategory;

    if (!name || !description || isNaN(price) || price <= 0) {
        alert('Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring!');
        return;
    }

    // Remove from original category
    if (originalCategory && menuData[originalCategory]) {
        menuData[originalCategory] = menuData[originalCategory].filter(item => item.id !== id);
    }

    // Add to new category
    const updatedDish = { id, name, description, price, image };
    if (!menuData[newCategory]) menuData[newCategory] = [];
    menuData[newCategory].push(updatedDish);

    saveMenuData();

    document.getElementById('editDishForm').classList.add('hidden');
    document.getElementById('addDishForm').classList.remove('hidden');

    const activeCategory = document.querySelector('.menu-categories .category-btn.active')?.dataset.category || 'appetizers';
    renderMenuItems(activeCategory);
    alert('Taom muvaffaqiyatli tahrirlandi!');
}

function deleteDish(itemId) {
    if (!confirm('Haqiqatan ham bu taomni oʻchirmoqchimisiz?')) return;

    let dishRemoved = false;
    for (const category in menuData) {
        const initialLength = menuData[category].length;
        menuData[category] = menuData[category].filter(item => item.id !== itemId);
        if (menuData[category].length < initialLength) {
            dishRemoved = true;
            break;
        }
    }

    if (dishRemoved) {
        saveMenuData();
        const activeCategory = document.querySelector('.menu-categories .category-btn.active')?.dataset.category || 'appetizers';
        renderMenuItems(activeCategory);
        alert('Taom muvaffaqiyatli oʻchirildi!');
    }
}

function validateOrderDetailsForm() {
    const name = document.getElementById('customerNameOrder').value.trim();
    const phoneInput = document.getElementById('customerPhone');
    const tableName = document.getElementById('tableNameOrder').value.trim();
    const confirmOrderBtn = document.getElementById('confirmOrderBtn');

    const isPhoneValid = phoneInput.checkValidity(); // Check pattern
    confirmOrderBtn.disabled = !(name && tableName && isPhoneValid && cart.length > 0);
}

function updateOrderSummary() {
    const summaryTableNum = document.getElementById('summaryTableNum');
    const summaryTotalOrder = document.getElementById('summaryTotalOrder');
    const summaryOrderItems = document.getElementById('summaryOrderItems');
    
    summaryTableNum.textContent = document.getElementById('tableNameOrder').value || 'Kiritilmagan';
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    summaryTotalOrder.textContent = total.toLocaleString();

    summaryOrderItems.innerHTML = cart.map(item => `
        <div>${item.name} x ${item.quantity} &mdash; ${(item.price * item.quantity).toLocaleString()} so'm</div>
    `).join('');
    
    validateOrderDetailsForm();
}

async function confirmOrder() {
    const form = document.getElementById('orderDetailsForm');
    if (!form.checkValidity() || cart.length === 0) {
        alert('Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring va savatga taom qo\'shing.');
        form.reportValidity();
        return;
    }

    const orderData = {
        tableNumber: document.getElementById('tableNameOrder').value,
        customerName: document.getElementById('customerNameOrder').value,
        customerPhone: document.getElementById('customerPhone').value,
        specialRequests: document.getElementById('specialRequestsOrder').value,
        order: cart,
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date()
    };

    let telegramMessage = `🔔 *Yangi Buyurtma!*\n\n`;
    telegramMessage += `*Mijoz:* ${orderData.customerName}\n`;
    telegramMessage += `*Stol Raqami:* ${orderData.tableNumber}\n`;
    telegramMessage += `*Telefon:* \`${orderData.customerPhone}\`\n`;
    if (orderData.specialRequests) {
        telegramMessage += `*Maxsus so'rovlar:* ${orderData.specialRequests}\n`;
    }
    telegramMessage += `\n*Buyurtma Tafsilotlari:*\n`;
    orderData.order.forEach(item => {
        telegramMessage += `- ${item.name} x${item.quantity} (${(item.price * item.quantity).toLocaleString()} so'm)\n`;
    });
    telegramMessage += `\n*Jami summa:* ${orderData.totalAmount.toLocaleString()} so'm\n`;
    telegramMessage += `*Vaqt:* ${orderData.timestamp.toLocaleString('uz-UZ')}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: telegramMessage,
                parse_mode: 'Markdown'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.description);
        }
        
        alert(`Buyurtmangiz muvaffaqiyatli qabul qilindi! Jami summa: ${orderData.totalAmount.toLocaleString()} so'm.`);
        resetApplication();

    } catch (error) {
        console.error('Telegramga yuborishda xatolik:', error);
        alert(`Buyurtmani yuborishda xatolik yuz berdi. Iltimos, internet aloqasini tekshiring yoki administratorga murojaat qiling.\n\nXato: ${error.message}`);
    }
}

function resetApplication() {
    cart = [];
    isChefMode = false;
    document.getElementById('orderDetailsForm').reset();
    document.getElementById('menuSearchInput').value = '';
    document.getElementById('chefPanel').classList.add('hidden');
    closeMobileMenu();
    updateCartDisplay();
    goToStep('step2');
    renderMenuItems(document.querySelector('.menu-categories .category-btn.active')?.dataset.category || 'appetizers');
}

// Make functions globally accessible for onclick attributes
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.editDish = editDish;
window.deleteDish = deleteDish;