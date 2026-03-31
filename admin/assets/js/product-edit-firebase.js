
import { db, auth } from "../../../assets/js/firebase-config.js";
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
  } else if (user) {
    if (editingId) {
      loadProductData();
    } else {
      // Hide loader immediately for new item
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
    }
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
      document.getElementById('colors').value = (p.colors || []).join(', ');
      document.getElementById('sizes').value = (p.sizes || []).join(', ');
      document.getElementById('colorNotes').value = p.colorNotes || '';
      uploadedImages = p.images || [];
      renderImages();
    }
  } catch (err) {
    console.error("Error loading product:", err);
  } finally {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
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
      
      // Auto-suggest color if first image and colors input is empty
      const colorsInput = document.getElementById('colors');
      if (uploadedImages.length === 1 && !colorsInput.value.trim()) {
        try {
          const sampledColor = await extractDominantColor(url);
          if (sampledColor) colorsInput.value = sampledColor;
        } catch (colorErr) {
          console.warn("Color sampling bypassed:", colorErr);
        }
      }
      
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
    colors: document.getElementById('colors').value.split(',').map(s => s.trim()).filter(s => s),
    sizes: document.getElementById('sizes').value.split(',').map(s => s.trim()).filter(s => s),
    colorNotes: document.getElementById('colorNotes').value.trim(),
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
