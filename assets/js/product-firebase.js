
import { db } from "./firebase-config.js";
import { doc, getDoc, collection, getDocs, query, limit } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

let currentProduct = null;
let currentQty = 1;
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

async function initProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id) {
    window.location.href = '../index.html';
    return;
  }

  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      currentProduct = { id: docSnap.id, ...docSnap.data() };
      renderProductDetails();
      renderRelatedItems();
    } else {
      window.location.href = '../index.html';
    }
  } catch (err) {
    console.error("Error loading product:", err);
    // Fallback logic if needed
  }
}

function renderProductDetails() {
  if (!currentProduct) return;
  
  document.title = `${currentProduct.name} — UJINN.RVN`;
  document.querySelector('.product-title').textContent = currentProduct.name;
  document.querySelector('.price').textContent = `₦${Number(currentProduct.price || 0).toLocaleString()}`;
  document.querySelector('.description').textContent = currentProduct.description || "No description available.";

  const mainImg = document.getElementById('mainImage');
  if (mainImg) {
    mainImg.innerHTML = currentProduct.images && currentProduct.images[0]
      ? `<img src="${currentProduct.images[0]}" alt="${currentProduct.name}" style="width:100%; height:100%; object-fit:cover;">`
      : `<div class="fallback-icon" style="opacity: 0.2;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.62 1.97v4.42a2 2 0 0 0 .76 1.58L7 14.3v6.3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6.3l4.24-2.87a2 2 0 0 0 .76-1.58V5.43a2 2 0 0 0-1.62-1.97z"/></svg></div>`;
  }

  const thumbList = document.getElementById('thumbnailList');
  if (thumbList && currentProduct.images) {
    thumbList.innerHTML = currentProduct.images.map((src, i) => `
      <div class="thumbnail ${i === 0 ? 'active' : ''}" onclick="window.changeImage('${src}', this)">
        <img data-src="${src}" alt="Thumb ${i}" loading="lazy" decoding="async" style="width:100%; height:100%; object-fit:cover;">
      </div>
    `).join('');
    if (window.setupLazyImages) window.setupLazyImages(thumbList);
  }

  // Render Colors
  const colorOptions = document.getElementById('colorOptions');
  if (colorOptions) {
    const colors = currentProduct.colors || [];
    if (colors.length > 0) {
      const colorHtml = colors.map((c, i) => `
        <div class="color-dot ${i === 0 ? 'active' : ''}" style="background-color: ${c.toLowerCase()};" title="${c}" onclick="window.selectColor('${c}', this)"></div>
      `).join('');
      colorOptions.innerHTML = `<span class="option-label">Colours:</span> ${colorHtml}`;
      if (currentProduct.colorNotes) {
        colorOptions.innerHTML += `<div class="color-tip" style="font-size: 11px; margin-top: 8px; color: var(--mid-gray); display:flex; align-items:center; gap:6px; opacity:0.8;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          ${currentProduct.colorNotes}
        </div>`;
      }
      colorOptions.parentElement.style.display = 'block';
    } else {
      colorOptions.parentElement.style.display = 'none';
    }
  }

  // Render Sizes
  const sizeOptions = document.getElementById('sizeOptions');
  if (sizeOptions) {
    const sizes = currentProduct.sizes || [];
    if (sizes.length > 0) {
      const sizeHtml = sizes.map((s, i) => `
        <div class="size-box ${i === 0 ? 'active' : ''}" onclick="window.selectSize('${s}', this)">${s}</div>
      `).join('');
      sizeOptions.innerHTML = `<span class="option-label">Size:</span> ${sizeHtml}`;
      sizeOptions.parentElement.style.display = 'block';
    } else {
      sizeOptions.parentElement.style.display = 'none';
    }
  }
}

