
import { auth } from "../../../assets/js/firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// Check if already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    sessionStorage.setItem('adminLoggedIn', 'true'); // For legacy checkAuth support if needed
    window.location.href = 'pages/dashboard.html';
  }
});

window.handleLogin = async function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const btn = event.target.querySelector('button');
  const originalText = btn.textContent;

  try {
    btn.textContent = 'Authenticating...';
    btn.disabled = true;
    
    await signInWithEmailAndPassword(auth, email, password);
    sessionStorage.setItem('adminLoggedIn', 'true');
    window.location.href = 'pages/dashboard.html';
  } catch (error) {
    console.error("Login error:", error);
    alert("Authentication failed: " + error.message);
    btn.textContent = originalText;
    btn.disabled = false;
  }
};
