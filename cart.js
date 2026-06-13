// ─── CARRITO PERSISTENTE ────────────────────────────────────────────────────
// Guarda y lee de localStorage para que persista entre páginas.

const CART_KEY = 'desimoneer_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addCart(nombre, precio, img) {
  const cart = getCart();
  const existing = cart.find(i => i.nombre === nombre);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ nombre, precio, img, qty: 1 });
  }
  saveCart(cart);
  renderCart();
  showToast(`${nombre} agregado ✓`);
}

function removeItem(nombre) {
  const cart = getCart().filter(i => i.nombre !== nombre);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

function renderCart() {
  const cart = getCart();
  const listEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');
  if (!listEl) return;

  listEl.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    listEl.innerHTML = '<li class="empty-msg">Tu carrito está vacío.</li>';
  } else {
    cart.forEach(item => {
      total += item.precio * item.qty;
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="item-name">${item.nombre}</span>
        <span class="item-detail">x${item.qty} — $${(item.precio * item.qty).toLocaleString('es-AR')}</span>
        <button class="remove-btn" onclick="removeItem('${item.nombre.replace(/'/g,"\\'")}')">✕</button>
      `;
      listEl.appendChild(li);
    });
  }

  totalEl.textContent = total.toLocaleString('es-AR');
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  countEl.textContent = totalItems;
  countEl.style.display = totalItems > 0 ? 'flex' : 'none';
}

function buildWhatsAppMsg() {
  const cart = getCart();
  if (cart.length === 0) { alert('El carrito está vacío.'); return; }
  const lines = cart.map(i => `• ${i.nombre} x${i.qty} = $${(i.precio * i.qty).toLocaleString('es-AR')}`);
  const total = cart.reduce((s, i) => s + i.precio * i.qty, 0);
  lines.push(`\n*Total: $${total.toLocaleString('es-AR')}*`);
  const msg = encodeURIComponent(`¡Hola! Quiero comprar estas figuritas:\n\n${lines.join('\n')}`);
  window.open(`https://wa.me/549XXXXXXXXXX?text=${msg}`, '_blank');
}

function toggleCart() {
  const panel = document.getElementById('cart-panel');
  panel.classList.toggle('open');
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// Renderiza al cargar la página
document.addEventListener('DOMContentLoaded', renderCart);
