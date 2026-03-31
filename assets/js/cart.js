/**
 * cart.js
 * Comprehensive cart management for UJINN.RVN
 * Pulls live data from localStorage and synchronizes with navigation.
 */

let cartItems = [];

// ============================================
// Data Management
// ============================================

function loadCart() {
  try {
    const savedCart = localStorage.getItem('cart');
    cartItems = savedCart ? JSON.parse(savedCart) : [];
  } catch (e) {
    console.error('Cart load error:', e);
    cartItems = [];
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cartItems));
  
  // Sync total count for nav
  const totalCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  localStorage.setItem('cartCount', totalCount);
  
  // Notify other components (nav)
  window.dispatchEvent(new Event('cartUpdated'));
}

function formatPrice(price) {
  return '₦' + Number(price).toLocaleString('en-NG');
}

// ============================================
// UI Rendering
// ============================================

function renderCart() {
  const container = document.getElementById('cartContent');
  if (!container) return;
  
  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="empty-cart" style="text-align:center; padding: 100px 20px;">
        <div style="margin-bottom: 24px; opacity: 0.15;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        <h2 style="font-family: var(--serif); font-size: 32px; margin-bottom: 12px; font-weight: 300;">Your Archive is Empty</h2>
        <p style="color: var(--mid-gray); margin-bottom: 32px;">Discover our latest collection to add refined pieces to your cart.</p>
        <a href="collection.html" class="btn-primary" style="display:inline-flex; text-decoration:none;">Explore Collection</a>
      </div>
    `;
    return;
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal; // Assuming free shipping for now

  container.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items-section">
        <table class="cart-table" style="width:100%; border-collapse: collapse; margin-bottom: 40px;">
          <thead style="text-align:left; border-bottom: 1px solid var(--warm-gray);">
            <tr>
              <th style="padding: 16px 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mid-gray);">Product</th>
              <th style="padding: 16px 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mid-gray);">Price</th>
              <th style="padding: 16px 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mid-gray);">Quantity</th>
              <th style="padding: 16px 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mid-gray);">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${cartItems.map((item, index) => `
              <tr style="border-bottom: 1px solid var(--warm-gray);">
                <td style="padding: 24px 0;">
                  <div class="product-cell" style="display:flex; gap: 20px; align-items:center;">
                    <div class="product-thumb" style="width: 80px; height: 100px; background: #eee; flex-shrink:0;">
                      ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">` : '👕'}
                    </div>
                    <div class="product-details">
                      <h4 style="font-size: 15px; font-weight: 500; margin-bottom: 4px;">${item.name}</h4>
                      <p style="font-size: 11px; color: var(--mid-gray); margin-bottom: 2px;">Size: ${item.size || 'Default'}</p>
                      <p style="font-size: 11px; color: var(--mid-gray); margin-bottom: 12px;">Color: ${item.color || 'Default'}</p>
                      <button class="remove-btn" onclick="removeFromCart(${index})" style="background:none; border:none; border-bottom: 1px solid #ccc; font-size: 11px; padding:0; cursor:pointer; color: var(--mid-gray);">Remove Item</button>
                    </div>
                  </div>
                </td>
                <td style="padding: 24px 0; font-size: 14px;">${formatPrice(item.price)}</td>
                <td style="padding: 24px 0;">
                  <div class="quantity-selector" style="display:flex; align-items:center; border: 1px solid var(--warm-gray); width: fit-content; padding: 4px;">
                    <button onclick="updateQuantity(${index}, -1)" style="border:none; background:none; padding: 8px 12px; cursor:pointer;">−</button>
                    <span style="padding: 0 12px; font-size:14px; min-width: 30px; text-align:center;">${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)" style="border:none; background:none; padding: 8px 12px; cursor:pointer;">+</button>
                  </div>
                </td>
                <td style="padding: 24px 0; font-size: 14px; font-weight: 500;">${formatPrice(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <a href="collection.html" style="text-decoration:none; color: var(--black); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">← Continue Shopping</a>
      </div>

      <div class="cart-total-section" style="background: #fff; border: 1px solid var(--warm-gray); padding: 40px;">
        <h3 style="font-family: var(--serif); font-size: 24px; margin-bottom: 32px; font-weight: 400;">Selection Summary</h3>
        <div style="display:flex; justify-content:space-between; margin-bottom: 16px; font-size: 14px;">
          <span>Subtotal</span>
          <span>${formatPrice(subtotal)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid var(--warm-gray); font-size: 14px;">
          <span>Shipping</span>
          <span style="color: #22c55e;">Complimentary</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom: 40px; font-size: 20px; font-family: var(--serif); font-weight: 500;">
          <span>Total</span>
          <span>${formatPrice(total)}</span>
        </div>
        <button class="btn-primary" onclick="window.location.href='checkout.html'" style="width:100%; justify-content:center;">Complete Purchase</button>
      </div>
    </div>
  `;
}

// ============================================
// Actions
// ============================================

window.updateQuantity = function(index, delta) {
  const newQty = cartItems[index].quantity + delta;
  if (newQty >= 1 && newQty <= 99) {
    cartItems[index].quantity = newQty;
    saveCart();
    renderCart();
  }
};

window.removeFromCart = function(index) {
  cartItems.splice(index, 1);
  saveCart();
  renderCart();
};

window.showToast = function(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
};

// ============================================
// Lifecycle
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  renderCart();
  
  // Hide loader
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 600);
});
