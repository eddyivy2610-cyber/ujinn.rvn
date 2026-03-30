
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
      : `<div class="fallback-icon">👕</div>`;
  }

  const thumbList = document.getElementById('thumbnailList');
  if (thumbList && currentProduct.images) {
    thumbList.innerHTML = currentProduct.images.map((src, i) => `
      <div class="thumbnail ${i === 0 ? 'active' : ''}" onclick="window.changeImage('${src}', this)">
        <img src="${src}" alt="Thumb ${i}" style="width:100%; height:100%; object-fit:cover;">
      </div>
    `).join('');
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
            ${p.images && p.images[0] ? `<img src="${p.images[0]}" alt="${p.name}" loading="lazy">` : `👕`}
          </div>
          <div class="quick-add" onclick="event.stopPropagation(); window.addToCartSimple('${p.name}')">+ Add to Cart</div>
        </div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-price">₦${Number(p.price || 0).toLocaleString()}</div>
        </div>
      </div>
    `).join('');
    
    document.querySelectorAll('.product-card.reveal').forEach(el => observer.observe(el));
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

window.addToCartSimple = function(name) {
  window.showToast(`"${name}" added to cart`);
};

window.changeQty = function(n) {
  currentQty = Math.max(1, currentQty + n);
  document.getElementById('quantity').value = currentQty;
};

window.addToCart = function() {
  if (currentProduct) {
    window.showToast(`"${currentProduct.name}" added to cart`);
  }
};

window.buyNow = function() {
  if (!currentProduct) return;
  const size = document.querySelector('.size-box.active')?.textContent || 'M';
  const product = {
    id: currentProduct.id,
    name: currentProduct.name,
    price: currentProduct.price,
    image: currentProduct.images?.[0] || '',
    quantity: currentQty,
    size: size
  };
  localStorage.setItem('cart', JSON.stringify([product]));
  window.location.href = 'checkout.html';
};

window.showToast = function(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
};

document.addEventListener('DOMContentLoaded', initProduct);
