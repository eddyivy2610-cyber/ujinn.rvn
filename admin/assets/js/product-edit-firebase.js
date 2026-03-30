
import { db, auth } from "../../assets/js/firebase-config.js";
import { 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  collection, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

let editingId = new URLSearchParams(window.location.search).get('id');
let uploadedImages = [];

// AUTH GUARD
onAuthStateChanged(auth, (user) => {
  if (!user && !window.location.href.includes('index.html')) {
    window.location.href = '../index.html';
  } else if (user && editingId) {
    loadProductData();
  }
});

async function loadProductData() {
  if (!editingId) return;

  try {
    const docRef = doc(db, "products", editingId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const p = docSnap.data();
      document.getElementById('editorTitle').textContent = 'Refine Piece';
      document.getElementById('editorSubtitle').textContent = `Editing Firestore ID: ${editingId}`;
      document.getElementById('name').value = p.name || '';
      document.getElementById('category').value = p.category || 'tops';
      document.getElementById('price').value = p.price || 0;
      document.getElementById('stock').value = p.stock || 0;
      document.getElementById('badge').value = p.badge || '';
      document.getElementById('desc').value = p.description || '';
      uploadedImages = p.images || [];
      renderImages();
    } else {
      showToast("Product not found", "error");
      setTimeout(() => window.location.href = 'dashboard.html', 2000);
    }
  } catch (err) {
    console.error("Error loading product:", err);
    showToast("Failed to load product data", "error");
  }
}

window.triggerUpload = function() {
  document.getElementById('fileInput').click();
};

window.handleFileUpload = function(e) {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      uploadedImages.push(ev.target.result);
      renderImages();
    };
    reader.readAsDataURL(file);
  });
};

window.renderImages = function() {
  const grid = document.getElementById('imageGrid');
  const addBox = grid.querySelector('.upload-box');
  grid.innerHTML = '';
  grid.appendChild(addBox);

  uploadedImages.forEach((src, idx) => {
    const box = document.createElement('div');
    box.className = 'upload-box';
    box.innerHTML = `<img src="${src}"><div class="remove-img" onclick="removeImage(${idx})">×</div>`;
    grid.insertBefore(box, addBox);
  });
};

window.removeImage = function(idx) {
  uploadedImages.splice(idx, 1);
  renderImages();
};

window.handleLogout = function() {
    window.location.href = '../index.html';
};

document.getElementById('editorForm').onsubmit = async function(e) {
  e.preventDefault();
  
  const pData = {
    name: document.getElementById('name').value,
    category: document.getElementById('category').value,
    price: parseInt(document.getElementById('price').value),
    stock: parseInt(document.getElementById('stock').value),
    badge: document.getElementById('badge').value,
    description: document.getElementById('desc').value,
    images: uploadedImages,
    updatedAt: serverTimestamp()
  };

  try {
    if (editingId) {
      await setDoc(doc(db, "products", editingId), pData, { merge: true });
      showToast("Inventory protected & updated.");
    } else {
      pData.createdAt = serverTimestamp();
      await addDoc(collection(db, "products"), pData);
      showToast("New masterpiece added to collection.");
    }
    
    setTimeout(() => window.location.href = 'dashboard.html', 1500);
  } catch (err) {
    console.error("Error saving product:", err);
    showToast("Failed to save changes", "error");
  }
};

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
