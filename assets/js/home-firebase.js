
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
    // Fallback to static data if available or show error
    if (window.productsData) {
      allProducts = window.productsData;
      renderProducts('all');
    }
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

// Initialize
document.addEventListener('DOMContentLoaded', initHome);
