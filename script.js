/* ============================================
   Dr. Anjali's Homoeo Clinic - Main Script
   ============================================ */

// ---- PAGE LOADER ----
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 1600);
});

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ---- MOBILE MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ---- ACTIVE NAV LINK ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), entry.target.dataset.delay || 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
  el.dataset.delay = el.dataset.delay || 0;
  revealObserver.observe(el);
});

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      if (!isNaN(target)) animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ---- TESTIMONIALS SLIDER ----
const sliderTrack = document.getElementById('testimonials-track');
const sliderDots = document.querySelectorAll('.slider-dot');
let currentSlide = 0;
let autoSlide;

function goToSlide(n) {
  if (!sliderTrack) return;
  const slides = sliderTrack.querySelectorAll('.testimonial-slide');
  currentSlide = (n + slides.length) % slides.length;
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  sliderDots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

sliderDots.forEach((dot, i) => {
  dot.addEventListener('click', () => { goToSlide(i); restartAuto(); });
});

document.getElementById('slider-prev')?.addEventListener('click', () => { goToSlide(currentSlide - 1); restartAuto(); });
document.getElementById('slider-next')?.addEventListener('click', () => { goToSlide(currentSlide + 1); restartAuto(); });

function restartAuto() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
}
if (sliderTrack) restartAuto();

// ---- FAQ ACCORDION ----
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ---- TIME SLOT SELECTION ----
document.querySelectorAll('.time-slot').forEach(slot => {
  slot.addEventListener('click', () => {
    slot.closest('.hero-time-slots').querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
    slot.classList.add('active');
  });
});

// ---- APPOINTMENT FORM ----
const appointmentForm = document.getElementById('appointment-form');
if (appointmentForm) {
  appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = appointmentForm.querySelector('[type="submit"]');
    const origText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Booking...';
    btn.disabled = true;

    const data = {
      id: Date.now(),
      name: appointmentForm.name.value.trim(),
      phone: appointmentForm.phone.value.trim(),
      email: appointmentForm.email.value.trim(),
      concern: appointmentForm.concern.value.trim(),
      date: appointmentForm.date.value,
      time: appointmentForm.time.value,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(data);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    setTimeout(() => {
      appointmentForm.style.display = 'none';
      document.getElementById('form-success').style.display = 'block';
    }, 1500);
  });
}

// ---- CONTACT FORM ----
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
    btn.style.background = '#38a169';
    btn.disabled = true;
    setTimeout(() => { contactForm.reset(); btn.innerHTML = 'Send Message'; btn.style.background = ''; btn.disabled = false; }, 3000);
  });
}

// ---- ADMIN ----
function loadAdminDashboard() {
  const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  const tbody = document.getElementById('appointments-tbody');
  const totalEl = document.getElementById('total-count');
  const pendingEl = document.getElementById('pending-count');
  const completedEl = document.getElementById('completed-count');
  const todayEl = document.getElementById('today-count');

  if (!tbody) return;

  const today = new Date().toISOString().slice(0, 10);
  const pending = appointments.filter(a => a.status === 'pending').length;
  const completed = appointments.filter(a => a.status === 'completed').length;
  const todayCount = appointments.filter(a => a.date === today).length;

  if (totalEl) totalEl.textContent = appointments.length;
  if (pendingEl) pendingEl.textContent = pending;
  if (completedEl) completedEl.textContent = completed;
  if (todayEl) todayEl.textContent = todayCount;

  if (appointments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-calendar-xmark"></i><p>No appointments yet.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = appointments.slice().reverse().map(a => `
    <tr>
      <td><strong>${a.name}</strong></td>
      <td><a href="tel:${a.phone}" style="color:var(--secondary)">${a.phone}</a></td>
      <td>${a.concern}</td>
      <td>${a.date ? new Date(a.date).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'}) : '-'}</td>
      <td>${a.time || '-'}</td>
      <td><span class="badge badge-${a.status}">${a.status.charAt(0).toUpperCase()+a.status.slice(1)}</span></td>
      <td style="display:flex;gap:6px;flex-wrap:wrap">
        ${a.status !== 'completed' ? `<button class="action-btn action-complete" onclick="markComplete(${a.id})"><i class="fa-solid fa-check"></i> Done</button>` : ''}
        <button class="action-btn action-delete" onclick="deleteAppointment(${a.id})"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

function markComplete(id) {
  const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  const idx = appointments.findIndex(a => a.id === id);
  if (idx !== -1) { appointments[idx].status = 'completed'; localStorage.setItem('appointments', JSON.stringify(appointments)); loadAdminDashboard(); }
}

function deleteAppointment(id) {
  if (!confirm('Delete this appointment?')) return;
  const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  localStorage.setItem('appointments', JSON.stringify(appointments.filter(a => a.id !== id)));
  loadAdminDashboard();
}

// Admin Login
const adminLoginForm = document.getElementById('admin-login-form');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('admin-user').value;
    const p = document.getElementById('admin-pass').value;
    if (u === 'admin' && p === 'clinic123') {
      sessionStorage.setItem('adminAuth', '1');
      document.getElementById('admin-login-page').style.display = 'none';
      document.getElementById('admin-dashboard-page').style.display = 'flex';
      loadAdminDashboard();
    } else {
      document.getElementById('login-error').style.display = 'block';
    }
  });
}

// Check admin auth on load
if (document.getElementById('admin-dashboard-page')) {
  if (sessionStorage.getItem('adminAuth') === '1') {
    document.getElementById('admin-login-page').style.display = 'none';
    document.getElementById('admin-dashboard-page').style.display = 'flex';
    loadAdminDashboard();
  }
}

// Admin Logout
document.getElementById('admin-logout')?.addEventListener('click', () => {
  sessionStorage.removeItem('adminAuth');
  document.getElementById('admin-login-page').style.display = 'flex';
  document.getElementById('admin-dashboard-page').style.display = 'none';
});

// Refresh admin
document.getElementById('refresh-appointments')?.addEventListener('click', loadAdminDashboard);

// Expose to window for inline onclick
window.markComplete = markComplete;
window.deleteAppointment = deleteAppointment;

// ---- SMOOTH SCROLL FOR HASH LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ---- SET MIN DATE FOR APPOINTMENT ----
const dateInput = document.getElementById('appt-date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}
