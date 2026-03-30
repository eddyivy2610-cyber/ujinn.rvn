
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

// CLOUDINARY CONFIGURATION
const CLOUDINARY_CLOUD_NAME = "ddscfcopu"; 
const CLOUDINARY_UPLOAD_PRESET = "ujinn123";

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
      document.getElementById('editorSubtitle').textContent = `Editing Collection Item`;
      document.getElementById('name').value = p.name || '';
      document.getElementById('category').value = p.category || 'tops';
      document.getElementById('price').value = p.price || 0;
      document.getElementById('stock').value = p.stock || 0;
      document.getElementById('badge').value = p.badge || '';
      document.getElementById('desc').value = p.description || '';
      uploadedImages = p.images || [];
      renderImages();
    }
  } catch (err) {
    console.error("Error loading product:", err);
  }
}

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData
  });
  
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.secure_url;
}

window.triggerUpload = function() {
  document.getElementById('fileInput').click();
};

window.handleFileUpload = async function(e) {
  const files = Array.from(e.target.files);
  const statusEl = document.getElementById('editorSubtitle');
  const originalText = statusEl.textContent;

  for (const file of files) {
    try {
      statusEl.textContent = "Processing image...";
      const url = await uploadToCloudinary(file);
      uploadedImages.push(url);
      renderImages();
    } catch (err) {
      console.error(err);
      alert("Failed to upload one or more images. Check Cloudinary config.");
    }
  }
  statusEl.textContent = originalText;
};

window.renderImages = function() {
  const grid = document.getElementById('imageGrid');
  const addBox = grid.querySelector('.upload-box');
  if (!grid || !addBox) return;

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
  
  if (CLOUDINARY_CLOUD_NAME === "your_cloud_name") {
      alert("Please enter your Cloudinary Cloud Name in the JS file.");
      return;
  }

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
    } else {
      pData.createdAt = serverTimestamp();
      await addDoc(collection(db, "products"), pData);
    }
    window.location.href = 'dashboard.html';
  } catch (err) {
    console.error("Error saving product:", err);
    alert("Failed to save product.");
  }
};
