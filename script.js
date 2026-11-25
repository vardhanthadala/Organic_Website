
const menuToggle=document.getElementById('menuToggle');
const navLinks=document.getElementById('navLinks');
if(menuToggle && navLinks){
  menuToggle.addEventListener('click',()=>{
    navLinks.classList.toggle('open');
    menuToggle.textContent=navLinks.classList.contains('open')?'×':'☰';
  });
  navLinks.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    navLinks.classList.remove('open');menuToggle.textContent='☰';
  }));
}

const cartCount = document.getElementById('cartCount');
const toast = document.getElementById('toast');
let toastTimer;

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

let cartItems = [];
try {
  cartItems = JSON.parse(localStorage.getItem('vf_cart') || '[]');
} catch (e) {
  cartItems = [];
}

const cartOverlay = document.createElement('div');
cartOverlay.className = 'cart-overlay';
const cartDrawer = document.createElement('aside');
cartDrawer.className = 'cart-drawer';
cartDrawer.setAttribute('aria-label', 'Shopping Cart');
cartDrawer.innerHTML = `
  <div class="cart-header">
    <h3>Your Cart</h3>
    <button class="cart-close" id="cartClose" aria-label="Close cart">×</button>
  </div>
  <div class="cart-items" id="cartItemsList"></div>
  <div class="cart-footer" id="cartFooter">
    <div class="cart-total-row"><span>Subtotal</span><span id="cartSubtotal">₹0</span></div>
    <button class="btn" id="checkoutBtn">Proceed to Checkout <span class="btn-arrow">→</span></button>
  </div>
`;
document.body.appendChild(cartOverlay);
document.body.appendChild(cartDrawer);

