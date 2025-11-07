/* ============================================
   PORTFOLIO FILTERING & INTERACTIONS
   Vanilla JavaScript - Modern & Performant
   ============================================ */

(function() {
  'use strict';

  // === CONFIGURATION ===
  const config = {
    animationDuration: 400, // ms
    filterTransition: 300,   // ms
  };

  // === STATE ===
  let currentFilter = 'all';
  let portfolioItems = [];

  // === INITIALIZE ===
  function init() {
    // Get all portfolio items
    portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
    
    if (portfolioItems.length === 0) {
      console.log('No portfolio items found');
      return;
    }

    // Setup filter buttons
    setupFilters();
    
    // Setup lightbox (if needed)
    setupLightbox();
    
    // Update portfolio count
    updatePortfolioCount();
    
    // Add intersection observer for animations
    setupScrollAnimations();
  }

  // === FILTER FUNCTIONALITY ===
  function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.dataset.filter;
        
        // Don't do anything if clicking active filter
        if (filter === currentFilter) return;
        
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Filter items
        filterItems(filter);
        
        // Update current filter
        currentFilter = filter;
        
        // Update count
        updatePortfolioCount();
      });
    });
  }

  function filterItems(filter) {
    portfolioItems.forEach((item, index) => {
      const itemCategories = item.dataset.category.split(' ');
      const shouldShow = filter === 'all' || itemCategories.includes(filter);
      
      if (shouldShow) {
        // Staggered fade-in animation
        setTimeout(() => {
          item.classList.remove('hide');
          item.classList.add('show');
          item.style.display = 'block';
        }, index * 50);
      } else {
        item.classList.add('hide');
        item.classList.remove('show');
        setTimeout(() => {
          if (item.classList.contains('hide')) {
            item.style.display = 'none';
          }
        }, config.filterTransition);
      }
    });
  }

  function updatePortfolioCount() {
    const countElement = document.querySelector('.portfolio-count');
    if (!countElement) return;
    
    const visibleItems = portfolioItems.filter(item => {
      if (currentFilter === 'all') return true;
      const itemCategories = item.dataset.category.split(' ');
      return itemCategories.includes(currentFilter);
    });
    
    countElement.textContent = visibleItems.length;
  }

  // === LIGHTBOX FUNCTIONALITY ===
  function setupLightbox() {
    const lightbox = document.querySelector('.portfolio-lightbox');
    if (!lightbox) return;

    const lightboxImage = lightbox.querySelector('.portfolio-lightbox__image');
    const closeBtn = lightbox.querySelector('.portfolio-lightbox__close');
    
    // Click on portfolio item to open lightbox
    portfolioItems.forEach(item => {
      item.addEventListener('click', function(e) {
        // Don't open if clicking on a link
        if (e.target.tagName === 'A' || e.target.closest('a')) return;
        
        const imageSrc = this.querySelector('.portfolio-item__image')?.src;
        if (imageSrc) {
          openLightbox(imageSrc);
        }
      });
    });
    
    // Close lightbox
    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  function openLightbox(imageSrc) {
    const lightbox = document.querySelector('.portfolio-lightbox');
    const lightboxImage = lightbox.querySelector('.portfolio-lightbox__image');
    
    if (lightbox && lightboxImage) {
      lightboxImage.src = imageSrc;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    const lightbox = document.querySelector('.portfolio-lightbox');
    
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // === SCROLL ANIMATIONS ===
  function setupScrollAnimations() {
    // Only run if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      portfolioItems.forEach(item => item.classList.add('visible'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optional: unobserve after animation
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    portfolioItems.forEach(item => {
      observer.observe(item);
    });
  }

  // === SEARCH FUNCTIONALITY (Optional Enhancement) ===
  function setupSearch() {
    const searchInput = document.querySelector('.portfolio-search');
    if (!searchInput) return;

    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
      clearTimeout(searchTimeout);
      
      searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        portfolioItems.forEach(item => {
          const title = item.querySelector('.portfolio-item__title')?.textContent.toLowerCase() || '';
          const description = item.querySelector('.portfolio-item__description')?.textContent.toLowerCase() || '';
          const category = item.dataset.category.toLowerCase();
          
          const matches = title.includes(searchTerm) || 
                         description.includes(searchTerm) || 
                         category.includes(searchTerm);
          
          if (matches || searchTerm === '') {
            item.style.display = 'block';
            item.classList.remove('hide');
          } else {
            item.style.display = 'none';
            item.classList.add('hide');
          }
        });
        
        updatePortfolioCount();
      }, 300);
    });
  }

  // === LAZY LOADING IMAGES ===
  function setupLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // === GRID LAYOUT OPTIMIZATION ===
  function optimizeGridLayout() {
    // Ensure consistent aspect ratios and loading
    const images = document.querySelectorAll('.portfolio-item__image');
    
    images.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', function() {
          this.classList.add('loaded');
        });
      }
    });
  }

  // === PUBLIC API ===
  window.PortfolioFilter = {
    filter: filterItems,
    updateCount: updatePortfolioCount,
    openLightbox: openLightbox,
    closeLightbox: closeLightbox,
  };

  // === INITIALIZE ON DOM READY ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

