/* BiologicHealthPlus — main.js */
// ── MEGA MENU ──────────────────────────────────────────────
const megaButtons = document.querySelectorAll('[data-mega]');
let openMega = null;

function closeMega(){
  if(openMega){
    const btn = document.querySelector(`[data-mega="${openMega}"]`);
    const panel = document.getElementById(`mega-${openMega}`);
    if(btn) btn.setAttribute('aria-expanded','false');
    if(panel) panel.classList.remove('open');
    openMega = null;
  }
}

megaButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const key = btn.dataset.mega;
    const panel = document.getElementById(`mega-${key}`);
    if(openMega === key){ closeMega(); return; }
    closeMega();
    btn.setAttribute('aria-expanded','true');
    panel.classList.add('open');
    openMega = key;
  });
});
document.addEventListener('click', closeMega);
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMega(); });

// ── HAMBURGER / MOBILE DRAWER ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobDrawer  = document.getElementById('mob-drawer');
const mobClose   = document.getElementById('mob-close');
const mobOverlay = document.getElementById('mob-overlay');

function openMobNav(){
  hamburger.classList.add('open');
  mobDrawer.classList.add('open');
  hamburger.setAttribute('aria-expanded','true');
  document.body.style.overflow = 'hidden';
  mobClose.focus();
}
function closeMobNav(){
  hamburger.classList.remove('open');
  mobDrawer.classList.remove('open');
  hamburger.setAttribute('aria-expanded','false');
  document.body.style.overflow = '';
  hamburger.focus();
}
hamburger.addEventListener('click', () => {
  mobDrawer.classList.contains('open') ? closeMobNav() : openMobNav();
});
mobClose.addEventListener('click', closeMobNav);
mobOverlay.addEventListener('click', closeMobNav);
document.addEventListener('keydown', e => { if(e.key === 'Escape' && mobDrawer.classList.contains('open')) closeMobNav(); });

// Trap focus in drawer
mobDrawer.addEventListener('keydown', e => {
  if(e.key !== 'Tab') return;
  const focusable = mobDrawer.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');
  const first = focusable[0], last = focusable[focusable.length-1];
  if(e.shiftKey){ if(document.activeElement === first){ e.preventDefault(); last.focus(); } }
  else { if(document.activeElement === last){ e.preventDefault(); first.focus(); } }
});

// ── PAYMENT MODALS ──────────────────────────────────────────
const payCards = document.querySelectorAll('[data-payment]');
payCards.forEach(card => {
  card.addEventListener('click', () => {
    const key = card.dataset.payment;
    openModal(key);
  });
  card.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); card.click(); }
  });
});

function openModal(key){
  const modal = document.getElementById(`modal-${key}`);
  if(!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  const firstFocusable = modal.querySelector('button,a,[tabindex]');
  if(firstFocusable) setTimeout(() => firstFocusable.focus(), 50);
}
function closeModal(key){
  const modal = document.getElementById(`modal-${key}`);
  if(!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  // Return focus to triggering card
  const card = document.querySelector(`[data-payment="${key}"]`);
  if(card) card.focus();
}

// Close buttons and overlays
document.querySelectorAll('[data-close]').forEach(el => {
  el.addEventListener('click', () => closeModal(el.dataset.close));
});

// Close on Escape
document.addEventListener('keydown', e => {
  if(e.key !== 'Escape') return;
  document.querySelectorAll('.pay-modal.open').forEach(m => {
    closeModal(m.id.replace('modal-',''));
  });
});

// Trap focus in modals
document.querySelectorAll('.pay-modal').forEach(modal => {
  modal.addEventListener('keydown', e => {
    if(!modal.classList.contains('open') || e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll('button,a,[tabindex]:not([tabindex="-1"])');
    const first = focusable[0], last = focusable[focusable.length-1];
    if(e.shiftKey){ if(document.activeElement===first){e.preventDefault();last.focus();} }
    else { if(document.activeElement===last){e.preventDefault();first.focus();} }
  });
});

// ── SCROLL ANIMATIONS (Intersection Observer) ───────────────
const animEls = document.querySelectorAll('.card,.cond-card,.step,.trust-badge,.service-card,.nav-tile,.pay-card');
if('IntersectionObserver' in window){
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if(en.isIntersecting){
        en.target.style.opacity = '1';
        en.target.style.transform = 'translateY(0)';
        io.unobserve(en.target);
      }
    });
  },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  animEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    io.observe(el);
  });
}

// ── SMOOTH ANCHOR LINKS ──────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});
