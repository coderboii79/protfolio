/* ===== JavaScript for Portfolio ===== */

// ===== PARTICLE SYSTEM =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 80;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.7 ? '#ff00ff' : '#00ffff';
    this.life = Math.random() * 200 + 100;
    this.maxLife = this.life;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life--;

    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.life <= 0) {
      this.reset();
    }
  }

  draw() {
    const lifeRatio = this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = this.opacity * lifeRatio;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}

function drawConnections() {
  const maxDist = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const opacity = (1 - dist / maxDist) * 0.15;
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

resizeCanvas();
initParticles();
animateParticles();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 30px rgba(0,255,255,0.1)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`#nav-${id}`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => observer.observe(section));

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobLinks = document.querySelectorAll('.mob-link');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translateY(7px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

mobLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ===== TYPED TEXT EFFECT =====
const typedEl = document.getElementById('typed-text');
const texts = [
  'Full Stack Developer',
  'Software Engineer',
  'Backend Architect',
  'Problem Solver',
  'Open Source Contributor'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimer;

function typeText() {
  const current = texts[textIndex];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
    delay = 400;
  }

  typingTimer = setTimeout(typeText, delay);
}

typeText();

// ===== COUNTER ANIMATION =====
function animateCounter(el, target) {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 25);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = document.querySelectorAll('.stat-num');
      statNums.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroSection = document.getElementById('hero');
if (heroSection) statsObserver.observe(heroSection);

// ===== SKILL BAR ANIMATION =====
const skillBarsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-bar-fill');
      fills.forEach(fill => {
        const targetWidth = fill.getAttribute('data-width');
        setTimeout(() => {
          fill.style.width = targetWidth + '%';
        }, 200);
      });
      skillBarsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillBarsObserver.observe(skillsSection);

// ===== SCROLL FADE ANIMATIONS =====
const fadeElements = document.querySelectorAll('.project-card, .skill-category, .timeline-card, .contact-info-card, .contact-form');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 100);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

fadeElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});

// Timeline items animation
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 150);
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

timelineItems.forEach(item => timelineObserver.observe(item));

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"] span');
  btn.textContent = 'TRANSMITTING...';

  setTimeout(() => {
    btn.textContent = 'TRANSMIT MESSAGE';
    contactForm.reset();
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 4000);
  }, 1500);
});

// ===== CURSOR GLOW EFFECT =====
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(circle, rgba(0,255,255,0.04) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
`;
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ===== SECTION HEADER ANIMATIONS =====
const sectionHeaders = document.querySelectorAll('.section-header');
const headerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      headerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

sectionHeaders.forEach(header => {
  header.style.opacity = '0';
  header.style.transform = 'translateY(20px)';
  header.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  headerObserver.observe(header);
});
