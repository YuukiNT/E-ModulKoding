/* main.js — perilaku umum di semua halaman: navbar, dark mode, toast, back-to-top */

document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initDarkMode();
  initBackToTop();
  markActiveNav();
});

function initHamburger(){
  const btn = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if(!btn || !links) return;
  btn.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

function initDarkMode(){
  const btn = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  const saved = localStorage.getItem('emodul_theme');
  if(saved === 'dark') root.setAttribute('data-theme', 'dark');
  if(!btn) return;
  updateThemeIcon();
  btn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if(isDark){ root.removeAttribute('data-theme'); localStorage.setItem('emodul_theme','light'); }
    else{ root.setAttribute('data-theme','dark'); localStorage.setItem('emodul_theme','dark'); }
    updateThemeIcon();
  });
  function updateThemeIcon(){
    btn.textContent = root.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
  }
}

function initBackToTop(){
  const btn = document.querySelector('.back-top');
  if(!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
}

function markActiveNav(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if(href === path) a.classList.add('active');
  });
}

/* Toast notification helper, dipakai halaman lain lewat window.showToast(msg) */
function showToast(message, duration = 2200){
  let toast = document.querySelector('.toast');
  if(!toast){
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), duration);
}
window.showToast = showToast;

/* Accordion helper dipakai di halaman materi */
function initAccordion(selector = '.accordion-item'){
  document.querySelectorAll(selector).forEach(item => {
    const head = item.querySelector('.accordion-head');
    if(!head) return;
    head.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll(selector).forEach(i => i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });
}
window.initAccordion = initAccordion;
