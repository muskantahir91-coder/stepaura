// Step Aura — shared shell (navbar, footer, cart, auth, toast)
const STORAGE = { CART: "stepaura_cart", USER: "stepaura_user" };

const Cart = {
  items() { try { return JSON.parse(localStorage.getItem(STORAGE.CART)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(STORAGE.CART, JSON.stringify(items)); updateCartCount(); },
  add(productId, qty = 1) {
    const items = Cart.items();
    const found = items.find(i => i.id === productId);
    if (found) found.qty += qty; else items.push({ id: productId, qty });
    Cart.save(items);
    showToast("Added to cart");
  },
  remove(productId) { Cart.save(Cart.items().filter(i => i.id !== productId)); },
  setQty(productId, qty) {
    const items = Cart.items();
    const it = items.find(i => i.id === productId);
    if (!it) return;
    it.qty = Math.max(1, qty);
    Cart.save(items);
  },
  clear() { Cart.save([]); },
  count() { return Cart.items().reduce((s, i) => s + i.qty, 0); },
  total() {
    return Cart.items().reduce((s, i) => {
      const p = PRODUCTS.find(p => p.id === i.id);
      return p ? s + p.price * i.qty : s;
    }, 0);
  }
};

const Auth = {
  user() { try { return JSON.parse(localStorage.getItem(STORAGE.USER)); } catch { return null; } },
  set(u) { localStorage.setItem(STORAGE.USER, JSON.stringify(u)); },
  logout() { localStorage.removeItem(STORAGE.USER); }
};

// Agar admin.html nahi khula toh isAdmin flag hata do
// Taake front page par Admin link show na ho
(function clearAdminIfNotOnAdminPage() {
  const isAdminPage = window.location.pathname.endsWith("admin.html");
  if (!isAdminPage) {
    const user = Auth.user();
    if (user && user.isAdmin) {
      // isAdmin hata do, baaki info rakhein
      delete user.isAdmin;
      Auth.set(user);
    }
  }
})();

function updateCartCount() {
  const el = document.querySelector(".cart-count");
  if (el) {
    const c = Cart.count();
    el.textContent = c;
    el.style.display = c > 0 ? "flex" : "none";
  }
}

function showToast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2200);
}

function renderNavbar(active = "") {
  const user = Auth.user();
  return `
  <nav class="navbar">
    <div class="nav-inner">
      <a href="index.html" class="brand" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#7c3aed"/>
              <stop offset="60%" stop-color="#8b5cf6"/>
              <stop offset="100%" stop-color="#6366f1"/>
            </linearGradient>
            <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#8b5cf6" flood-opacity="0.35"/>
            </filter>
          </defs>
          <!-- Rounded square background -->
          <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#lg1)" filter="url(#logoShadow)"/>
          <!-- Inner shine top -->
          <rect x="1" y="1" width="38" height="19" rx="11" fill="white" opacity="0.07"/>
          <!-- Letter S -->
          <text x="7" y="28" font-family="Georgia,serif" font-size="22" font-weight="700" fill="white" letter-spacing="-1">S</text>
          <!-- Letter A -->
          <text x="20" y="28" font-family="Georgia,serif" font-size="22" font-weight="700" fill="white" opacity="0.85" letter-spacing="-1">A</text>
          <!-- Underline accent -->
          <rect x="7" y="31" width="26" height="2.2" rx="1.1" fill="white" opacity="0.3"/>
        </svg>
        <span style="font-family:'Playfair Display',serif;font-size:21px;font-weight:800;letter-spacing:-0.01em;color:#8b5cf6;">Step<span style="color:#8b5cf6;">Aura</span></span>
      </a>
      <div class="nav-links" id="navLinks">
        ${user && user.isAdmin ? `<a href="admin.html" class="${active==='admin'?'active':''}" style="color:#8b5cf6;font-weight:700;">⚙ Admin</a>` : ''}
        <a href="index.html" class="${active==='home'?'active':''}">Home</a>
        <a href="shop.html" class="${active==='shop'?'active':''}">Shop</a>
        <a href="categories.html" class="${active==='categories'?'active':''}">Categories</a>
        <a href="about.html" class="${active==='about'?'active':''}">About</a>
        <a href="contact.html" class="${active==='contact'?'active':''}">Contact</a>
      </div>
      <div class="nav-actions">
        ${user
          ? `<a href="my-orders.html" class="nav-signin-btn" style="margin-right:8px;" title="My Orders">My Orders</a>
             <a href="#" id="logoutBtn" class="nav-user-btn" title="Logout">
               <span class="nav-user-avatar">${user.name.charAt(0).toUpperCase()}</span>
               <span class="nav-user-name">${user.name.split(' ')[0]}</span>
             </a>`
          : `<div class="nav-auth-group">
               <a href="auth.html" class="nav-signin-btn">Sign In</a>
               <a href="auth.html?tab=signup" class="nav-signup-btn">
                 <span>Sign Up</span>
               </a>
             </div>`}
        <a href="cart.html" class="cart-btn" title="Cart">
          🛍️ <span class="cart-count">0</span>
        </a>
        <button class="menu-toggle" id="menuToggle" aria-label="Menu">☰</button>
      </div>
    </div>
  </nav>`;
}

