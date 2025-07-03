let currentStep = 1;
let selectedTable = null;
let cart = [];
let isChefMode = false;
let menuData = {
    appetizers: [
        { id: 1, name: "Olivye salati", description: "An'anaviy rus salati kartoshka, sabzi va mayonez bilan", price: 25000, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop" },
        { id: 2, name: "Grecha salati", description: "Yangi sabzavotlar va zaytun moyi bilan", price: 20000, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop" },
        { id: 3, name: "Sezar salati", description: "Tovuq go'shti, parmesan va maxsus sous bilan", price: 30000, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h:200&fit=crop" }
    ],
    mains: [
        { id: 4, name: "Plov", description: "O'zbek milliy taomi qo'y go'shti bilan", price: 35000, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h:200&fit:crop" },
        { id: 5, name: "Manti", description: "Bug'da pishirilgan manti qiyma bilan", price: 28000, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&h:200&fit:crop" },
        { id: 6, name: "Lag'mon", description: "Qo'l tortilgan pasta go'sht va sabzavotlar bilan", price: 32000, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h:200&fit:crop" },
        { id: 7, name: "Bifshteks", description: "Yumshoq mol go'shti kartoshka garniri bilan", price: 45000, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h:200&fit:crop" }
    ],
    desserts: [
        { id: 8, name: "Tiramisu", description: "Italyan shirinlik kofe ta'mi bilan", price: 18000, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h:200&fit:crop" },
        { id: 9, name: "Cheesecake", description: "Yumshoq tvorog shirinlik mevali", price: 22000, image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=300&h:200&fit:crop" },
        { id: 10, name: "Muz qaymoq", description: "Turli xil ta'mli muz qaymoq", price: 12000, image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=300&h:200&fit:crop" }
    ],
    drinks: [
        { id: 11, name: "Ko'k choy", description: "Issiq ko'k choy shakar bilan", price: 5000, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h:200&fit:crop" },
        { id: 12, name: "Fresh sok", description: "Yangi siqilgan meva soki", price: 15000, image: "https://images.unsplash.com/photo-1553395862-e8b3c61b2e7d?w=300&h:200&fit:crop" },
        { id: 13, name: "Kofe", description: "Arabika don kofe sut bilan", price: 8000, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h:200&fit:crop" },
        { id: 14, name: "Limonad", description: "Uyda tayyorlangan limon sharbati", price: 10000, image: "https://images.unsplash.com/photo-1520342868574-5fa3804e551c?w=300&h:200&fit:crop" }
    ]
};

// **Telegram Bot Configuration (Moved here for integration)**
const BOT_TOKEN = '8144996282:AAESAyXh6BOg1QrSPUDyaMMgGDZJ2ZvDPQQ';
const CHAT_ID = '6519831069';
const CHEF_PASSWORD = '12345'; // Define chef password

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadMenuData(); // Load menu data from local storage
    initializeApp();
});

function initializeApp() {
    updateVisitorsCount();
    setupEventListeners();
    renderMenuItems('appetizers'); // Render initial menu
    updateCartDisplay();

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reservationDate').min = today;
}

function loadMenuData() {
    try {
        const storedMenuData = localStorage.getItem('menuData');
        if (storedMenuData) {
            menuData = JSON.parse(storedMenuData);
            console.log('Menu data loaded from local storage.');
        } else {
            console.log('No menu data in local storage, using default.');
        }
    } catch (e) {
        console.error('Error loading menu data from local storage:', e);
        // Fallback to default menuData if parsing fails
    }
}

function saveMenuData() {
    try {
        localStorage.setItem('menuData', JSON.stringify(menuData));
        console.log('Menu data saved to local storage.');
    } catch (e) {
        console.error('Error saving menu data to local storage:', e);
    }
}

function updateVisitorsCount() {
    const visitorsCount = Math.floor(Math.random() * 150) + 50;
    document.getElementById('visitorsCount').textContent = visitorsCount;
}

function setupEventListeners() {
    // Table selection
    document.querySelectorAll('.table').forEach(table => {
        if (!table.classList.contains('unavailable')) {
            table.addEventListener('click', () => selectTable(table));
        }
    });

    // Step navigation
    document.getElementById('nextToMenu').addEventListener('click', () => goToStep(2));
    document.getElementById('proceedToDetails').addEventListener('click', () => goToStep(3));
    document.getElementById('proceedToPayment').addEventListener('click', validateAndProceedToPayment);
    document.getElementById('confirmOrder').addEventListener('click', confirmOrder);

    // Menu categories
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Clear search when changing category
            document.getElementById('menuSearchInput').value = '';
            renderMenuItems(btn.dataset.category);
        });
    });

    // Search and Chef mode toggle
    const menuSearchInput = document.getElementById('menuSearchInput');
    menuSearchInput.addEventListener('input', (event) => {
        const query = event.target.value.trim();
        const chefPanel = document.getElementById('chefPanel'); // Using chefPanel as the container for chef controls

        if (query === CHEF_PASSWORD) {
            isChefMode = true;
            chefPanel.classList.remove('hidden'); // Show chef panel
            document.getElementById('addDishForm').classList.remove('hidden'); // Show add dish form
            document.getElementById('editDishForm').classList.add('hidden'); // Hide edit dish form initially
            alert('Oshpaz rejimi yoqildi!');
            // Optionally clear the password from the input field
            menuSearchInput.value = '';
            // Re-render the current category to show edit/delete buttons
            const activeCategory = document.querySelector('.category-btn.active').dataset.category;
            renderMenuItems(activeCategory);
        } else {
            // If not chef password, perform search or hide chef controls
            if (isChefMode) {
                // If already in chef mode and password is removed, exit chef mode
                isChefMode = false;
                chefPanel.classList.add('hidden');
                document.getElementById('addDishForm').classList.add('hidden');
                document.getElementById('editDishForm').classList.add('hidden');
                const activeCategory = document.querySelector('.category-btn.active').dataset.category;
                renderMenuItems(activeCategory);
            }
            // Perform search if query is not empty or chef password
            const activeCategory = document.querySelector('.category-btn.active').dataset.category;
            renderMenuItems(activeCategory, query.toLowerCase());
        }
    });


    // Add new dish
    document.getElementById('addDishBtn').addEventListener('click', addNewDish);

    // Save edited dish
    document.getElementById('saveEditedDishBtn').addEventListener('click', saveEditedDish);
    document.getElementById('cancelEditDishBtn').addEventListener('click', () => {
        document.getElementById('editDishForm').classList.add('hidden');
        document.getElementById('addDishForm').classList.remove('hidden'); // Show add dish form again
    });

    // Form validation
    document.getElementById('reservationForm').addEventListener('input', validateReservationForm);
}

function selectTable(tableElement) {
    // Remove previous selection
    document.querySelectorAll('.table').forEach(t => t.classList.remove('selected'));

    // Select new table
    tableElement.classList.add('selected');
    selectedTable = {
        number: tableElement.dataset.table,
        seats: tableElement.dataset.seats
    };

    // Enable next button
    document.getElementById('nextToMenu').disabled = false;

    console.log('Tanlangan stol:', selectedTable);
}

function goToStep(step) {
    // Hide all step contents
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });

    // Show target step
    document.getElementById(`step${step}`).classList.add('active');

    // Update progress steps
    document.querySelectorAll('.step').forEach(stepEl => {
        stepEl.classList.remove('active', 'completed');
    });

    for (let i = 1; i < step; i++) {
        document.querySelector(`[data-step="${i}"]`).classList.add('completed');
    }
    document.querySelector(`[data-step="${step}"]`).classList.add('active');

    currentStep = step;

    // Update displays based on step
    if (step === 3) {
        updateReservationSummary();
    } else if (step === 4) {
        updateFinalSummary();
    }

    console.log('O\'tilgan qadam:', step);
}

function renderMenuItems(category, searchQuery = '') {
    const menuItemsContainer = document.getElementById('menuItems');
    let items = menuData[category];

    if (!items || items.length === 0) {
        menuItemsContainer.innerHTML = '<p class="text-center">Bu kategoriyada taomlar mavjud emas</p>';
        return;
    }

    // Apply search filter if a query is provided
    if (searchQuery) {
        items = items.filter(item =>
            item.name.toLowerCase().includes(searchQuery) ||
            item.description.toLowerCase().includes(searchQuery)
        );
    }

    if (items.length === 0) {
        menuItemsContainer.innerHTML = '<p class="text-center">Qidiruvingiz bo\'yicha hech narsa topilmadi.</p>';
        return;
    }

    menuItemsContainer.innerHTML = items.map(item => `
        <div class="menu-item">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="menu-item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="menu-item-price">${item.price.toLocaleString()} so'm</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                        Savatga qo'shish
                    </button>
                </div>
                ${isChefMode ? `
                <div style="margin-top: 10px; display: flex; gap: 10px;">
                    <button class="btn btn-sm btn-secondary" onclick="editDish(${item.id})">Tahrirlash</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDish(${item.id})">O'chirish</button>
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function addToCart(itemId) {
    // Find item in all categories
    let item = null;
    for (const category in menuData) {
        item = menuData[category].find(i => i.id === itemId);
        if (item) break;
    }

    if (!item) return;

    // Check if item already in cart
    const existingItem = cart.find(cartItem => cartItem.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCartDisplay();
    console.log('Savatga qo\'shildi:', item.name);
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalAmountElement = document.getElementById('totalAmount');
    const proceedBtn = document.getElementById('proceedToDetails');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="emoji">🍽️</div>
                <p>Hech narsa tanlanmagan</p>
                <p class="text-sm">Menyudan taomlarni tanlang</p>
            </div>
        `;
        totalAmountElement.textContent = '0';
        proceedBtn.disabled = true;
        return;
    }

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

function updateQuantity(itemId, newQuantity) {
    if (newQuantity === 0) {
        removeFromCart(itemId);
        return;
    }

    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        updateCartDisplay();
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    console.log('Savatdan o\'chirildi:', itemId);
}

function addNewDish() {
    if (!isChefMode) return;

    const name = document.getElementById('dishName').value.trim();
    const description = document.getElementById('dishDescription').value.trim();
    const price = parseInt(document.getElementById('dishPrice').value);
    const category = document.getElementById('dishCategory').value;
    const image = document.getElementById('dishImage').value.trim() || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h:200&fit:crop'; // Default image

    if (!name || !description || !price || isNaN(price)) {
        alert('Barcha maydonlarni to\'ldiring va narxni to\'g\'ri kiriting!');
        return;
    }

    // Get max ID across all categories to ensure unique ID
    let maxId = 0;
    for (const cat in menuData) {
        if (menuData[cat].length > 0) {
            const currentMaxId = Math.max(...menuData[cat].map(item => item.id));
            if (currentMaxId > maxId) {
                maxId = currentMaxId;
            }
        }
    }
    const newId = maxId + 1;

    const newDish = {
        id: newId,
        name,
        description,
        price,
        image
    };

    if (!menuData[category]) {
        menuData[category] = []; // Initialize array if category doesn't exist
    }
    menuData[category].push(newDish);
    saveMenuData(); // Save to local storage

    // Clear form
    document.getElementById('dishName').value = '';
    document.getElementById('dishDescription').value = '';
    document.getElementById('dishPrice').value = '';
    document.getElementById('dishImage').value = '';

    // Re-render if current category
    const activeCategory = document.querySelector('.category-btn.active').dataset.category;
    if (activeCategory === category) {
        renderMenuItems(category);
    }

    alert('Yangi taom muvaffaqiyatli qo\'shildi!');
    console.log('Yangi taom qo\'shildi:', newDish);
}

function editDish(itemId) {
    let dishToEdit = null;
    let dishCategory = '';
    for (const category in menuData) {
        dishToEdit = menuData[category].find(i => i.id === itemId);
        if (dishToEdit) {
            dishCategory = category;
            break;
        }
    }

    if (!dishToEdit) {
        alert('Taom topilmadi!');
        return;
    }

    // Hide add dish form, show edit dish form
    document.getElementById('addDishForm').classList.add('hidden');
    document.getElementById('editDishForm').classList.remove('hidden');

    // Populate edit form
    document.getElementById('editDishId').value = dishToEdit.id;
    document.getElementById('editDishName').value = dishToEdit.name;
    document.getElementById('editDishDescription').value = dishToEdit.description;
    document.getElementById('editDishPrice').value = dishToEdit.price;
    document.getElementById('editDishCategory').value = dishCategory;
    document.getElementById('editDishImage').value = dishToEdit.image;
    document.getElementById('editDishForm').dataset.originalCategory = dishCategory; // Store original category

    console.log('Tahrirlash uchun taom:', dishToEdit);
}

function saveEditedDish() {
    if (!isChefMode) return;

    const id = parseInt(document.getElementById('editDishId').value);
    const name = document.getElementById('editDishName').value.trim();
    const description = document.getElementById('editDishDescription').value.trim();
    const price = parseInt(document.getElementById('editDishPrice').value);
    const newCategory = document.getElementById('editDishCategory').value;
    const image = document.getElementById('editDishImage').value.trim();
    const originalCategory = document.getElementById('editDishForm').dataset.originalCategory;

    if (!name || !description || !price || isNaN(price)) {
        alert('Barcha maydonlarni to\'ldiring va narxni to\'g\'ri kiriting!');
        return;
    }

    // Find and update the dish
    let dishFound = false;
    // Remove from original category if category changed
    if (originalCategory !== newCategory) {
        menuData[originalCategory] = menuData[originalCategory].filter(item => item.id !== id);
    }

    if (!menuData[newCategory]) {
        menuData[newCategory] = []; // Initialize if new category doesn't exist
    }

    let dishIndex = menuData[newCategory].findIndex(item => item.id === id);

    if (dishIndex !== -1) {
        // Update existing dish in the same category
        menuData[newCategory][dishIndex] = { id, name, description, price, image };
        dishFound = true;
    } else {
        // Add to new category (if moved from another category)
        menuData[newCategory].push({ id, name, description, price, image });
        dishFound = true;
    }


    if (dishFound) {
        saveMenuData(); // Save to local storage

        // Clear and hide edit form
        document.getElementById('editDishForm').classList.add('hidden');
        document.getElementById('addDishForm').classList.remove('hidden'); // Show add dish form again
        document.getElementById('editDishId').value = '';
        document.getElementById('editDishName').value = '';
        document.getElementById('editDishDescription').value = '';
        document.getElementById('editDishPrice').value = '';
        document.getElementById('editDishImage').value = '';

        // Re-render menu items for both affected categories
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        renderMenuItems(activeCategory);
        if (originalCategory !== newCategory && originalCategory === activeCategory) {
            renderMenuItems(originalCategory); // Re-render original category if it was active
        }

        alert('Taom muvaffaqiyatli tahrirlandi!');
        console.log('Taom tahrirlandi:', { id, name, description, price, image });
    } else {
        alert('Taom topilmadi yoki tahrirlashda xatolik yuz berdi!');
    }
}


function deleteDish(itemId) {
    if (!isChefMode) return;

    if (!confirm('Haqiqatan ham bu taomni oʻchirmoqchimisiz?')) {
        return;
    }

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
        saveMenuData(); // Save to local storage
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        renderMenuItems(activeCategory); // Re-render current category
        alert('Taom muvaffaqiyatli oʻchirildi!');
        console.log('Taom oʻchirildi, ID:', itemId);
    } else {
        alert('Taom topilmadi yoki oʻchirishda xatolik yuz berdi!');
    }
}


function validateReservationForm() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const date = document.getElementById('reservationDate').value;
    const time = document.getElementById('reservationTime').value;
    const guests = document.getElementById('guestCount').value;

    const proceedBtn = document.getElementById('proceedToPayment');
    proceedBtn.disabled = !(name && phone && email && date && time && guests);
}

function validateAndProceedToPayment() {
    const form = document.getElementById('reservationForm');
    if (form.checkValidity()) {
        goToStep(4);
    } else {
        alert('Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring!');
        form.reportValidity(); // Show native browser validation messages
    }
}

function updateReservationSummary() {
    const selectedTableInfo = document.getElementById('selectedTableInfo');
    const summaryTotal = document.getElementById('summaryTotal');

    if (selectedTable) {
        selectedTableInfo.textContent = `${selectedTable.number}-stol (${selectedTable.seats} o'rin)`;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    summaryTotal.textContent = total.toLocaleString();
}

function updateFinalSummary() {
    const finalOrderSummary = document.getElementById('finalOrderSummary');
    const finalTotal = document.getElementById('finalTotal');

    const orderHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.name} x${item.quantity}</span>
            <span>${(item.price * item.quantity).toLocaleString()} so'm</span>
        </div>
    `).join('');

    finalOrderSummary.innerHTML = orderHTML;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    finalTotal.textContent = total.toLocaleString();
}

async function confirmOrder() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked');

    if (!paymentMethod) {
        alert('Iltimos, to\'lov usulini tanlang!');
        return;
    }

    // Collect all order data
    const orderData = {
        table: selectedTable,
        customer: {
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value
        },
        reservation: {
            date: document.getElementById('reservationDate').value,
            time: document.getElementById('reservationTime').value,
            guests: document.getElementById('guestCount').value,
            specialRequests: document.getElementById('specialRequests').value
        },
        order: cart,
        payment: paymentMethod.value,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString()
    };

    console.log('Tasdiqlangan buyurtma:', orderData);

    // Format message for Telegram
    let telegramMessage = `*Yangi Buyurtma!* 🔔\n\n`;
    telegramMessage += `*Stol:* ${orderData.table.number} (${orderData.table.seats} o'rin)\n`;
    telegramMessage += `*Mijoz ismi:* ${orderData.customer.name}\n`;
    telegramMessage += `*Telefon:* ${orderData.customer.phone}\n`;
    telegramMessage += `*Email:* ${orderData.customer.email}\n`;
    telegramMessage += `*Bron qilingan sana:* ${formatDate(orderData.reservation.date)}\n`;
    telegramMessage += `*Bron qilingan vaqt:* ${orderData.reservation.time}\n`;
    telegramMessage += `*Mehmonlar soni:* ${orderData.reservation.guests}\n`;
    if (orderData.reservation.specialRequests) {
        telegramMessage += `*Maxsus so'rovlar:* ${orderData.reservation.specialRequests}\n`;
    }
    telegramMessage += `\n*Buyurtma:* \n`;
    orderData.order.forEach(item => {
        telegramMessage += `- ${item.name} x${item.quantity} (${(item.price * item.quantity).toLocaleString()} so'm)\n`;
    });
    telegramMessage += `\n*Jami summa:* ${orderData.total.toLocaleString()} so'm\n`;
    telegramMessage += `*To'lov usuli:* ${getPaymentMethodName(orderData.payment)}\n`;
    telegramMessage += `*Buyurtma vaqti:* ${new Date(orderData.timestamp).toLocaleString('uz-UZ')}\n`;

    // Send to Telegram
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: telegramMessage,
                parse_mode: 'Markdown' // Use Markdown for formatting
            })
        });

        if (response.ok) {
            console.log('Buyurtma Telegramga yuborildi!');
        } else {
            const errorData = await response.json();
            console.error('Telegramga yuborishda xatolik:', errorData);
            alert('Buyurtma yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
        }
    } catch (error) {
        console.error('Telegram API chaqiruvida xatolik:', error);
        alert('Tarmoq xatosi. Iltimos, internetga ulanishni tekshiring va qayta urinib ko\'ring.');
    }

    // Show success message
    alert(`Buyurtmangiz muvaffaqiyatli tasdiqlandi!\n\nStol: ${selectedTable.number}\nJami summa: ${orderData.total.toLocaleString()} so'm\nTo'lov usuli: ${getPaymentMethodName(paymentMethod.value)}\n\nTez orada siz bilan bog'lanamiz!`);

    // Reset the application
    resetApplication();
}

function getPaymentMethodName(method) {
    const names = {
        'cash': 'Naqd pul',
        'card': 'Plastik karta',
        'online': 'Online to\'lov'
    };
    return names[method] || method;
}

function resetApplication() {
    // Reset all variables
    currentStep = 1;
    selectedTable = null;
    cart = [];
    isChefMode = false;

    // Reset UI
    document.querySelectorAll('.table').forEach(t => t.classList.remove('selected'));
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active', 'completed'));
    document.querySelector('[data-step="1"]').classList.add('active');

    // Clear forms
    document.getElementById('reservationForm').reset();
    document.querySelectorAll('input[name="payment"]').forEach(radio => radio.checked = false);
    document.getElementById('menuSearchInput').value = ''; // Clear search input
    document.getElementById('chefPanel').classList.add('hidden'); // Hide chef panel
    document.getElementById('addDishForm').classList.add('hidden'); // Hide add dish form
    document.getElementById('editDishForm').classList.add('hidden'); // Hide edit dish form


    // Reset displays
    updateCartDisplay();
    goToStep(1);

    // Update visitors count
    updateVisitorsCount();

    // Re-render menu without chef controls
    renderMenuItems(document.querySelector('.category-btn.active')?.dataset.category || 'appetizers');

    console.log('Ilova qayta boshlandi');
}

// Utility functions for formatting
function formatCurrency(amount) {
    return amount.toLocaleString() + ' so\'m';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ');
}

function formatTime(timeString) {
    return timeString;
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Xatolik yuz berdi:', e.error);
});

// Make functions available globally
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.editDish = editDish; // Make editDish globally accessible
window.deleteDish = deleteDish; // Make deleteDish globally accessible