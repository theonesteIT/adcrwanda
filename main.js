// ===================================
// MAIN JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  
  // Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      siteNav.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  // Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('adc-theme');
  
  if (storedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('adc-theme', isDark ? 'dark' : 'light');
    });
  }

  // Set current year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ===================================
  // HERO SLIDESHOW
  // ===================================
  let heroSlideIndex = 0;
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-slide-dots .dot');

  function showHeroSlide(n) {
    heroSlides.forEach(slide => slide.classList.remove('active'));
    heroDots.forEach(dot => dot.classList.remove('active'));
    
    if (n >= heroSlides.length) heroSlideIndex = 0;
    if (n < 0) heroSlideIndex = heroSlides.length - 1;
    
    heroSlides[heroSlideIndex].classList.add('active');
    heroDots[heroSlideIndex].classList.add('active');
  }

  window.setHeroSlide = function(n) {
    heroSlideIndex = n;
    showHeroSlide(heroSlideIndex);
  }

  function nextHeroSlide() {
    heroSlideIndex++;
    showHeroSlide(heroSlideIndex);
  }

  if (heroSlides.length > 0) {
    setInterval(nextHeroSlide, 5000);
  }

  // ===================================
  // COUNTER ANIMATION
  // ===================================
  const counters = document.querySelectorAll('.counter');
  
  const animateCounters = () => {
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = Math.ceil(target / 100);
        
        if (count < target) {
          counter.innerText = count + inc;
          setTimeout(updateCount, 20);
        } else {
          counter.innerText = target.toLocaleString();
        }
      };
      updateCount();
    });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  });
  
  const heroStats = document.querySelector('.hero-stats-container');
  if (heroStats) {
    observer.observe(heroStats);
  }

  // ===================================
  // IMPACT CARDS SLIDESHOW
  // ===================================
  const impactCards = document.querySelectorAll('.impact-card-slideshow');
  
  impactCards.forEach(card => {
    const slides = card.querySelectorAll('.slide');
    const dots = card.querySelectorAll('.slide-dots .dot');
    let currentSlide = 0;
    
    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      currentSlide = (index + slides.length) % slides.length;
      
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
      showSlide(currentSlide + 1);
    }
    
    // Auto-advance slides every 4 seconds
    let slideInterval = setInterval(nextSlide, 4000);
    
    // Click dots to change slides
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 4000);
      });
    });
    
    // Pause on hover
    card.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    card.addEventListener('mouseleave', () => {
      slideInterval = setInterval(nextSlide, 4000);
    });
  });

  // ===================================
  // PROJECTS CAROUSEL
  // ===================================
  const track = document.querySelector('.projects-track');
  const projectCards = document.querySelectorAll('.project-card');
  let projectIndex = 0;

  function updateProjectSlide() {
    if (projectCards.length > 0) {
      const width = projectCards[0].offsetWidth + 32;
      track.style.transform = `translateX(-${projectIndex * width}px)`;
    }
  }

  const projectPrev = document.getElementById('projectPrev');
  const projectNext = document.getElementById('projectNext');

  if (projectPrev) {
    projectPrev.addEventListener('click', () => {
      projectIndex = (projectIndex - 1 + projectCards.length) % projectCards.length;
      updateProjectSlide();
    });
  }

  if (projectNext) {
    projectNext.addEventListener('click', () => {
      projectIndex = (projectIndex + 1) % projectCards.length;
      updateProjectSlide();
    });
  }

  // ===================================
  // TESTIMONIALS
  // ===================================
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
  const testimonialsWrapper = document.querySelector('.testimonials-wrapper');

  let testimonialIndex = 0;
  let testimonialAutoPlay = null;
  const INTERVAL_TIME = 6000;

  function showTestimonial(index) {
    testimonialIndex = (index + testimonialCards.length) % testimonialCards.length;

    testimonialCards.forEach((card, i) => {
      card.classList.remove('active', 'previous');

      if (i === testimonialIndex) {
        card.classList.add('active');
      } else if (i === (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length) {
        card.classList.add('previous');
      }
    });

    testimonialDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === testimonialIndex);
    });
  }

  function startAutoplay() {
    stopAutoplay();
    testimonialAutoPlay = setInterval(() => {
      showTestimonial(testimonialIndex + 1);
    }, INTERVAL_TIME);
  }

  function stopAutoplay() {
    if (testimonialAutoPlay) {
      clearInterval(testimonialAutoPlay);
      testimonialAutoPlay = null;
    }
  }

  if (testimonialDots.length > 0) {
    testimonialDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showTestimonial(index);
        startAutoplay();
      });
    });
  }

  if (testimonialsWrapper) {
    testimonialsWrapper.addEventListener('mouseenter', stopAutoplay);
    testimonialsWrapper.addEventListener('mouseleave', startAutoplay);

    // Init
    showTestimonial(0);
    startAutoplay();
  }

  // ===================================
  // PARTNERS CAROUSEL
  // ===================================
  const partnersTrack = document.querySelector('.partners-track');
  const partnerCards = document.querySelectorAll('.partner-card-mini');
  const partnerIndicatorsContainer = document.getElementById('partnerIndicators');
  let partnerIndex = 0;

  function getCardsToShow() {
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 3;
    if (window.innerWidth >= 480) return 2;
    return 1;
  }

  function createPartnerIndicators() {
    if (!partnerIndicatorsContainer || partnerCards.length === 0) return;
    
    partnerIndicatorsContainer.innerHTML = '';
    const cardsToShow = getCardsToShow();
    const numPages = Math.ceil(partnerCards.length / cardsToShow);
    
    for (let i = 0; i < numPages; i++) {
      const indicator = document.createElement('div');
      indicator.classList.add('partner-indicator');
      if (i === 0) indicator.classList.add('active');
      indicator.addEventListener('click', () => goToPartnerPage(i));
      partnerIndicatorsContainer.appendChild(indicator);
    }
  }

  function updatePartnersSlide() {
    if (!partnersTrack || partnerCards.length === 0) return;
    
    const cardsToShow = getCardsToShow();
    const cardWidth = partnerCards[0].offsetWidth;
    const gap = 24;
    const offset = partnerIndex * cardsToShow * (cardWidth + gap);
    partnersTrack.style.transform = `translateX(-${offset}px)`;

    const indicators = document.querySelectorAll('.partner-indicator');
    indicators.forEach((ind, idx) => {
      ind.classList.toggle('active', idx === partnerIndex);
    });
  }

  function goToPartnerPage(page) {
    const cardsToShow = getCardsToShow();
    const maxIndex = Math.ceil(partnerCards.length / cardsToShow) - 1;
    partnerIndex = Math.max(0, Math.min(page, maxIndex));
    updatePartnersSlide();
  }

  const partnerPrev = document.getElementById('partnerPrev');
  const partnerNext = document.getElementById('partnerNext');

  if (partnerPrev) {
    partnerPrev.addEventListener('click', () => {
      const cardsToShow = getCardsToShow();
      const maxIndex = Math.ceil(partnerCards.length / cardsToShow) - 1;
      partnerIndex = partnerIndex > 0 ? partnerIndex - 1 : maxIndex;
      updatePartnersSlide();
    });
  }

  if (partnerNext) {
    partnerNext.addEventListener('click', () => {
      const cardsToShow = getCardsToShow();
      const maxIndex = Math.ceil(partnerCards.length / cardsToShow) - 1;
      partnerIndex = partnerIndex < maxIndex ? partnerIndex + 1 : 0;
      updatePartnersSlide();
    });
  }

  if (partnerCards.length > 0) {
    createPartnerIndicators();
    
    window.addEventListener('resize', () => {
      createPartnerIndicators();
      updatePartnersSlide();
    });

    // Auto-advance partners
    setInterval(() => {
      const cardsToShow = getCardsToShow();
      const maxIndex = Math.ceil(partnerCards.length / cardsToShow) - 1;
      partnerIndex = partnerIndex < maxIndex ? partnerIndex + 1 : 0;
      updatePartnersSlide();
    }, 4000);
  }

  // ===================================
  // MODAL FUNCTIONALITY
  // ===================================
  const modalOverlay = document.getElementById('modalOverlay');
  const readMoreBtns = document.querySelectorAll('.read-more-btn');
  const modalCloseBtns = document.querySelectorAll('.modal-close');

  // Open modal
  readMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      
      if (modal && modalOverlay) {
        // Show overlay
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        
        // Show modal with slight delay for animation
        setTimeout(() => {
          modal.classList.add('active');
        }, 50);
      }
    });
  });

  // Close modal function
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    
    if (modal && modalOverlay) {
      modal.classList.remove('active');
      
      setTimeout(() => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
      }, 300);
    }
  }

  // Close button click
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      closeModal(modalId);
    });
  });

  // Close on overlay click
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
          closeModal(activeModal.id);
        }
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) {
        closeModal(activeModal.id);
      }
    }
  });

});