function saveAndRenderCart() {
  localStorage.setItem('vf_cart', JSON.stringify(cartItems));
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  if (cartCount) cartCount.textContent = totalQty;

  const list = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');
  const footer = document.getElementById('cartFooter');
  if (!list) return;

  if (!cartItems.length) {
    list.innerHTML = '<p class="cart-empty">Your cart is empty. Explore our natural soil &amp; cow-dung essentials!</p>';
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;

  list.innerHTML = cartItems.map((item, idx) => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span>₹${item.price} · ${item.desc}</span>
        <div class="cart-qty">
          <button type="button" data-qty="-1" data-idx="${idx}" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button type="button" data-qty="1" data-idx="${idx}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button type="button" class="cart-remove" data-remove="${idx}" aria-label="Remove item">×</button>
    </div>
  `).join('');
}

function openCart() {
  cartOverlay.classList.add('open');
  cartDrawer.classList.add('open');
}

function closeCart() {
  cartOverlay.classList.remove('open');
  cartDrawer.classList.remove('open');
}

cartOverlay.addEventListener('click', closeCart);
document.getElementById('cartClose').addEventListener('click', closeCart);

document.getElementById('cartItemsList').addEventListener('click', (e) => {
  const qtyBtn = e.target.closest('[data-qty]');
  const remBtn = e.target.closest('[data-remove]');
  if (qtyBtn) {
    const idx = Number(qtyBtn.dataset.idx);
    const delta = Number(qtyBtn.dataset.qty);
    cartItems[idx].qty += delta;
    if (cartItems[idx].qty <= 0) cartItems.splice(idx, 1);
    saveAndRenderCart();
  } else if (remBtn) {
    const idx = Number(remBtn.dataset.remove);
    cartItems.splice(idx, 1);
    saveAndRenderCart();
  }
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (!cartItems.length) {
    showToast('Your cart is empty.');
    return;
  }
  closeCart();
  window.location.href = 'contact.html?checkout=1';
});

document.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.product');
  if (!card) return;
  const name = card.querySelector('h3')?.textContent.trim() || 'Organic Product';
  const desc = card.querySelector('.product-info p')?.textContent.trim() || '';
  const priceText = card.querySelector('.product-price')?.textContent || '0';
  const price = parseInt(priceText.replace(/[^\d]/g, ''), 10) || 0;
  const img = card.querySelector('img')?.src || '';

  const existing = cartItems.find(i => i.name === name);
  if (existing) existing.qty += 1;
  else cartItems.push({ name, desc, price, img, qty: 1 });

  saveAndRenderCart();
  showToast(`${name} added to your cart`);
  openCart();
}));

const cartBtn = document.getElementById('cartBtn');
if (cartBtn) cartBtn.addEventListener('click', openCart);

saveAndRenderCart();
const searchBtn=document.getElementById('searchBtn');
if(searchBtn) searchBtn.addEventListener('click',()=>{
  const term=prompt('Search organic products:');
  if(term) {const found=[...document.querySelectorAll('.product')].find(p=>p.textContent.toLowerCase().includes(term.toLowerCase())); 
    if(found){found.scrollIntoView({behavior:'smooth',block:'center'});found.style.outline='2px solid #78904f';setTimeout(()=>found.style.outline='',1800);}
    else {toast.textContent='No matching product in this demo.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200);}
  }
});
const subscribeForm=document.getElementById('subscribeForm');
if(subscribeForm) subscribeForm.addEventListener('submit',e=>{
  e.preventDefault();toast.textContent='Thank you for subscribing!';toast.classList.add('show');
  e.target.reset();setTimeout(()=>toast.classList.remove('show'),2600);
});
const storyButton=document.getElementById('storyPlay'); if(storyButton) storyButton.addEventListener('click',()=>{
  toast.textContent='Our story video can be connected here.';toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),2500);
});
const scrollTargets = document.querySelectorAll('.reveal, .benefit, .category, .product, .info-card, .principle-card, .faq-card, .story-image, .story-copy, .process, .process-list li, .quote-card, .newsletter, .contact-form');
scrollTargets.forEach((el) => {
  el.classList.add('reveal');
  if (el.matches('.process-list li')) {
    const idx = [...el.parentElement.children].indexOf(el);
    el.style.transitionDelay = `${150 + idx * 180}ms`;
    return;
  }
  const siblings = el.parentElement ? [...el.parentElement.children].filter(c => c.classList && (c.classList.contains('reveal') || c.matches('.benefit, .category, .product, .info-card, .principle-card, .faq-card'))) : [];
  const idx = siblings.indexOf(el);
  if (idx > 0 && idx < 6) el.style.transitionDelay = `${idx * 70}ms`;
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  scrollTargets.forEach(el => observer.observe(el));
} else {
  scrollTargets.forEach(el => el.classList.add('visible'));
}

const storyHeroVideo = document.getElementById('storyHeroVideo');
if (storyHeroVideo) {
  storyHeroVideo.muted = true;
  storyHeroVideo.defaultMuted = true;
  storyHeroVideo.volume = 0;
  const playlist = ['assets/videos/clip-1.mp4', 'assets/videos/clip-2.mp4', 'assets/videos/clip-3.mp4'];
  let currentClip = 0;
  let isTransitioning = false;

  const switchClip = () => {
    if (isTransitioning) return;
    isTransitioning = true;
    storyHeroVideo.classList.add('is-fading');
    setTimeout(() => {
      currentClip = (currentClip + 1) % playlist.length;
      storyHeroVideo.src = playlist[currentClip];
      storyHeroVideo.muted = true;
      storyHeroVideo.volume = 0;
      storyHeroVideo.load();
      storyHeroVideo.play().then(() => {
        storyHeroVideo.classList.remove('is-fading');
        isTransitioning = false;
      }).catch(() => {
        storyHeroVideo.classList.remove('is-fading');
        isTransitioning = false;
      });
    }, 420);
  };

  storyHeroVideo.addEventListener('timeupdate', () => {
    if (storyHeroVideo.duration && storyHeroVideo.currentTime >= storyHeroVideo.duration - 0.45) {
      switchClip();
    }
  });
  storyHeroVideo.addEventListener('ended', switchClip);
}

const statItems = document.querySelectorAll('.story-stats .stat-item h3');
if (statItems.length && 'IntersectionObserver' in window) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const match = raw.match(/^(\d+)(.*)$/);
      if (match) {
        const target = parseInt(match[1], 10);
        const suffix = match[2];
        const duration = 1200;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
      statsObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  statItems.forEach(el => statsObserver.observe(el));
}

if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.faq-card').forEach(card => {
    card.addEventListener('mouseenter', () => { card.open = true; });
    card.addEventListener('mouseleave', () => { card.open = false; });
  });
}

document.querySelectorAll('.fa-stage').forEach(stage => {
  const items = [...stage.querySelectorAll('.fa-item')];
  const imgs = [...stage.querySelectorAll('.fa-panel-right img')];

  imgs.forEach(img => {
    const preload = new Image();
    preload.src = img.src;
  });

  const activate = (idx) => {
    items.forEach((it, i) => it.classList.toggle('open', i === idx));
    imgs.forEach((img, i) => img.classList.toggle('active', i === idx));
  };

  items.forEach((item, idx) => {
    item.addEventListener('mouseenter', () => activate(idx));
    const btn = item.querySelector('.fa-row');
    if (btn) {
      btn.addEventListener('click', () => activate(idx));
    }
  });
});

document.querySelectorAll('img:not(.hero-photo img)').forEach(img => {
  if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
});

const cf = document.getElementById('contactForm');
if (cf) {
  const msgField = document.getElementById('contactMessage');
  const titleEl = document.getElementById('contactFormTitle');
  const submitBtn = document.getElementById('contactSubmitBtn');
  if (cartItems.length > 0 && msgField) {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const lines = cartItems.map(item => `• ${item.name} × ${item.qty} = ₹${item.price * item.qty}`);
    msgField.value = `Order Summary:\n${lines.join('\n')}\n\nSubtotal: ₹${subtotal}`;
    if (titleEl) titleEl.textContent = 'Complete Your Order';
    if (submitBtn) submitBtn.innerHTML = 'Place Order <span class="btn-arrow">→</span>';
    if (window.location.search.includes('checkout=1')) {
      cf.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  cf.addEventListener('submit', e => {
    e.preventDefault();
    if (!cf.checkValidity()) {
      cf.reportValidity();
      return;
    }
    const isOrder = cartItems.length > 0;
    showToast(isOrder ? 'Order submitted! We will contact you shortly.' : 'Thank you! Your message has been sent.');
    if (isOrder) {
      cartItems = [];
      saveAndRenderCart();
    }
    cf.reset();
    if (titleEl) titleEl.textContent = 'Send a Message';
    if (submitBtn) submitBtn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';
  });
}

document.querySelectorAll('.fa-stage').forEach(stage => {
  const items = [...stage.querySelectorAll('.fa-item')];
  const imgs = [...stage.querySelectorAll('.fa-panel-right img')];

  imgs.forEach(img => {
    const preload = new Image();
    preload.src = img.src;
  });

  const activate = (idx) => {
    items.forEach((it, i) => it.classList.toggle('open', i === idx));
    imgs.forEach((img, i) => img.classList.toggle('active', i === idx));
  };

  items.forEach((item, idx) => {
    item.addEventListener('mouseenter', () => activate(idx));
    const btn = item.querySelector('.fa-row');
    if (btn) {
      btn.addEventListener('click', () => activate(idx));
    }
  });
});
