
import { db, auth } from "../../assets/js/firebase-config.js";
import { 
  collection, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

let currentProducts = [];
let currentPage = 1;
const itemsPerPage = 8; // Adjust as needed

/**
 * AUTH GUARD
 */
onAuthStateChanged(auth, (user) => {
  if (!user && !window.location.href.includes('index.html')) {
    window.location.href = '../index.html';
  } else if (user) {
    initDashboard();
  }
});

function initDashboard() {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  
  onSnapshot(q, (snapshot) => {
    currentProducts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    updateStats(currentProducts);
    renderProducts(currentProducts);
  }, (error) => {
    console.error("Error fetching products:", error);
    showToast("Failed to sync inventory", "error");
  });
}

/**
 * DASHBOARD UI LOGIC
 */
function renderProducts(products) {
  const tbody = document.getElementById('inventoryBody');
  if (!tbody) return;

  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  if (paginatedProducts.length === 0 && totalItems > 0 && currentPage > 1) {
    currentPage--;
    renderProducts(products);
    return;
  }

  if (paginatedProducts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 100px 40px;">
          <div style="font-size: 48px; margin-bottom: 20px; opacity: 0.4;">📦</div>
          <div style="font-family: var(--serif); font-size: 24px; margin-bottom: 12px; font-weight: 300;">Your Collection is Empty</div>
          <p style="font-size: 13px; color: var(--mid-gray); max-width: 300px; margin: 0 auto 32px;">Start adding pieces to your digital showroom to showcase them to your clients.</p>
          <a href="product-edit.html" class="btn-primary">Add Your First Piece</a>
        </td>
      </tr>
    `;
    updatePagination(0, 1);
    return;
  }

  tbody.innerHTML = paginatedProducts.map(p => `
    <tr data-id="${p.id}">
      <td data-label="Expand" class="mobile-expand">
        <div class="expand-icon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </td>
      <td data-label="Product">
        <div class="td-product">
          <div class="td-img">
            ${p.images && p.images[0] ? `<img src="${p.images[0]}" alt="${p.name}">` : `<div class="placeholder-icon">👕</div>`}
          </div>
          <div class="name-wrap">
            <strong>${escapeHtml(p.name)}</strong>
            <span>${p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'Collection'}</span>
          </div>
        </div>
      </td>
      <td data-label="Price"><div class="price-tag">₦${Number(p.price || 0).toLocaleString()}</div></td>
      <td data-label="Stock">
        <div class="stock-count">
          <span class="stock-dot ${(p.stock || 0) < 5 ? 'low' : ''}"></span>
          ${p.stock || 0} Units
        </div>
      </td>
      <td data-label="Badge">${p.badge ? `<span class="badge ${p.badge}">${p.badge}</span>` : '—'}</td>
      <td data-label="Action">
        <div class="action-links">
          <a href="product-edit.html?id=${p.id}" class="link-edit">Edit</a>
          <button onclick="confirmDelete('${p.id}', '${escapeHtml(p.name)}')" class="link-delete">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  updatePagination(totalItems, totalPages);
}

function updateStats(products) {
  const totalStock = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0);
  const lowStock = products.filter(p => (Number(p.stock) || 0) < 5).length;

  document.getElementById('statTotal').textContent = products.length;
  document.getElementById('statValue').textContent = '₦' + (totalValue / 1000000).toFixed(1) + 'M';
  document.getElementById('statLow').textContent = lowStock;
}

function updatePagination(total, totalPages) {
  const info = document.getElementById('paginationInfo');
  const controls = document.getElementById('paginationControls');
  if (!info || !controls) return;

  const start = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, total);
  info.textContent = `Showing ${start}-${end} of ${total} pieces`;

  let html = `<button class="page-btn nav-page" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">Prev</button>`;
  
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }

  html += `<button class="page-btn nav-page" ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next</button>`;
  controls.innerHTML = html;
}

/**
 * HELPER FUNCTIONS
 */
window.changePage = function(page) {
  const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderProducts(currentProducts);
  }
};

window.confirmDelete = function(id, name) {
  if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
    deleteDoc(doc(db, "products", id))
      .then(() => showToast("Piece removed from inventory"))
      .catch(err => {
        console.error("Delete error:", err);
        showToast("Failed to delete piece", "error");
      });
  }
};

window.adminLogout = function() {
  signOut(auth).then(() => {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = '../index.html';
  });
};

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message, type = 'success') {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.className = 'toast show';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}
