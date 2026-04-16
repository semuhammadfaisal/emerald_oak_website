// ===========================
// LOAD NAVBAR AND FOOTER COMPONENTS
// ===========================

// Load Navbar
fetch('components/navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar').innerHTML = data;
    // Initialize navbar after loading
    initializeNavbar();
  })
  .catch(error => console.error('Error loading navbar:', error));

// Load Footer
fetch('components/footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;
  })
  .catch(error => console.error('Error loading footer:', error));

// NAVBAR INITIALIZATION
function initializeNavbar() {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }

  // Mobile dropdown toggle
  const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
  mobileDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dropdown = toggle.closest('.mobile-dropdown');
      dropdown.classList.toggle('active');
    });
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar-wrapper');
    if (navbar && window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else if (navbar) {
      navbar.classList.remove('scrolled');
    }
  });

  // Active link highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (href && href.includes(currentPage))) {
      link.classList.add('active');
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenuBtn) {
      if (!e.target.closest('.navbar-container') && !e.target.closest('.mobile-menu')) {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      }
    }
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.mobile-menu-item:not(.mobile-dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu && mobileMenuBtn) {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      }
    });
  });
}

// SCROLL REVEAL ANIMATION
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply to all cards and sections
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll(
    '.property-card, .service-card, .feature-card, .team-card, .mission-card, .vision-card'
  );
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// CONTACT FORM HANDLING
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (name && email && phone && message) {
      alert('Thank you for contacting us! We will get back to you soon.');
      contactForm.reset();
    } else {
      alert('Please fill in all fields.');
    }
  });
}

// SMOOTH SCROLL FOR ANCHOR LINKS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// COUNTER ANIMATION
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + '+';
    }
  }, 16);
}

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        animateCounter(stat, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    statsObserver.observe(heroStats);
  }
});

// SOCIETY CARD EXPAND/COLLAPSE (Mobile Only)
function toggleSociety(button) {
  const card = button.closest('.society-card');
  
  if (card.classList.contains('expanded')) {
    card.classList.remove('expanded');
    // Scroll to the card top smoothly
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    card.classList.add('expanded');
  }
}

// FLOATING ACTION BUTTONS
document.addEventListener('DOMContentLoaded', () => {
  // Create floating buttons container
  const floatingBtns = document.createElement('div');
  floatingBtns.className = 'floating-action-buttons';
  floatingBtns.innerHTML = `
    <a href="https://wa.me/923312220520" target="_blank" rel="noopener noreferrer" class="floating-btn" aria-label="WhatsApp">
      <i class="fab fa-whatsapp"></i>
    </a>
    <a href="tel:+923312220520" class="floating-btn" aria-label="Call">
      <i class="fas fa-phone"></i>
    </a>
  `;
  document.body.appendChild(floatingBtns);
});
