/**
 * cart.js
 * Logic for the shopping cart page.
 */

// Cart Items State (In a real app, this would be from localStorage or an API)
let cartItems = [
  {
    id: 1,
    name: "Cream Knit Sweater",
    price: 36000,
    quantity: 1,
    variant: "Cream, M",
    icon: "shirt",
    image: 'https://images.unsplash.com/photo-1576809948016-35e330ad0e9b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 11,
    name: "Urban Backpack",
    price: 42000,
    quantity: 1,
    variant: "Tan",
    icon: "bag",
    image: 'https://images.unsplash.com/photo-1553062407-98eeb94c6a62?auto=format&fit=crop&q=80&w=800'
  }
];

// Helper functions (using formatPrice from productsData if available)
function calculateSubtotal() {
  return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateCartCount() {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountSpan = document.querySelector('#cartCount');
  if (cartCountSpan) cartCountSpan.textContent = totalItems;
  // localStorage.setItem('cartCount', totalItems);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (toastMsg) toastMsg.textContent = message;
  if (toast) {
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
}

// Render Cart
function renderCart() {
  const container = document.getElementById('cartContent');
  if (!container) return;
  
  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h2 class="empty-cart-title">Your cart is empty</h2>
        <p class="empty-cart-desc">Looks like you haven't added anything to your cart yet.</p>
        <a href="collection.html" class="shop-now-btn">Shop Now</a>
      </div>
    `;
    updateCartCount();
    return;
  }

  const subtotal = calculateSubtotal();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  container.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items-section">
        <table class="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${cartItems.map((item, index) => `
              <tr data-id="${item.id}" data-index="${index}">
                <td>
                  <div class="product-cell">
                    <div class="product-thumb">
                      ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">` : getIcon(item.icon)}
                    </div>
                    <div class="product-details">
                      <a href="product.html?id=${item.id}" class="product-name">${item.name}</a>
                      <span class="product-variant">${item.variant}</span>
                      <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                  </div>
                </td>
                <td class="price-cell">${typeof formatPrice === 'function' ? formatPrice(item.price) : '₦' + item.price.toLocaleString()}</td>
                <td>
                  <div class="quantity-selector">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                  </div>
                </td>
                <td class="subtotal-cell">${typeof formatPrice === 'function' ? formatPrice(item.price * item.quantity) : '₦' + (item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="cart-actions">
          <a href="collection.html" class="action-btn">← Return To Shop</a>
          <button class="action-btn" onclick="updateCart()">Update Cart</button>
        </div>
      </div>

      <div class="cart-total-section">
        <h3 class="total-title">Cart Total</h3>
        <div class="total-row subtotal">
          <span class="total-label">Subtotal:</span>
          <span class="total-value">${typeof formatPrice === 'function' ? formatPrice(subtotal) : '₦' + subtotal.toLocaleString()}</span>
        </div>
        <div class="total-row shipping">
          <span class="total-label">Shipping:</span>
          <span class="total-value">${shipping === 0 ? 'Free' : (typeof formatPrice === 'function' ? formatPrice(shipping) : '₦' + shipping.toLocaleString())}</span>
        </div>
        <div class="total-row total">
          <span class="total-label">Total:</span>
          <span class="total-value">${typeof formatPrice === 'function' ? formatPrice(total) : '₦' + total.toLocaleString()}</span>
        </div>
        <button class="checkout-btn" onclick="proceedToCheckout()">Proceed to Checkout →</button>
      </div>
    </div>
  `;
  
  updateCartCount();
}

function getIcon(key) {
  const icons = {
    shirt: `<svg viewBox="0 0 100 100"><path d="M30 10 L10 30 L25 35 L25 90 L75 90 L75 35 L90 30 L70 10 L60 20 Q50 30 40 20 Z" stroke="#9a9490" stroke-width="3" fill="none" stroke-linejoin="round"/></svg>`,
    bag: `<svg viewBox="0 0 100 100"><rect x="20" y="35" width="60" height="55" rx="4" stroke="#9a9490" stroke-width="3" fill="none"/><path d="M35 35 Q35 18 50 18 Q65 18 65 35" stroke="#9a9490" stroke-width="3" fill="none"/><line x1="20" y1="55" x2="80" y2="55" stroke="#9a9490" stroke-width="2"/></svg>`,
    shoe: `<svg viewBox="0 0 100 100"><path d="M10 70 Q10 55 30 50 L55 48 Q72 47 80 55 Q90 65 88 72 Q86 78 10 78 Z" stroke="#9a9490" stroke-width="3" fill="none" stroke-linejoin="round"/><path d="M30 50 L30 35 Q30 25 42 25 L55 28 L55 48" stroke="#9a9490" stroke-width="2.5" fill="none"/></svg>`,
    pants: `<svg viewBox="0 0 100 100"><path d="M25 10 L15 90 L40 90 L50 55 L60 90 L85 90 L75 10 Z" stroke="#9a9490" stroke-width="3" fill="none" stroke-linejoin="round"/></svg>`
  };
  return icons[key] || icons.shirt;
}

// Global functions
window.updateQuantity = function(index, delta) {
  const newQty = cartItems[index].quantity + delta;
  if (newQty >= 1 && newQty <= 99) {
    cartItems[index].quantity = newQty;
    renderCart();
    showToast(`${cartItems[index].name} quantity updated`);
  }
};

window.removeFromCart = function(index) {
  const itemName = cartItems[index].name;
  cartItems.splice(index, 1);
  renderCart();
  showToast(`${itemName} removed`);
};

window.updateCart = function() {
  renderCart();
  showToast('Cart updated');
};

window.proceedToCheckout = function() {
  if (cartItems.length === 0) {
    showToast('Your cart is empty');
    return;
  }
  showToast('Redirecting to checkout...');
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 600);
  renderCart();
});
