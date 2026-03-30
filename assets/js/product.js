/**
 * product.js
 * Logic for the individual product details page.
 */

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

let currentProduct = null;
let currentQty = 1;

// SCROLL REVEAL
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id')) || 1;
  
  currentProduct = productsData.find(p => p.id === id);
  if (!currentProduct) {
    window.location.href = '../index.html';
    return;
  }

  renderProductDetails();
  renderRelatedItems();
  
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function renderProductDetails() {
  if (!currentProduct) return;
  document.title = `${currentProduct.name} — UJINN.RVN`;
  document.querySelector('.product-title').textContent = currentProduct.name;
  document.querySelector('.price').textContent = formatPrice(currentProduct.price);
  document.querySelector('.description').textContent = currentProduct.description;
  
  // Set main icon/image
  const mainImg = document.getElementById('mainImage');
  if (mainImg) {
    mainImg.innerHTML = currentProduct.image ? 
      `<img src="${currentProduct.image}" alt="${currentProduct.name}" style="width:100%; height:100%; object-fit:cover;">` : 
      icons[currentProduct.icon] || icons.shirt;
  }

  // Inject Thumbs
  const thumbList = document.getElementById('thumbnailList');
  if (thumbList) {
    thumbList.innerHTML = Array(4).fill(0).map((_, i) => `
      <div class="thumbnail ${i === 0 ? 'active' : ''}" onclick="changeImage(${i})">
        ${currentProduct.image ? 
          `<img src="${currentProduct.image}" alt="Thumb ${i}" style="width:100%; height:100%; object-fit:cover; opacity: 0.5;">` : 
          icons[currentProduct.icon] || icons.shirt}
      </div>
    `).join('');
  }

  // Inject Colors
  const colorOpts = document.getElementById('colorOptions');
  if (colorOpts) {
    colorOpts.innerHTML = `
      <span class="option-label">Colours:</span>
      <div class="color-dot active" style="background:#a0b1c5" onclick="selectColor(this)"></div>
      <div class="color-dot" style="background:#e07575" onclick="selectColor(this)"></div>
      <div class="color-dot" style="background:#111111" onclick="selectColor(this)"></div>
    `;
  }
}

function changeImage(index) {
  document.querySelectorAll('.thumbnail').forEach((t, i) => t.classList.toggle('active', i === index));
  // In a real gallery, we'd swap currentProduct.images[index]
  // Since we only have one image, we just keep showing it. 
  // However, I'll update the main image specifically to demonstrate the logic.
  const mainImg = document.getElementById('mainImage');
  if (mainImg) {
    mainImg.innerHTML = currentProduct.image ? 
      `<img src="${currentProduct.image}" alt="${currentProduct.name}" style="width:100%; height:100%; object-fit:cover;">` : 
      icons[currentProduct.icon] || icons.shirt;
  }
}

function renderRelatedItems() {
  const grid = document.getElementById('relatedGrid');
  if (!grid) return;

  const related = productsData
    .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
    .slice(0, 4);

  // If not enough in same category, just take top 4 others
  if (related.length < 4) {
    const others = productsData.filter(p => p.id !== currentProduct.id && p.category !== currentProduct.category).slice(0, 4 - related.length);
    related.push(...others);
  }

  grid.innerHTML = related.map((p, i) => `
    <div class="product-card reveal" style="transition-delay:${i * 0.03}s" onclick="location.href='product.html?id=${p.id}'">
      <div class="product-img-wrap">
        <div class="product-img-placeholder">
          ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy">` : (icons[p.icon] || icons.shirt)}
        </div>
        ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge === 'new' ? 'New' : '-' + Math.round((1 - p.price / p.oldPrice) * 100) + '%'}</span>` : ''}
        <div class="product-actions">
          <div class="product-action-btn" onclick="event.stopPropagation(); addToWishlist()"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
        </div>
        <div class="quick-add" onclick="event.stopPropagation(); addToCartSimple('${p.name}')">+ Add to Cart</div>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${formatPrice(p.price)}${p.oldPrice ? ` <del>${formatPrice(p.oldPrice)}</del>` : ''}</div>
      </div>
    </div>
  `).join('');

  // Re-run observer if needed (though product.js doesn't have it defined, I should add it if it's missing)
  if (typeof observer !== 'undefined') {
    document.querySelectorAll('.product-card.reveal').forEach(el => observer.observe(el));
  }
}

function addToWishlist() {
  showToast('Added to wishlist');
}

function addToCartSimple(name) {
  showToast(`"${name}" added to cart`);
}

function changeQty(n) {
  currentQty = Math.max(1, currentQty + n);
  document.getElementById('quantity').value = currentQty;
}

function selectColor(btn) {
  document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  btn.classList.add('active');
}

function selectSize(btn) {
  document.querySelectorAll('.size-box').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function toggleFavorite() {
  const btn = document.querySelector('.favorite-btn');
  const isFav = btn.classList.toggle('active');
  const svg = btn.querySelector('svg');
  if (isFav) {
    svg.style.fill = 'var(--accent)';
    svg.style.stroke = 'var(--accent)';
    showToast('Added to wishlist');
  } else {
    svg.style.fill = 'none';
    svg.style.stroke = 'currentColor';
    showToast('Removed from wishlist');
  }
}

function addToCart() {
  showToast(`"${currentProduct.name}" added to cart`);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  const msgEl = document.getElementById('toastMsg');
  if (msgEl) msgEl.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// Product page - Buy Now button
// Product page - Buy Now button
function buyNow() {
  if (!currentProduct) return;

  const sizeBtn = document.querySelector('.size-box.active');
  const size = sizeBtn ? sizeBtn.textContent.trim() : 'One Size';
  const qty = parseInt(document.getElementById('quantity').value) || 1;

  const product = {
    id: currentProduct.id,
    name: currentProduct.name,
    size: size,
    quantity: qty,
    price: currentProduct.price,
    image: currentProduct.image,
    icon: currentProduct.icon
  };
  
  // Clear cart and add ONLY this product for immediate checkout
  localStorage.setItem('cart', JSON.stringify([product]));
  
  // Sync the cart count badge for consistency
  localStorage.setItem('cartCount', qty);
  window.dispatchEvent(new Event('cartUpdated'));

  // Redirect to checkout
  window.location.href = 'checkout.html';
}

// Start
document.addEventListener('DOMContentLoaded', init);
