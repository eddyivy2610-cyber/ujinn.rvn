/**
 * sync-header-footer.js
 * Dynamically imports the navigation and footer from index.html to maintain consistency.
 */

async function syncHeaderFooter() {
  const lowerPath = window.location.pathname.toLowerCase();
  const isSubPage = lowerPath.includes('/pages/') || lowerPath.includes('\\pages\\') || lowerPath.endsWith('/pages') || lowerPath.endsWith('\\pages');
  const rootPath = isSubPage ? '../' : './';
  const indexPath = rootPath + 'index.html';

  try {
    const response = await fetch(indexPath);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const sourceNav = doc.querySelector('nav');
    const sourceFooter = doc.querySelector('footer');
    const sourceMenu = doc.getElementById('mobileMenu');

    if (!sourceNav || !sourceFooter) return;

    // Helper to fix paths
    const fixPaths = (element) => {
      if (!element) return;
      element.querySelectorAll('[src], [href]').forEach(el => {
        const attributes = ['src', 'href'];
        attributes.forEach(attr => {
          const val = el.getAttribute(attr);
          if (val && !val.startsWith('http') && !val.startsWith('#') && !val.startsWith('mailto:')) {
               const lowerVal = val.toLowerCase();
               if (isSubPage) {
                  if (lowerVal.startsWith('pages/')) el.setAttribute(attr, val.substring(6));
                  else if (lowerVal === 'index.html') el.setAttribute(attr, '../index.html');
                  else if (!val.startsWith('../')) el.setAttribute(attr, '../' + val);
               }
          }
        });
      });
    };

    fixPaths(sourceNav);
    fixPaths(sourceFooter);
    fixPaths(sourceMenu);

    const currentNav = document.querySelector('nav');
    const currentFooter = document.querySelector('footer');
    let currentMenu = document.getElementById('mobileMenu');

    if (currentNav) {
      currentNav.innerHTML = sourceNav.innerHTML;
      Array.from(sourceNav.attributes).forEach(attr => currentNav.setAttribute(attr.name, attr.value));
    }

    if (currentFooter) {
      currentFooter.innerHTML = sourceFooter.innerHTML;
      Array.from(sourceFooter.attributes).forEach(attr => currentFooter.setAttribute(attr.name, attr.value));
    }

    if (sourceMenu) {
      if (!currentMenu) {
        currentMenu = document.createElement('div');
        currentMenu.id = 'mobileMenu';
        currentMenu.className = 'mobile-menu';
        document.body.appendChild(currentMenu);
      }
      currentMenu.innerHTML = sourceMenu.innerHTML;
    }

    initMobileMenu();
    console.log('Header, Footer, and Menu synced');

    document.dispatchEvent(new CustomEvent('headerFooterSynced'));

  } catch (error) {
    console.error('Failed to sync header/footer/menu:', error);
  }
}

function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isActive = menu.classList.toggle('active');
    // Change hamburger icon to X or similar if you like
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('active');
    }
  });
}

// Execute when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', syncHeaderFooter);
} else {
  syncHeaderFooter();
}