function renderFooter() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="lg2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#6366f1"/>
              </linearGradient></defs>
              <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#lg2)"/>
              <rect x="1" y="1" width="38" height="19" rx="11" fill="white" opacity="0.07"/>
              <text x="7" y="28" font-family="Georgia,serif" font-size="22" font-weight="700" fill="white" letter-spacing="-1">S</text>
              <text x="20" y="28" font-family="Georgia,serif" font-size="22" font-weight="700" fill="white" opacity="0.85" letter-spacing="-1">A</text>
              <rect x="7" y="31" width="26" height="2.2" rx="1.1" fill="white" opacity="0.3"/>
            </svg>
            <div class="brand" style="font-size:26px;">Step <span>Aura</span></div>
          </div>
          <p class="muted" style="margin-top:12px; max-width: 340px;">Premium shoes designed for the way you move. Step Into Style with Step Aura.</p>
          <div class="socials">
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="TikTok">🎵</a>
          </div>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><a href="shop.html">All Products</a></li>
            <li><a href="categories.html">Men</a></li>
            <li><a href="categories.html">Women</a></li>
            <li><a href="categories.html">Kids</a></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="about.html">About Us</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="auth.html">Sign In</a></li>
            <li><a href="cart.html">Cart</a></li>
          </ul>
        </div>
        <div>
          <h4>Newsletter</h4>
          <p class="muted" style="font-size:14px;">Get 10% off your first order.</p>
          <form class="newsletter" onsubmit="event.preventDefault(); showToast('Subscribed! Welcome to Step Aura'); this.reset();">
            <input type="email" required placeholder="Your email" />
            <button type="submit">Join</button>
          </form>
        </div>
      </div>
      <div class="copyright">© ${new Date().getFullYear()} Step Aura. All rights reserved.</div>
    </div>
  </footer>`;
}

function mountShell(active) {
  document.getElementById("navbar-mount").innerHTML = renderNavbar(active);
  document.getElementById("footer-mount").innerHTML = renderFooter();
  mountFloatingButtons();
  mountAccessibilityWidget();
  mountDisabilityWidget();
  updateCartCount();

  const toggle = document.getElementById("menuToggle");
  if (toggle) toggle.addEventListener("click", () => document.getElementById("navLinks").classList.toggle("open"));

  const logout = document.getElementById("logoutBtn");
  if (logout) logout.addEventListener("click", (e) => {
    e.preventDefault();
    Auth.logout();
    showToast("Signed out");
    setTimeout(() => location.reload(), 600);
  });
}

// ============= Floating WhatsApp + Scroll to Top buttons =============
function mountFloatingButtons() {
  if (document.getElementById("floating-actions")) return;

  // WhatsApp number — change this to your real business number (with country code, no +)
  const waNumber = "923001234567";
  const waMessage = encodeURIComponent("Hi Step Aura! I'd like to know more about your shoes.");

  const wrap = document.createElement("div");
  wrap.id = "floating-actions";
  wrap.innerHTML = `
    <a href="https://wa.me/${waNumber}?text=${waMessage}" target="_blank" rel="noopener"
       class="float-btn float-wa" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">
      <svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M19.11 17.31c-.27-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.36-1.62-1.52-1.89-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.54-.45-.47-.62-.48l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.99 2.67 1.13 2.85.14.18 1.95 2.98 4.73 4.18.66.28 1.18.45 1.58.58.66.21 1.27.18 1.74.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.12-.25-.18-.52-.32zM16.02 4C9.39 4 4 9.39 4 16.02c0 2.12.55 4.18 1.6 6L4 28l6.13-1.6a11.96 11.96 0 0 0 5.89 1.5h.01c6.62 0 12.01-5.39 12.01-12.02 0-3.21-1.25-6.23-3.52-8.5A11.94 11.94 0 0 0 16.02 4zm0 21.93h-.01a9.93 9.93 0 0 1-5.06-1.39l-.36-.21-3.64.95.97-3.55-.24-.37a9.93 9.93 0 0 1-1.52-5.34c0-5.49 4.47-9.96 9.97-9.96a9.9 9.9 0 0 1 7.04 2.92 9.9 9.9 0 0 1 2.92 7.05c0 5.5-4.47 9.97-9.97 9.97z"/>
      </svg>
    </a>
    <button type="button" class="float-btn float-top" id="scrollTopBtn"
            aria-label="Scroll to top" title="Scroll to top">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
           stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="6 15 12 9 18 15"></polyline>
      </svg>
    </button>
  `;
  document.body.appendChild(wrap);

  const topBtn = document.getElementById("scrollTopBtn");
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const onScroll = () => {
    if (window.scrollY > 300) topBtn.classList.add("visible");
    else topBtn.classList.remove("visible");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ============= Accessibility Widget =============
function mountAccessibilityWidget() {
  if (document.getElementById("a11y-widget")) return;

  // Load saved prefs
  const prefs = JSON.parse(localStorage.getItem("stepaura_a11y") || "{}");

  const widget = document.createElement("div");
  widget.id = "a11y-widget";
  widget.innerHTML = `
    <button class="a11y-toggle" id="a11yToggle" aria-label="Accessibility Options" title="Accessibility Options">
      ♿
    </button>
    <div class="a11y-panel" id="a11yPanel" role="dialog" aria-label="Accessibility Settings" aria-hidden="true">
      <div class="a11y-header">
        <span>♿ Accessibility</span>
        <button class="a11y-close" id="a11yClose" aria-label="Close">✕</button>
      </div>
      <div class="a11y-body">
        <div class="a11y-section-title">Text Size</div>
        <div class="a11y-row">
          <button class="a11y-btn" id="fontDec" aria-label="Decrease font size">A−</button>
          <button class="a11y-btn" id="fontReset" aria-label="Reset font size">A</button>
          <button class="a11y-btn" id="fontInc" aria-label="Increase font size">A+</button>
        </div>
        <div class="a11y-size-bar">
          <div class="a11y-size-track">
            <div class="a11y-size-fill" id="a11ySizeFill"></div>
          </div>
          <span class="a11y-size-label" id="a11ySizeLabel">100%</span>
        </div>
        <div class="a11y-section-title">Display</div>
        <div class="a11y-toggle-row">
          <span>High Contrast</span>
          <label class="a11y-switch" aria-label="Toggle high contrast">
            <input type="checkbox" id="toggleContrast" ${prefs.contrast ? "checked" : ""}>
            <span class="a11y-slider"></span>
          </label>
        </div>
        <div class="a11y-toggle-row">
          <span>Dyslexia Font</span>
          <label class="a11y-switch" aria-label="Toggle dyslexia-friendly font">
            <input type="checkbox" id="toggleDyslexia" ${prefs.dyslexia ? "checked" : ""}>
            <span class="a11y-slider"></span>
          </label>
        </div>
        <div class="a11y-toggle-row">
          <span>Highlight Links</span>
          <label class="a11y-switch" aria-label="Highlight all links">
            <input type="checkbox" id="toggleLinks" ${prefs.links ? "checked" : ""}>
            <span class="a11y-slider"></span>
          </label>
        </div>
        <div class="a11y-toggle-row">
          <span>Large Cursor</span>
          <label class="a11y-switch" aria-label="Toggle large cursor">
            <input type="checkbox" id="toggleCursor" ${prefs.cursor ? "checked" : ""}>
            <span class="a11y-slider"></span>
          </label>
        </div>
        <div class="a11y-toggle-row">
          <span>Stop Animations</span>
          <label class="a11y-switch" aria-label="Stop all animations">
            <input type="checkbox" id="toggleAnimate" ${prefs.animate ? "checked" : ""}>
            <span class="a11y-slider"></span>
          </label>
        </div>
        <button class="a11y-reset-all" id="a11yResetAll">Reset All Settings</button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  // State
  let fontSize = prefs.fontSize || 100; // percent
  const body = document.body;

  function savePrefs() {
    const p = {
      fontSize,
      contrast: document.getElementById("toggleContrast").checked,
      dyslexia: document.getElementById("toggleDyslexia").checked,
      links: document.getElementById("toggleLinks").checked,
      cursor: document.getElementById("toggleCursor").checked,
      animate: document.getElementById("toggleAnimate").checked,
    };
    localStorage.setItem("stepaura_a11y", JSON.stringify(p));
  }

  function applyFontSize() {
    document.documentElement.style.fontSize = fontSize + "%";
    const label = document.getElementById("a11ySizeLabel");
    const fill = document.getElementById("a11ySizeFill");
    if (label) label.textContent = fontSize + "%";
    if (fill) {
      // map 70-150 range to 0-100%
      const pct = ((fontSize - 70) / (150 - 70)) * 100;
      fill.style.width = pct + "%";
      fill.style.background = fontSize === 100 ? "#8b5cf6" : fontSize > 100 ? "#7c3aed" : "#6366f1";
    }
    // button states
    document.getElementById("fontDec").disabled = fontSize <= 70;
    document.getElementById("fontInc").disabled = fontSize >= 150;
    document.getElementById("fontReset").style.opacity = fontSize === 100 ? "0.4" : "1";
  }

  function applyAll() {
    applyFontSize();
    body.classList.toggle("a11y-contrast", document.getElementById("toggleContrast").checked);
    body.classList.toggle("a11y-dyslexia", document.getElementById("toggleDyslexia").checked);
    body.classList.toggle("a11y-links", document.getElementById("toggleLinks").checked);
    body.classList.toggle("a11y-cursor", document.getElementById("toggleCursor").checked);
    body.classList.toggle("a11y-no-animate", document.getElementById("toggleAnimate").checked);
  }

  // Apply on load
  applyAll();

  // Toggle panel
  const panel = document.getElementById("a11yPanel");
  document.getElementById("a11yToggle").addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    panel.setAttribute("aria-hidden", !open);
  });
  document.getElementById("a11yClose").addEventListener("click", () => {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
  });

  // Font size
  document.getElementById("fontInc").addEventListener("click", () => {
    if (fontSize < 150) { fontSize += 10; applyFontSize(); savePrefs(); }
  });
  document.getElementById("fontDec").addEventListener("click", () => {
    if (fontSize > 70) { fontSize -= 10; applyFontSize(); savePrefs(); }
  });
  document.getElementById("fontReset").addEventListener("click", () => {
    fontSize = 100; applyFontSize(); savePrefs();
  });

  // Toggles
  ["toggleContrast","toggleDyslexia","toggleLinks","toggleCursor","toggleAnimate"].forEach(id => {
    document.getElementById(id).addEventListener("change", () => { applyAll(); savePrefs(); });
  });

  // Reset all
  document.getElementById("a11yResetAll").addEventListener("click", () => {
    fontSize = 100;
    ["toggleContrast","toggleDyslexia","toggleLinks","toggleCursor","toggleAnimate"].forEach(id => {
      document.getElementById(id).checked = false;
    });
    applyAll();
    localStorage.removeItem("stepaura_a11y");
    showToast("Accessibility settings reset");
  });

  // Close panel when clicking outside
  document.addEventListener("click", (e) => {
    if (!widget.contains(e.target)) {
      panel.classList.remove("open");
      panel.setAttribute("aria-hidden", "true");
    }
  });
}

