/**
 * newsletter.js — Secure MailerLite Integration for UJINN.RVN
 * -------------------------------------------------------
 * This file no longer stores the API key on the frontend!
 * It sends requests to Netlify Functions which hold the secrets securely.
 */

// ─── Subscribe from homepage form ────────────────────────────────────────────
window.subscribe = async function () {
  const input = document.getElementById('emailInput');
  const btn   = input?.closest('.newsletter-form')?.querySelector('button');
  const email = input?.value?.trim();

  // Basic validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    _nlToast('Please enter a valid email address.', 'error');
    input?.focus();
    return;
  }

  // Loading state
  const originalText = btn?.textContent || 'Subscribe';
  if (btn) { btn.textContent = 'Subscribing…'; btn.disabled = true; }

  try {
    const res = await fetch(`/.netlify/functions/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const body = await res.json().catch(() => ({}));

    if (res.ok || res.status === 200 || res.status === 201) {
      input.value = '';
      _nlToast('You\'re in! Welcome to the inner circle.', 'success');
    } else if (res.status === 422 && body?.errors?.email) {
      _nlToast('That email appears to already be subscribed.', 'info');
    } else {
      throw new Error(body?.message || `Status ${res.status}`);
    }
  } catch (err) {
    console.error('[Newsletter] Subscription error:', err);
    _nlToast('Something went wrong. Please try again.', 'error');
  } finally {
    if (btn) { btn.textContent = originalText; btn.disabled = false; }
  }
};

// ─── Internal toast helper (works with existing toast or standalone) ──────────
function _nlToast(msg, type = 'success') {
  const t      = document.getElementById('toast');
  const msgEl  = document.getElementById('toastMsg');
  const dot    = t?.querySelector('.toast-dot');

  const colours = { success: '#5cb85c', error: '#e74c3c', info: '#f0a500' };

  if (t && msgEl) {
    msgEl.textContent = msg;
    if (dot) dot.style.background = colours[type] || colours.success;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
  } else {
    // Fallback: floating banner
    let banner = document.getElementById('_nlBanner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = '_nlBanner';
      Object.assign(banner.style, {
        position: 'fixed', bottom: '28px', right: '28px',
        background: '#0d0c0b', color: '#f9f7f4',
        padding: '14px 22px', fontSize: '13px',
        fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.02em',
        zIndex: '9999', boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
        transition: 'opacity 0.35s, transform 0.35s',
        display: 'flex', gap: '10px', alignItems: 'center',
        opacity: '0', transform: 'translateY(20px)'
      });
      document.body.appendChild(banner);
    }
    banner.innerHTML = `<span style="width:7px;height:7px;border-radius:50%;background:${colours[type]};flex-shrink:0;display:inline-block;"></span>${msg}`;
    requestAnimationFrame(() => {
      banner.style.opacity = '1';
      banner.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(20px)';
    }, 3500);
  }
}

// Ensure global scope is clean
window.__ML = undefined;
