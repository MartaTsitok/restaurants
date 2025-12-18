document.addEventListener('DOMContentLoaded', function() {
    loadGoods();
});

function loadGoods() {
    fetch('/cart.json')
        .then(response => response.json())
        .then(data => {
            console.log('Данные загружены:', data);
            showProducts(data);  
        })
        .catch(error => {
            console.error('Ошибка загрузки JSON:', error);
            document.getElementById('cards-restaurants').innerHTML = '<p>Товары не загрузились :(</p>';
        });
}

function showProducts(productsData) {
    const container = document.getElementById('cards-restaurants');
    let html = '';
    
    // Храним выбранные размеры
    window.selectedSizes = {};
    
    Object.entries(productsData).forEach(([productId, product]) => {
        const minPrice = Math.min(...product.sizes.map(s => s.price));
        
        // Сохраняем минимальную цену как начальную
        window.selectedSizes[productId] = {
            size: product.sizes[0].size,  // Первый размер по умолчанию
            price: minPrice
        };
        
        html += `
        <div class="product-card" data-id="${productId}">  
            <h3 class="product-name">${product.name}</h3>     
            <div class="image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="sizes-overlay">
                    ${product.sizes.map(size => `
                        <button class="size-btn" 
                                data-size="${size.size}" 
                                onclick="selectSize('${productId}', '${size.size}', ${size.price})">
                            ${size.size}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="product-price" id="price-${productId}">
                ${minPrice} руб.
            </div>
            <div class="buttons-row">
                <button class="wishlist-btn" onclick="addToWishlist('${productId}')">♡</button>
                <button class="ordering-btn" onclick="order('${productId}')">Заказать</button>
                <button class="add-to-cart-btn" onclick="addToCart('${productId}')">+</button>
            </div>
        </div>`;

    });
    
    container.innerHTML = html;
}

function selectSize(productId, size, price) {
    const sizeButtons = document.querySelectorAll(`[data-id="${productId}"] .size-btn`);
    sizeButtons.forEach(btn => btn.classList.remove('active'));
    const selectedBtn = document.querySelector(`[data-id="${productId}"] .size-btn[data-size="${size}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }

    window.selectedSizes[productId] = { size, price };
    updatePriceDisplay(productId, price);
    
    console.log(`Выбран размер ${size} за ${price} руб.`);
}

function updatePriceDisplay(productId, price) {
    const priceElement = document.getElementById(`price-${productId}`);
    if (priceElement) {
        priceElement.textContent = `${price} руб.`;
        priceElement.style.color = '#e74c3c';
    }
    
    const cartPriceElement = document.getElementById(`cart-price-${productId}`);
    if (cartPriceElement) {
        cartPriceElement.textContent = price;
    }
}

function addToCart(productId) {
    if (!window.selectedSizes || !window.selectedSizes[productId]) {
        alert('Пожалуйста, выберите размер!');
        return;
    }
    const selectedSize = window.selectedSizes[productId];
    const productName = document.querySelector(`[data-id="${productId}"] .product-name`).textContent;
    alert(`Товар "${productName}" (размер: ${selectedSize.size}, цена: ${selectedSize.price} руб.) добавлен в корзину!`);
    sum(selectedSize.price);
}

function addToWishlist(productId) {
    const wishlistBtn = document.querySelector(`[data-id="${productId}"] .wishlist-btn`);
    wishlistBtn.classList.toggle('active');
    
    if (wishlistBtn.classList.contains('active')) {
        wishlistBtn.textContent = '♥';
        wishlistBtn.style.color = '#ff4757';
        console.log(`Товар ${productId} добавлен в избранное`);
    } else {
        wishlistBtn.textContent = '♡';
        wishlistBtn.style.color = '';
        console.log(`Товар ${productId} удален из избранного`);
    }
}

function sum(price) {
    console.log(`Товар добавлен, его цена: ${price} руб.`);
    
    // Здесь можно добавить логику подсчета общей суммы корзины
    // Например:
    // if (!window.totalPrice) window.totalPrice = 0;
    // window.totalPrice += price;
    // updateTotalPriceDisplay();
}

// Функция для отображения общей суммы (дополнительно)
function updateTotalPriceDisplay() {
    if (window.totalPrice) {
        const totalElement = document.getElementById('total-price');
        if (totalElement) {
            totalElement.textContent = window.totalPrice + ' руб.';
        }
    }
}