async function renderRelatedItems() {
  const grid = document.getElementById('relatedGrid');
  if (!grid) return;

  try {
    const q = query(collection(db, "products"), limit(4));
    const snapshot = await getDocs(q);
    const related = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(p => p.id !== currentProduct.id);

    grid.innerHTML = related.map((p, i) => `
      <div class="product-card reveal" style="transition-delay:${i * 0.05}s" onclick="location.href='product.html?id=${p.id}'">
        <div class="product-img-wrap">
          <div class="product-img-placeholder">
            ${p.images && p.images[0] ? `<img data-src="${p.images[0]}" alt="${p.name}" loading="lazy" decoding="async">` : `<div style="opacity:0.2;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.62 1.97v4.42a2 2 0 0 0 .76 1.58L7 14.3v6.3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6.3l4.24-2.87a2 2 0 0 0 .76-1.58V5.43a2 2 0 0 0-1.62-1.97z"/></svg></div>`}
          </div>
          <div class="quick-add" onclick="event.stopPropagation(); window.addToCartSimple('${p.id}', '${p.name}', ${p.price}, '${p.images?.[0] || ''}')">+ Add to Cart</div>
        </div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-price">₦${Number(p.price || 0).toLocaleString()}</div>
        </div>
      </div>
    `).join('');
    
    document.querySelectorAll('.product-card.reveal').forEach(el => observer.observe(el));
    if (window.setupLazyImages) window.setupLazyImages(grid);
  } catch (err) {
    console.error("Error loading related items:", err);
  }
}

window.changeImage = function(src, thumb) {
  document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
  const mainImg = document.getElementById('mainImage');
  if (mainImg) {
    mainImg.innerHTML = `<img src="${src}" style="width:100%; height:100%; object-fit:cover;">`;
  }
};

window.changeQty = function(n) {
  currentQty = Math.max(1, currentQty + n);
  const qtyInput = document.getElementById('qtyValue');
  if (qtyInput) qtyInput.value = currentQty;
};

// Size selection logic
window.selectSize = function(size, el) {
  document.querySelectorAll('.size-box').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
};

window.selectColor = function(color, el) {
  document.querySelectorAll('.color-dot').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
};

window.addToCartSimple = function(productId, name, price, image) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const product = {
    id: productId,
    name: name,
    price: price,
    image: image || '',
    quantity: 1,
    size: 'M' // Default for quick add
  };
  
  const existingIndex = cart.findIndex(item => item.id === product.id && item.size === product.size);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push(product);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('cartCount', cart.reduce((s, i) => s + i.quantity, 0));
  window.dispatchEvent(new Event('cartUpdated'));
  
  window.showToast(`"${name}" added to cart`);
};

window.addToCart = function() {
  if (!currentProduct) return;
  const size = document.querySelector('.size-box.active')?.textContent || 'Default';
  const color = document.querySelector('.color-dot.active')?.title || 'Default';
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  const product = {
    id: currentProduct.id,
    name: currentProduct.name,
    price: currentProduct.price,
    image: currentProduct.images?.[0] || '',
    quantity: currentQty,
    size: size,
    color: color
  };
  
  // Check if already in cart
  const existingIndex = cart.findIndex(item => item.id === product.id && item.size === product.size);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += currentQty;
  } else {
    cart.push(product);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart count for nav
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem('cartCount', totalCount);
  window.dispatchEvent(new Event('cartUpdated'));
  
  window.showToast(`"${currentProduct.name}" added to cart`);
};

window.buyNow = function() {
  if (!currentProduct) return;
  const size = document.querySelector('.size-box.active')?.textContent || 'Default';
  const color = document.querySelector('.color-dot.active')?.title || 'Default';
  const qty = currentQty;
  const total = currentProduct.price * qty;
  const phone = "2348147396890";
  
  const message = `Hello UJINN.RVN, I would like to place an order:
  
Item: ${currentProduct.name}
Size: ${size}
Color: ${color}
Quantity: ${qty}
Total: ₦${total.toLocaleString()}

Is this piece available for delivery?`;

  const encodedMsg = encodeURIComponent(message);
  const waLink = `https://wa.me/${phone}?text=${encodedMsg}`;
  
  window.open(waLink, '_blank');
};

window.showToast = function(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
};

document.addEventListener('DOMContentLoaded', initProduct);
