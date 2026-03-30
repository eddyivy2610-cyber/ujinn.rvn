
import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

let allProducts = [];
const grid = document.getElementById('productGrid');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

async function initHome() {
  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(20));
    const snapshot = await getDocs(q);
    allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderProducts('all');
  } catch (err) {
    console.error("Error fetching products:", err);
    grid.innerHTML = '<div style="grid-column: 1/-1; padding: 60px; text-align: center; color: var(--error);">Error synchronizing catalog. Please refresh.</div>';
  }
}

function renderProducts(filter = 'all') {
  if (!grid) return;
  
  const filtered = filter === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; padding: 60px; text-align: center; color: var(--mid-gray);">No pieces found in this category.</div>';
    return;
  }

  grid.innerHTML = filtered.map((p, i) => `
    <div class="product-card reveal" style="transition-delay:${i * 0.05}s" onclick="location.href='pages/product.html?id=${p.id}'">
      <div class="product-img-wrap">
        <div class="product-img-placeholder">
          ${p.images && p.images[0] ? `<img src="${p.images[0]}" alt="${p.name}" loading="lazy">` : `<div class="fallback-icon">👕</div>`}
        </div>
        ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge}</span>` : ''}
        <div class="quick-add" onclick="event.stopPropagation(); window.addToCart('${p.name}')">+ Add to Cart</div>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">₦${Number(p.price || 0).toLocaleString()}</div>
      </div>
    </div>`).join('');
  
  document.querySelectorAll('.product-card.reveal').forEach(el => observer.observe(el));
}

window.filterProducts = function(btn, cat) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
};

window.addToCart = function(name) {
  const cartBadge = document.getElementById('cartCount');
  if (cartBadge) {
    let count = parseInt(cartBadge.textContent) || 0;
    cartBadge.textContent = count + 1;
  }
  showToast(`"${name}" added to cart`);
};

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  const msgEl = document.getElementById('toastMsg');
  if (msgEl) msgEl.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

// Initialize
document.addEventListener('DOMContentLoaded', initHome);
