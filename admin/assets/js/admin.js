/**
 * admin.js - Shared Admin Logic for UJINN.RVN
 */

// AUTHENTICATION GUARD
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true' || localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn && !window.location.href.includes('index.html')) {
        // Redirect to login page in root
        window.location.href = '../index.html';
    }
}

function handleLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminRememberMe');
    window.location.href = '../index.html';
}

// DATA MANAGEMENT
function loadInventory() {
    const DEFAULT_PRODUCTS = [
        { id: 1, name: "Cream Knit Sweater", category: "tops", price: 36000, stock: 12, icon: "shirt" },
        { id: 2, name: "Urban Backpack", category: "accessories", price: 42000, stock: 8, icon: "bag" },
        { id: 3, name: "Classic Sunglasses", category: "accessories", price: 24000, stock: 15, icon: "glasses" },
        { id: 4, name: "Straw Sun Hat", category: "accessories", price: 48000, stock: 5, icon: "hat" },
        { id: 5, name: "Pilot Watch", category: "accessories", price: 18000, stock: 3, icon: "watch" },
        { id: 6, name: "Woven Leather Belt", category: "accessories", price: 54000, stock: 10, icon: "belt" },
        { id: 7, name: "Leather Sneakers", category: "footwear", price: 12000, stock: 7, icon: "shoe" },
        { id: 8, name: "Rust Chino Pants", category: "bottoms", price: 30000, stock: 4, icon: "pants" },
        { id: 9, name: "Over-Ear Headphones", category: "accessories", price: 30000, stock: 9, icon: "headphone" },
        { id: 10, name: "Black Runner Shoe", category: "footwear", price: 30000, stock: 6, icon: "shoe" }
    ];

    const raw = localStorage.getItem('adminProducts');
    if (!raw) {
        localStorage.setItem('adminProducts', JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
    }
    return JSON.parse(raw);
}

function saveInventory(products) {
    localStorage.setItem('adminProducts', JSON.stringify(products));
}

// UI HELPERS
function showToast(message, duration = 2500) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// COMMON ICONS (SVG)
const adminIcons = {
    shirt: `<svg viewBox="0 0 100 100" stroke="currentColor" stroke-width="2" fill="none"><path d="M30 10 L10 30 L25 35 L25 90 L75 90 L75 35 L90 30 L70 10 L60 20 Q50 30 40 20 Z"/></svg>`,
    bag: `<svg viewBox="0 0 100 100" stroke="currentColor" stroke-width="2" fill="none"><rect x="20" y="35" width="60" height="55" rx="4"/><path d="M35 35 Q35 18 50 18 Q65 18 65 35"/></svg>`,
    glasses: `<svg viewBox="0 0 100 100" stroke="currentColor" stroke-width="2" fill="none"><circle cx="32" cy="52" r="18"/><circle cx="68" cy="52" r="18"/><line x1="50" y1="52" x2="14" y2="48"/><line x1="50" y1="52" x2="86" y2="48"/></svg>`,
    hat: `<svg viewBox="0 0 100 100" stroke="currentColor" stroke-width="2" fill="none"><ellipse cx="50" cy="60" rx="45" ry="12"/><path d="M20 60 Q20 28 50 28 Q80 28 80 60"/></svg>`,
    watch: `<svg viewBox="0 0 100 100" stroke="currentColor" stroke-width="2" fill="none"><circle cx="50" cy="50" r="24"/><rect x="38" y="22" width="24" height="12" rx="3"/><rect x="38" y="66" width="24" height="12" rx="3"/></svg>`,
    belt: `<svg viewBox="0 0 100 100" stroke="currentColor" stroke-width="2" fill="none"><rect x="10" y="44" width="80" height="12" rx="6"/><rect x="42" y="40" width="16" height="20" rx="2"/></svg>`,
    shoe: `<svg viewBox="0 0 100 100" stroke="currentColor" stroke-width="2" fill="none"><path d="M10 70 Q10 55 30 50 L55 48 Q72 47 80 55 Q90 65 88 72 Q86 78 10 78 Z"/><path d="M30 50 L30 35 Q30 25 42 25 L55 28 L55 48"/></svg>`,
    pants: `<svg viewBox="0 0 100 100" stroke="currentColor" stroke-width="2" fill="none"><path d="M25 10 L15 90 L40 90 L50 55 L60 90 L85 90 L75 10 Z"/></svg>`,
    headphone: `<svg viewBox="0 0 100 100" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 55 Q20 22 50 22 Q80 22 80 55"/><rect x="12" y="52" width="16" height="26" rx="8"/><rect x="72" y="52" width="16" height="26" rx="8"/></svg>`
};

// AUTO-INITIALIZE
document.addEventListener('DOMContentLoaded', checkAuth);
