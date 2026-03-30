/**
 * home.js
 * Logic for the landing page.
 */

// LOADER
window.addEventListener('load', () => { 
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 900); 
});

// NAV SCROLL
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});

// SCROLL REVEAL
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  renderProducts();
});

// ICONS
const icons = {
  shirt: `<svg viewBox="0 0 100 100"><path d="M30 10 L10 30 L25 35 L25 90 L75 90 L75 35 L90 30 L70 10 L60 20 Q50 30 40 20 Z" stroke="#9a9490" stroke-width="3" fill="none" stroke-linejoin="round"/></svg>`,
  bag: `<svg viewBox="0 0 100 100"><rect x="20" y="35" width="60" height="55" rx="4" stroke="#9a9490" stroke-width="3" fill="none"/><path d="M35 35 Q35 18 50 18 Q65 18 65 35" stroke="#9a9490" stroke-width="3" fill="none"/><line x1="20" y1="55" x2="80" y2="55" stroke="#9a9490" stroke-width="2"/></svg>`,
  glasses: `<svg viewBox="0 0 100 100"><circle cx="32" cy="52" r="18" stroke="#9a9490" stroke-width="3" fill="none"/><circle cx="68" cy="52" r="18" stroke="#9a9490" stroke-width="3" fill="none"/><line x1="50" y1="52" x2="14" y2="48" stroke="#9a9490" stroke-width="2"/><line x1="50" y1="52" x2="86" y2="48" stroke="#9a9490" stroke-width="2"/><line x1="14" y1="48" x2="5" y2="44" stroke="#9a9490" stroke-width="2"/><line x1="86" y1="48" x2="95" y2="44" stroke="#9a9490" stroke-width="2"/></svg>`,
  hat: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="45" ry="12" stroke="#9a9490" stroke-width="3" fill="none"/><path d="M20 60 Q20 28 50 28 Q80 28 80 60" stroke="#9a9490" stroke-width="3" fill="none"/></svg>`,
  watch: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="24" stroke="#9a9490" stroke-width="3" fill="none"/><rect x="38" y="22" width="24" height="12" rx="3" stroke="#9a9490" stroke-width="2" fill="none"/><rect x="38" y="66" width="24" height="12" rx="3" stroke="#9a9490" stroke-width="2" fill="none"/><line x1="50" y1="50" x2="50" y2="36" stroke="#9a9490" stroke-width="2"/><line x1="50" y1="50" x2="60" y2="54" stroke="#9a9490" stroke-width="2"/></svg>`,
  belt: `<svg viewBox="0 0 100 100"><rect x="10" y="44" width="80" height="12" rx="6" stroke="#9a9490" stroke-width="3" fill="none"/><rect x="42" y="40" width="16" height="20" rx="2" stroke="#9a9490" stroke-width="2" fill="none"/></svg>`,
  shoe: `<svg viewBox="0 0 100 100"><path d="M10 70 Q10 55 30 50 L55 48 Q72 47 80 55 Q90 65 88 72 Q86 78 10 78 Z" stroke="#9a9490" stroke-width="3" fill="none" stroke-linejoin="round"/><path d="M30 50 L30 35 Q30 25 42 25 L55 28 L55 48" stroke="#9a9490" stroke-width="2.5" fill="none"/></svg>`,
  pants: `<svg viewBox="0 0 100 100"><path d="M25 10 L15 90 L40 90 L50 55 L60 90 L85 90 L75 10 Z" stroke="#9a9490" stroke-width="3" fill="none" stroke-linejoin="round"/></svg>`,
  headphone: `<svg viewBox="0 0 100 100"><path d="M20 55 Q20 22 50 22 Q80 22 80 55" stroke="#9a9490" stroke-width="3" fill="none"/><rect x="12" y="52" width="16" height="26" rx="8" stroke="#9a9490" stroke-width="3" fill="none"/><rect x="72" y="52" width="16" height="26" rx="8" stroke="#9a9490" stroke-width="3" fill="none"/></svg>`,
};

let cartCount = 0;

function renderProducts(filter = 'all') {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  const list = (filter === 'all' ? productsData : productsData.filter(p => p.category === filter)).slice(0, 8);
  grid.innerHTML = list.map((p, i) => `
    <div class="product-card reveal" style="transition-delay:${i * 0.03}s" onclick="location.href='pages/product.html?id=${p.id}'">
      <div class="product-img-wrap">
        <div class="product-img-placeholder">
          ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy">` : (icons[p.icon] || icons.shirt)}
        </div>
        ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge === 'new' ? 'New' : '-' + Math.round((1 - p.price / p.oldPrice) * 100) + '%'}</span>` : ''}
        <div class="product-actions">
          <div class="product-action-btn" onclick="addToWishlist(event)"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
        </div>
        <div class="quick-add" onclick="event.stopPropagation(); addToCart('${p.name}')">+ Add to Cart</div>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${formatPrice(p.price)}${p.oldPrice ? ` <del>${formatPrice(p.oldPrice)}</del>` : ''}</div>
      </div>
    </div>`).join('');
  
  document.querySelectorAll('.product-card.reveal').forEach(el => observer.observe(el));
}

function filterProducts(btn, cat) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

function addToCart(name) {
  cartCount++;
  const cartBadge = document.getElementById('cartCount');
  if (cartBadge) cartBadge.textContent = cartCount;
  showToast(`"${name}" added to cart`);
}

function addToWishlist(e) {
  e.stopPropagation();
  showToast('Added to wishlist');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  const msgEl = document.getElementById('toastMsg');
  if (msgEl) msgEl.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2600);
}

function subscribe() {
  const v = document.getElementById('emailInput').value.trim();
  if (!v || !v.includes('@')) return showToast('Please enter a valid email');
  showToast('Thanks for subscribing!');
  document.getElementById('emailInput').value = '';
}