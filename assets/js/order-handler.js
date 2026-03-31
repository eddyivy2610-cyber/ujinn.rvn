/**
 * order-handler.js
 * Comprehensive order management for UJINN.RVN
 * Handles WhatsApp redirection, Instagram DM clipboard, and local order storage.
 */

const STORE_CONFIG = {
  whatsappNumber: "2348147396890", 
  instagramUsername: "ujinn.rvn",
  storeName: "UJINN.RVN",
  checkoutSuccessPath: "collection.html"
};

// ============================================
// Data Helpers
// ============================================

function getCart() {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch(e) {
    console.error('Cart parse error:', e);
    return [];
  }
}

function clearCart() {
  localStorage.removeItem('cart');
  localStorage.removeItem('cartCount');
  // Dispatch event so other scripts (like nav) update
  window.dispatchEvent(new Event('cartUpdated'));
}

function formatPrice(price) {
  return '₦' + Number(price).toLocaleString('en-NG');
}

// ============================================
// Message Formatting
// ============================================

function generateOrderText(customer, cart, total, notes, isWhatsApp = true) {
  const date = new Date().toLocaleString('en-NG', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  
  const divider = isWhatsApp ? `━━━━━━━━━━━━━━━━━━━━\n` : `--------------------\n`;
  const icon = isWhatsApp ? `*NEW ORDER*\n\n` : `NEW ORDER INQUIRY\n\n`;
  
  let msg = icon + divider;
  msg += `Date: ${date}\n`;
  msg += `Customer: ${customer.name}\n`;
  msg += `Phone: ${customer.phone}\n`;
  msg += `Address: ${customer.address}\n`;
  msg += divider + `\nITEMS:\n`;
  
  cart.forEach((item, index) => {
    const size = item.size ? ` (${item.size.toUpperCase()})` : '';
    const quantity = item.quantity || 1;
    msg += `${index + 1}. ${item.name}${size} x${quantity} — ${formatPrice(item.price * quantity)}\n`;
  });
  
  msg += `\n` + divider;
  msg += `TOTAL: ${formatPrice(total)}\n`;
  
  if (notes) {
    msg += `\nNOTES:\n${notes}\n`;
  }
  
  msg += divider;
  msg += isWhatsApp ? `⏳ _Awaiting confirmation & payment details_` : `Please confirm availability.`;
  
  return msg;
}

// ============================================
// Core Actions
// ============================================

function collectFormData() {
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const notes = document.getElementById('specialNotes').value.trim();
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  if (!name || !phone || !address) {
    showToast('Please fill in all contact details.', 'error');
    return null;
  }
  if (cart.length === 0) {
    showToast('Your cart is empty.', 'error');
    return null;
  }

  return { customer: { name, phone, address }, cart, total, notes };
}

function sendOrderViaWhatsApp() {
  const data = collectFormData();
  if (!data) return;

  const message = generateOrderText(data.customer, data.cart, data.total, data.notes, true);
  const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  
  saveOrderToHistory(data, 'whatsapp');
  clearCart();
  
  showToast('Redirecting to WhatsApp...');
  setTimeout(() => window.open(url, '_blank'), 800);
  setTimeout(() => window.location.href = STORE_CONFIG.checkoutSuccessPath, 2500);
}

function sendOrderViaInstagram() {
  const data = collectFormData();
  if (!data) return;

  const message = generateOrderText(data.customer, data.cart, data.total, data.notes, false);
  
  // Copy to clipboard fallback
  const el = document.createElement('textarea');
  el.value = message;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  saveOrderToHistory(data, 'instagram');
  clearCart();
  
  showToast('Details copied! Paste in IG DM.', 'success');
  setTimeout(() => window.open(`https://www.instagram.com/${STORE_CONFIG.instagramUsername}/`, '_blank'), 1200);
  setTimeout(() => window.location.href = STORE_CONFIG.checkoutSuccessPath, 3500);
}

// ============================================
// UI & Storage
// ============================================

function saveOrderToHistory(data, channel) {
  const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
  orders.unshift({
    id: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    ...data,
    channel,
    status: 'pending'
  });
  localStorage.setItem('adminOrders', JSON.stringify(orders.slice(0, 50))); // Keep last 50
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  } else {
    alert(message);
  }
}

function loadCheckoutSummary() {
  const cart = getCart();
  const summaryDiv = document.getElementById('orderSummary');
  if (!summaryDiv) return;
  
  if (cart.length === 0) {
      summaryDiv.innerHTML = '<p style="color: var(--mid-gray); font-style: italic;">Your collection is empty.</p>';
      return;
  }
  
  let total = 0;
  let html = '';
  
  cart.forEach(item => {
    const qty = item.quantity || 1;
    const sub = item.price * qty;
    total += sub;
    html += `
      <div class="summary-item">
        <span>${item.name} ${item.size ? `<small>(${item.size.toUpperCase()})</small>` : ''} x${qty}</span>
        <span>${formatPrice(sub)}</span>
      </div>
    `;
  });
  
  html += `<div class="summary-total"><span>Total</span><span>${formatPrice(total)}</span></div>`;
  summaryDiv.innerHTML = html;
}

// Auto-run summary on load
document.addEventListener('DOMContentLoaded', loadCheckoutSummary);