
  let currentPage = 1;
  const itemsPerPage = 10;

  function renderDashboard(page = 1) {
    currentPage = page;
    const products = loadInventory();
    const body = document.getElementById('inventoryBody');
    const statTotal = document.getElementById('statTotal');
    const statValue = document.getElementById('statValue');
    const statLow = document.getElementById('statLow');

    if (!products.length) {
      body.innerHTML = '<tr><td colspan="6" style="padding: 80px; text-align: center; color: var(--mid-gray);">No items in inventory.</td></tr>';
      document.getElementById('pagination').style.display = 'none';
      return;
    }

    document.getElementById('pagination').style.display = 'flex';

    // Stats calculation (on all products)
    let totalVal = 0;
    let lowCount = 0;
    products.forEach(p => {
        totalVal += (p.price * p.stock);
        if (p.stock < 5) lowCount++;
    });

    statTotal.textContent = products.length;
    statLow.textContent = lowCount;
    statValue.textContent = '₦' + (totalVal / 1000000).toFixed(1) + 'M';

    // Pagination Slicing
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pagedProducts = products.slice(start, end);

    body.innerHTML = pagedProducts.map(p => {
      return `
        <tr>
          <td data-label="Expand" class="mobile-expand">
            <div class="expand-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </td>
          <td data-label="Product">
            <div class="td-product">
              <div class="td-img">${p.images && p.images[0] ? `<img src="${p.images[0]}">` : adminIcons[p.icon] || adminIcons.shirt}</div>
              <div class="name-wrap">
                <strong>${p.name}</strong>
                <span>ID: P${String(p.id).padStart(3, '0')}</span>
              </div>
            </div>
          </td>
          <td data-label="Price"><span class="price-tag">₦${p.price.toLocaleString()}</span></td>
          <td data-label="Stock">
            <div class="stock-count">
              <span class="stock-dot ${p.stock < 5 ? 'low' : ''}"></span>
              ${p.stock} Units
            </div>
          </td>
          <td data-label="Category">${p.category}</td>
          <td data-label="Action">
            <div class="action-links">
              <a href="product-edit.html?id=${p.id}" class="link-edit">Edit Item</a>
              <a href="#" class="link-delete" onclick="deleteItem(${p.id})">Delete</a>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    renderPaginationControls(products.length, page);
  }

  function renderPaginationControls(total, page) {
    const totalPages = Math.ceil(total / itemsPerPage);
    const start = (page - 1) * itemsPerPage + 1;
    const end = Math.min(page * itemsPerPage, total);
    
    document.getElementById('paginationInfo').textContent = `Showing ${start}-${end} of ${total} pieces`;
    
    let controls = `
      <button class="page-btn nav-page" ${page === 1 ? 'disabled' : ''} onclick="renderDashboard(${page - 1})">Prev</button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        controls += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="renderDashboard(${i})">${i}</button>`;
    }
    
    controls += `
      <button class="page-btn nav-page" ${page === totalPages ? 'disabled' : ''} onclick="renderDashboard(${page + 1})">Next</button>
    `;
    
    document.getElementById('paginationControls').innerHTML = controls;
  }

  function deleteItem(id) {
    if (confirm('Permanently delete this piece?')) {
      const products = loadInventory();
      saveInventory(products.filter(p => p.id != id));
      renderDashboard(currentPage);
      showToast('Item deleted.');
    }
  }

  function toggleExpand(tr) {
    if (window.innerWidth > 768) return;
    tr.classList.toggle('is-expanded');
  }

  document.getElementById('inventoryBody').addEventListener('click', (e) => {
      const tr = e.target.closest('tr');
      if (tr) toggleExpand(tr);
  });

  document.addEventListener('DOMContentLoaded', () => renderDashboard(1));