function productCardHTML(p) {
  return `
  <div class="product-card">
    <div class="product-img">
      ${p.discount ? `<span class="discount-badge">-${p.discount}%</span>` : ""}
      ${p.badge ? `<span class="product-tag">${p.badge}</span>` : ""}
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
    </div>
    <div class="product-info">
      <div class="cat">${p.category} · ${p.subcategory}</div>
      <h3>${p.name}</h3>
      <p class="desc">${p.description}</p>
      <div class="price-row">
        <span class="price">${formatPKR(p.price)}</span>
        ${p.oldPrice ? `<span class="old-price">${formatPKR(p.oldPrice)}</span>` : ""}
      </div>
    </div>
    <div class="card-actions">
      <button class="btn btn-outline" onclick="Cart.add('${p.id}')">Add to Cart</button>
      <button class="btn btn-accent" onclick="buyNow('${p.id}')">Buy Now</button>
    </div>
  </div>`;
}

function buyNow(id) {
  Cart.add(id, 1);
  setTimeout(() => location.href = "cart.html", 250);
}

// ============= Disability Support Widget (Alag / Separate) =============
function mountDisabilityWidget() {
  if (document.getElementById("dis-widget")) return;

  const prefs = JSON.parse(localStorage.getItem("stepaura_disability") || "{}");

  // ── Reading Guide Line element ──
  const guide = document.createElement("div");
  guide.id = "dis-reading-guide";
  guide.setAttribute("aria-hidden", "true");
  document.body.appendChild(guide);

  // ── Screen Reader Live Region ──
  const srLive = document.createElement("div");
  srLive.id = "dis-sr-live";
  srLive.setAttribute("aria-live", "assertive");
  srLive.setAttribute("aria-atomic", "true");
  srLive.className = "dis-sr-only";
  document.body.appendChild(srLive);

  function srAnnounce(msg) {
    srLive.textContent = "";
    requestAnimationFrame(() => { srLive.textContent = msg; });
  }

  // ── Build Widget HTML ──
  const widget = document.createElement("div");
  widget.id = "dis-widget";
  widget.innerHTML = `
    <button class="dis-toggle" id="disToggle"
            aria-label="Disability Support - Disabled users ke liye khaas features"
            title="Disability Support">
      <span class="dis-toggle-icon">♿</span>
      <span class="dis-toggle-label">Disability<br>Support</span>
    </button>

    <div class="dis-panel" id="disPanel" role="dialog"
         aria-label="Disability Support Settings" aria-hidden="true">

      <!-- Header -->
      <div class="dis-header">
        <div class="dis-header-left">
          <span class="dis-header-icon">♿</span>
          <div>
            <div class="dis-header-title">Disability Support</div>
            <div class="dis-header-sub">Aapki zaroorat ke mutabiq settings</div>
          </div>
        </div>
        <button class="dis-close" id="disClose" aria-label="Band karo">✕</button>
      </div>

      <!-- Tabs -->
      <div class="dis-tabs" role="tablist" aria-label="Disability type tabs">
        <button class="dis-tab active" data-tab="vision"   role="tab" aria-selected="true"  title="Aankhon ki takleef">👁️<br><span>Nazar</span></button>
        <button class="dis-tab"        data-tab="motor"    role="tab" aria-selected="false" title="Haath ya movement ki takleef">🦾<br><span>Harkat</span></button>
        <button class="dis-tab"        data-tab="cognitive"role="tab" aria-selected="false" title="Padhne / samajhne mein takleef">🧠<br><span>Samajh</span></button>
        <button class="dis-tab"        data-tab="voice"    role="tab" aria-selected="false" title="Awaaz se website chalao">🎙️<br><span>Awaaz</span></button>
      </div>

      <div class="dis-body">

        <!-- ── VISION TAB ── -->
        <div class="dis-tab-content active" id="dis-tab-vision">
          <div class="dis-info-box">
            <strong>👁️ Nazar Ki Takleef?</strong><br>
            Rang, size aur contrast apni marzi se set karein taake shopping asaan ho.
          </div>

          <div class="dis-section-title">Color Blind Mode</div>
          <div class="dis-cb-grid">
            <button class="dis-cb-btn ${prefs.colorBlind==='none'||!prefs.colorBlind?'active':''}" data-cb="none">
              <span class="dis-cb-swatch dis-cb-normal"></span>Normal
            </button>
            <button class="dis-cb-btn ${prefs.colorBlind==='protanopia'?'active':''}" data-cb="protanopia">
              <span class="dis-cb-swatch dis-cb-red"></span>Laal Andha
            </button>
            <button class="dis-cb-btn ${prefs.colorBlind==='deuteranopia'?'active':''}" data-cb="deuteranopia">
              <span class="dis-cb-swatch dis-cb-green"></span>Hara Andha
            </button>
            <button class="dis-cb-btn ${prefs.colorBlind==='tritanopia'?'active':''}" data-cb="tritanopia">
              <span class="dis-cb-swatch dis-cb-blue"></span>Neela Andha
            </button>
          </div>

          <div class="dis-section-title" style="margin-top:12px;">Brightness / Saturation</div>
          <div class="dis-slider-row">
            <label for="disBrightness">☀️ Brightness</label>
            <input type="range" id="disBrightness" min="60" max="140" value="${prefs.brightness||100}" aria-label="Brightness control">
            <span id="disBrightnessVal">${prefs.brightness||100}%</span>
          </div>
          <div class="dis-slider-row">
            <label for="disSaturation">🎨 Saturation</label>
            <input type="range" id="disSaturation" min="0" max="200" value="${prefs.saturation||100}" aria-label="Saturation control">
            <span id="disSaturationVal">${prefs.saturation||100}%</span>
          </div>

          <div class="dis-section-title" style="margin-top:12px;">Display</div>
          <div class="dis-toggle-row">
            <span>High Contrast Mode</span>
            <label class="dis-switch"><input type="checkbox" id="disContrast" ${prefs.contrast?'checked':''}><span class="dis-slider"></span></label>
          </div>
          <div class="dis-toggle-row">
            <span>Focus Ring (Keyboard use)</span>
            <label class="dis-switch"><input type="checkbox" id="disFocusRing" ${prefs.focusRing!==false?'checked':''}><span class="dis-slider"></span></label>
          </div>
          <div class="dis-toggle-row">
            <span>Image Alt Text Popup</span>
            <label class="dis-switch"><input type="checkbox" id="disAltText" ${prefs.altText?'checked':''}><span class="dis-slider"></span></label>
          </div>
        </div>

        <!-- ── MOTOR TAB ── -->
        <div class="dis-tab-content" id="dis-tab-motor">
          <div class="dis-info-box">
            <strong>🦾 Haath ya Harkat Ki Takleef?</strong><br>
            Mouse chalana mushkil ho — bade buttons, keyboard shortcuts aur slow hover mode.
          </div>

          <div class="dis-section-title">Click & Touch</div>
          <div class="dis-toggle-row">
            <span>Bade Buttons (Large Targets)</span>
            <label class="dis-switch"><input type="checkbox" id="disLargeTargets" ${prefs.largeTargets?'checked':''}><span class="dis-slider"></span></label>
          </div>
          <div class="dis-toggle-row">
            <span>Bara Cursor</span>
            <label class="dis-switch"><input type="checkbox" id="disCursor" ${prefs.cursor?'checked':''}><span class="dis-slider"></span></label>
          </div>
          <div class="dis-toggle-row">
            <span>Sab Animations Band Karo</span>
            <label class="dis-switch"><input type="checkbox" id="disNoAnimate" ${prefs.noAnimate?'checked':''}><span class="dis-slider"></span></label>
          </div>
          <div class="dis-toggle-row">
            <span>Sticky Navbar (Hamesha Upar)</span>
            <label class="dis-switch"><input type="checkbox" id="disStickyNav" ${prefs.stickyNav?'checked':''}><span class="dis-slider"></span></label>
          </div>

          <div class="dis-section-title" style="margin-top:12px;">⌨️ Keyboard Shortcuts</div>
          <div class="dis-shortcuts">
            <div class="dis-sc-row"><kbd>Alt + H</kbd><span>Home page</span></div>
            <div class="dis-sc-row"><kbd>Alt + S</kbd><span>Shop page</span></div>
            <div class="dis-sc-row"><kbd>Alt + C</kbd><span>Cart kholo</span></div>
            <div class="dis-sc-row"><kbd>Alt + A</kbd><span>About page</span></div>
            <div class="dis-sc-row"><kbd>Tab</kbd><span>Agla element</span></div>
            <div class="dis-sc-row"><kbd>Enter / Space</kbd><span>Select karo</span></div>
          </div>
          <div class="dis-toggle-row" style="margin-top:8px;">
            <span>Keyboard Shortcuts Enable</span>
            <label class="dis-switch"><input type="checkbox" id="disKeyboard" ${prefs.keyboard!==false?'checked':''}><span class="dis-slider"></span></label>
          </div>
        </div>

        <!-- ── COGNITIVE TAB ── -->
        <div class="dis-tab-content" id="dis-tab-cognitive">
          <div class="dis-info-box">
            <strong>🧠 Padhne / Samajhne Mein Takleef?</strong><br>
            Reading guide, dyslexia font aur simple mode — sab kuch aasaan ho jayega.
          </div>

          <div class="dis-section-title">Reading Aids</div>
          <div class="dis-toggle-row">
            <span>Dyslexia Friendly Font</span>
            <label class="dis-switch"><input type="checkbox" id="disDyslexia" ${prefs.dyslexia?'checked':''}><span class="dis-slider"></span></label>
          </div>
          <div class="dis-toggle-row">
            <span>Reading Guide Line</span>
            <label class="dis-switch"><input type="checkbox" id="disReadingGuide" ${prefs.readingGuide?'checked':''}><span class="dis-slider"></span></label>
          </div>
          <div class="dis-toggle-row">
            <span>Links Highlight Karo</span>
            <label class="dis-switch"><input type="checkbox" id="disLinks" ${prefs.links?'checked':''}><span class="dis-slider"></span></label>
          </div>

          <div class="dis-section-title" style="margin-top:12px;">Line Height (Darmiyan faasla)</div>
          <div class="dis-slider-row">
            <label for="disLineHeight">📏 Line Height</label>
            <input type="range" id="disLineHeight" min="1" max="3" step="0.1" value="${prefs.lineHeight||1.6}" aria-label="Line height control">
            <span id="disLineHeightVal">${prefs.lineHeight||1.6}x</span>
          </div>

          <div class="dis-section-title" style="margin-top:12px;">Hearing Impaired (Behre logon ke liye)</div>
          <div class="dis-toggle-row">
            <span>Visual Flash Alerts</span>
            <label class="dis-switch"><input type="checkbox" id="disFlash" ${prefs.flash?'checked':''}><span class="dis-slider"></span></label>
          </div>
          <div class="dis-toggle-row">
            <span>Zyada Der Notifications</span>
            <label class="dis-switch"><input type="checkbox" id="disLongToast" ${prefs.longToast?'checked':''}><span class="dis-slider"></span></label>
          </div>
          <a href="contact.html" class="dis-contact-link" aria-label="WhatsApp se contact karein - call ki zaroorat nahi">
            💬 WhatsApp Order (Call Ki Zaroorat Nahi)
          </a>
        </div>

        <!-- ── VOICE TAB ── -->
        <div class="dis-tab-content" id="dis-tab-voice">
          <div class="dis-info-box">
            <strong>🎙️ Awaaz Se Chalao!</strong><br>
            Haath nahi chalte? Sirf bolo aur website chale gi. Urdu / English dono chalte hain.
          </div>

          <div class="dis-section-title">Voice Commands (Jo bol sakte hain)</div>
          <div class="dis-vc-list">
            <div class="dis-vc-row"><span class="dis-vc-cmd">"Home" / "Ghar"</span><span>→ Main Page</span></div>
            <div class="dis-vc-row"><span class="dis-vc-cmd">"Shop" / "Khareedna"</span><span>→ Shop Page</span></div>
            <div class="dis-vc-row"><span class="dis-vc-cmd">"Cart" / "Tokri"</span><span>→ Cart Kholo</span></div>
            <div class="dis-vc-row"><span class="dis-vc-cmd">"Categories"</span><span>→ Categories</span></div>
            <div class="dis-vc-row"><span class="dis-vc-cmd">"Contact" / "Rabta"</span><span>→ Contact</span></div>
            <div class="dis-vc-row"><span class="dis-vc-cmd">"Upar" / "Top"</span><span>→ Page Top</span></div>
            <div class="dis-vc-row"><span class="dis-vc-cmd">"Neeche" / "Scroll"</span><span>→ Neeche jao</span></div>
            <div class="dis-vc-row"><span class="dis-vc-cmd">"Bada Karo"</span><span>→ Text bara</span></div>
            <div class="dis-vc-row"><span class="dis-vc-cmd">"Chota Karo"</span><span>→ Text chota</span></div>
          </div>

          <button class="dis-voice-btn" id="disVoiceBtn" aria-label="Awaaz Navigation shuru / band karo">
            <span id="disVoiceIcon">🎙️</span>
            <span id="disVoiceLabel">Awaaz Navigation Shuru Karo</span>
          </button>
          <div class="dis-voice-status" id="disVoiceStatus" aria-live="polite" role="status"></div>

          <div class="dis-section-title" style="margin-top:12px;">Screen Reader</div>
          <div class="dis-toggle-row">
            <span>Page Zor Se Padho (TTS)</span>
            <label class="dis-switch"><input type="checkbox" id="disScreenReader" ${prefs.screenReader?'checked':''}><span class="dis-slider"></span></label>
          </div>
          <div class="dis-toggle-row">
            <span>Cart Change Announce Karo</span>
            <label class="dis-switch"><input type="checkbox" id="disAnnounceCart" ${prefs.announceCart?'checked':''}><span class="dis-slider"></span></label>
          </div>
        </div>

      </div><!-- end dis-body -->

      <div class="dis-footer">
        <button class="dis-reset-btn" id="disResetAll">↺ Sab Reset Karo</button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  // ─────────────────────────────────────────
  // State & helpers
  // ─────────────────────────────────────────
  const body = document.body;
  let voiceActive = false;
  let recognition = null;
  let ttsEnabled = false;

  function getCheck(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
  }

  function savePrefs() {
    const p = {
      colorBlind:   document.querySelector(".dis-cb-btn.active")?.dataset.cb || "none",
      brightness:   +document.getElementById("disBrightness").value,
      saturation:   +document.getElementById("disSaturation").value,
      lineHeight:   +document.getElementById("disLineHeight").value,
      contrast:     getCheck("disContrast"),
      focusRing:    getCheck("disFocusRing"),
      altText:      getCheck("disAltText"),
      largeTargets: getCheck("disLargeTargets"),
      cursor:       getCheck("disCursor"),
      noAnimate:    getCheck("disNoAnimate"),
      stickyNav:    getCheck("disStickyNav"),
      keyboard:     getCheck("disKeyboard"),
      dyslexia:     getCheck("disDyslexia"),
      readingGuide: getCheck("disReadingGuide"),
      links:        getCheck("disLinks"),
      flash:        getCheck("disFlash"),
      longToast:    getCheck("disLongToast"),
      screenReader: getCheck("disScreenReader"),
      announceCart: getCheck("disAnnounceCart"),
    };
    localStorage.setItem("stepaura_disability", JSON.stringify(p));
  }

  function applyColorBlind(mode) {
    body.classList.remove("dis-cb-protanopia","dis-cb-deuteranopia","dis-cb-tritanopia");
    if (mode && mode !== "none") body.classList.add("dis-cb-" + mode);
  }

  function applyFilter() {
    const br = document.getElementById("disBrightness").value;
    const st = document.getElementById("disSaturation").value;
    const lh = document.getElementById("disLineHeight").value;
    document.documentElement.style.setProperty("--dis-brightness", br + "%");
    document.documentElement.style.setProperty("--dis-saturation", st + "%");
    document.documentElement.style.setProperty("--dis-lineheight", lh);
    document.getElementById("disBrightnessVal").textContent = br + "%";
    document.getElementById("disSaturationVal").textContent = st + "%";
    document.getElementById("disLineHeightVal").textContent = (+lh).toFixed(1) + "x";
  }

  function applyAll() {
    const cbMode = document.querySelector(".dis-cb-btn.active")?.dataset.cb || "none";
    applyColorBlind(cbMode);
    applyFilter();
    body.classList.toggle("dis-high-contrast",  getCheck("disContrast"));
    body.classList.toggle("dis-focus-ring",      getCheck("disFocusRing"));
    body.classList.toggle("dis-alt-text",        getCheck("disAltText"));
    body.classList.toggle("dis-large-targets",   getCheck("disLargeTargets"));
    body.classList.toggle("dis-big-cursor",      getCheck("disCursor"));
    body.classList.toggle("dis-no-animate",      getCheck("disNoAnimate"));
    body.classList.toggle("dis-sticky-nav",      getCheck("disStickyNav"));
    body.classList.toggle("dis-dyslexia",        getCheck("disDyslexia"));
    body.classList.toggle("dis-reading-guide",   getCheck("disReadingGuide"));
    body.classList.toggle("dis-links",           getCheck("disLinks"));
    body.classList.toggle("dis-filter-active",   true);
    ttsEnabled = getCheck("disScreenReader");
  }

  // ── Reading guide mouse follow ──
  document.addEventListener("mousemove", (e) => {
    if (body.classList.contains("dis-reading-guide")) {
      guide.style.top = (e.clientY - 14) + "px";
      guide.style.display = "block";
    } else {
      guide.style.display = "none";
    }
  });

  // ── Alt text popup on hover ──
  document.addEventListener("mouseover", (e) => {
    if (!body.classList.contains("dis-alt-text")) return;
    if (e.target.tagName === "IMG" && e.target.alt) {
      let tip = document.getElementById("dis-alt-tip");
      if (!tip) {
        tip = document.createElement("div");
        tip.id = "dis-alt-tip";
        document.body.appendChild(tip);
      }
      tip.textContent = "📷 " + e.target.alt;
      tip.style.display = "block";
      tip.style.top = (e.pageY + 12) + "px";
      tip.style.left = (e.pageX + 12) + "px";
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.tagName === "IMG") {
      const tip = document.getElementById("dis-alt-tip");
      if (tip) tip.style.display = "none";
    }
  });

  // ── TTS on click ──
  document.addEventListener("click", (e) => {
    if (!ttsEnabled) return;
    const el = e.target.closest("h1,h2,h3,p,.price,.product-info,.btn");
    if (el && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(el.innerText || el.textContent);
      utt.lang = "ur-PK";
      utt.rate = 0.9;
      window.speechSynthesis.speak(utt);
    }
  });

  // ── Apply saved prefs on load ──
  applyAll();

  // ── Tab switching ──
  document.querySelectorAll(".dis-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".dis-tab").forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected","false"); });
      document.querySelectorAll(".dis-tab-content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      tab.setAttribute("aria-selected","true");
      const c = document.getElementById("dis-tab-" + tab.dataset.tab);
      if (c) c.classList.add("active");
    });
  });

  // ── Panel toggle ──
  const panel = document.getElementById("disPanel");
  document.getElementById("disToggle").addEventListener("click", (e) => {
    e.stopPropagation();
    const open = panel.classList.toggle("open");
    panel.setAttribute("aria-hidden", String(!open));
  });
  document.getElementById("disClose").addEventListener("click", () => {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden","true");
  });
  document.addEventListener("click", (e) => {
    if (!widget.contains(e.target)) {
      panel.classList.remove("open");
      panel.setAttribute("aria-hidden","true");
    }
  });

  // ── Color blind buttons ──
  document.querySelectorAll(".dis-cb-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".dis-cb-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyColorBlind(btn.dataset.cb);
      savePrefs();
    });
  });

  // ── Sliders ──
  ["disBrightness","disSaturation","disLineHeight"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => { applyFilter(); savePrefs(); });
  });

  // ── Checkboxes ──
  ["disContrast","disFocusRing","disAltText","disLargeTargets","disCursor","disNoAnimate",
   "disStickyNav","disKeyboard","disDyslexia","disReadingGuide","disLinks","disFlash",
   "disLongToast","disScreenReader","disAnnounceCart"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", () => { applyAll(); savePrefs(); });
  });

  // ── Keyboard shortcuts ──
  document.addEventListener("keydown", (e) => {
    if (!getCheck("disKeyboard") || !e.altKey) return;
    const map = { h: "index.html", s: "shop.html", c: "cart.html", a: "about.html" };
    if (map[e.key]) { e.preventDefault(); location.href = map[e.key]; }
  });

  // ── Voice Navigation ──
  const voiceBtn  = document.getElementById("disVoiceBtn");
  const voiceStat = document.getElementById("disVoiceStatus");
  const voiceIcon = document.getElementById("disVoiceIcon");
  const voiceLbl  = document.getElementById("disVoiceLabel");

  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = "ur-PK";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const cmd = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();
      voiceStat.textContent = "🎙️ Suna: " + cmd;

      if (cmd.includes("home") || cmd.includes("ghar") || cmd.includes("main"))
        location.href = "index.html";
      else if (cmd.includes("shop") || cmd.includes("khareed") || cmd.includes("dukan"))
        location.href = "shop.html";
      else if (cmd.includes("cart") || cmd.includes("tokri") || cmd.includes("basket"))
        location.href = "cart.html";
      else if (cmd.includes("categor"))
        location.href = "categories.html";
      else if (cmd.includes("contact") || cmd.includes("rabta"))
        location.href = "contact.html";
      else if (cmd.includes("about") || cmd.includes("barey"))
        location.href = "about.html";
      else if (cmd.includes("upar") || cmd.includes("top") || cmd.includes("wapis"))
        window.scrollTo({ top: 0, behavior: "smooth" });
      else if (cmd.includes("neeche") || cmd.includes("scroll") || cmd.includes("neechay"))
        window.scrollBy({ top: 400, behavior: "smooth" });
      else if (cmd.includes("bada") || cmd.includes("bara") || cmd.includes("zoom in")) {
        const cur = parseFloat(document.documentElement.style.fontSize || "100");
        document.documentElement.style.fontSize = Math.min(cur + 10, 150) + "%";
        voiceStat.textContent = "✅ Text bara kar diya";
      } else if (cmd.includes("chota") || cmd.includes("zoom out")) {
        const cur = parseFloat(document.documentElement.style.fontSize || "100");
        document.documentElement.style.fontSize = Math.max(cur - 10, 70) + "%";
        voiceStat.textContent = "✅ Text chota kar diya";
      } else {
        voiceStat.textContent = "❓ Samajh nahi aya: \"" + cmd + "\" — dobara bolein";
      }
    };

    recognition.onerror = () => {
      voiceStat.textContent = "⚠️ Mic error — dobara koshish karein";
      voiceActive = false;
      voiceBtn.classList.remove("dis-voice-listening");
      voiceIcon.textContent = "🎙️";
      voiceLbl.textContent = "Awaaz Navigation Shuru Karo";
    };

    recognition.onend = () => {
      if (voiceActive) recognition.start();
    };

    voiceBtn.addEventListener("click", () => {
      voiceActive = !voiceActive;
      if (voiceActive) {
        recognition.start();
        voiceBtn.classList.add("dis-voice-listening");
        voiceIcon.textContent = "⏹️";
        voiceLbl.textContent = "Sun Raha Hun... (Band karne ke liye click karein)";
        voiceStat.textContent = "🟢 Bolein — mein sun raha hun";
        srAnnounce("Voice navigation shuru ho gaya. Bolein mein sun raha hun.");
      } else {
        recognition.stop();
        voiceBtn.classList.remove("dis-voice-listening");
        voiceIcon.textContent = "🎙️";
        voiceLbl.textContent = "Awaaz Navigation Shuru Karo";
        voiceStat.textContent = "🔴 Voice Navigation band";
      }
    });
  } else {
    voiceBtn.textContent = "⚠️ Yeh browser voice support nahi karta";
    voiceBtn.disabled = true;
  }

  // ── Flash alert for hearing impaired ──
  const origShowToast = window.showToast;
  window.showToast = function(msg) {
    if (typeof origShowToast === "function") origShowToast(msg);
    if (getCheck("disFlash")) {
      body.style.transition = "background 0.1s";
      body.style.background = "#fff";
      setTimeout(() => { body.style.background = ""; }, 200);
    }
    if (getCheck("disLongToast")) {
      const t = document.querySelector(".toast");
      if (t) {
        clearTimeout(t._timer);
        t._timer = setTimeout(() => t.classList.remove("show"), 5000);
      }
    }
    if (getCheck("disAnnounceCart") && msg.toLowerCase().includes("cart")) {
      srAnnounce(msg);
    }
  };

  // ── Reset all ──
  document.getElementById("disResetAll").addEventListener("click", () => {
    document.querySelectorAll(".dis-cb-btn").forEach(b => b.classList.remove("active"));
    document.querySelector("[data-cb='none']")?.classList.add("active");
    document.getElementById("disBrightness").value  = 100;
    document.getElementById("disSaturation").value  = 100;
    document.getElementById("disLineHeight").value   = 1.6;
    ["disContrast","disAltText","disLargeTargets","disCursor","disNoAnimate",
     "disStickyNav","disDyslexia","disReadingGuide","disLinks","disFlash",
     "disLongToast","disScreenReader","disAnnounceCart"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });
    const fRing = document.getElementById("disFocusRing");
    if (fRing) fRing.checked = true;
    const kb = document.getElementById("disKeyboard");
    if (kb) kb.checked = true;
    if (voiceActive && recognition) { recognition.stop(); voiceActive = false; }
    voiceBtn.classList.remove("dis-voice-listening");
    voiceIcon.textContent = "🎙️";
    voiceLbl.textContent = "Awaaz Navigation Shuru Karo";
    voiceStat.textContent = "";
    applyAll();
    localStorage.removeItem("stepaura_disability");
    showToast("Disability support settings reset ho gayi hain");
  });
}
