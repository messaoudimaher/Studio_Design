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
    
    // Initialize carousels
    initializeCarousels();
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

  // === PROJECT GALLERY FUNCTIONALITY ===
  function setupLightbox() {
    const modal = document.querySelector('.project-gallery-modal');
    if (!modal) {
      return;
    }

    const closeBtn = modal.querySelector('.gallery-modal__close');
    const overlay = modal.querySelector('.gallery-modal__overlay');
    
    // Click on portfolio item to open gallery
    portfolioItems.forEach((item, index) => {
      // Only add click listener to gallery items
      if (item.classList.contains('portfolio-item--gallery')) {
        item.addEventListener('click', function(e) {
          // Don't open if clicking on a link
          if (e.target.tagName === 'A' || e.target.closest('a')) return;
          
          const title = this.dataset.projectTitle;
          const category = this.dataset.projectCategory;
          
          try {
            const images = JSON.parse(this.dataset.projectImages);
            
            if (images && images.length > 0) {
              openGallery(title, category, images);
            }
          } catch (error) {
            // Silent error handling
          }
        });
      }
    });
    
    // Close gallery
    if (closeBtn) {
      closeBtn.addEventListener('click', closeGallery);
    }
    
    // Close on overlay click
    if (overlay) {
      overlay.addEventListener('click', closeGallery);
    }
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeGallery();
      }
    });
  }

  // Global variable to track current slide
  let currentSlideIndex = 0;
  let totalSlides = 0;
  let galleryImages = [];

  function openGallery(title, category, images) {
    const modal = document.querySelector('.project-gallery-modal');
    const titleElement = modal.querySelector('.gallery-modal__title');
    const categoryElement = modal.querySelector('.gallery-modal__category');
    const carousel = modal.querySelector('.gallery-carousel');
    const totalSlidesElement = modal.querySelector('.total-slides');
    const currentSlideElement = modal.querySelector('.current-slide');
    
    if (!modal || !carousel) return;
    
    // Store images and reset index
    galleryImages = images;
    currentSlideIndex = 0;
    totalSlides = images.length;
    
    // Set title and category
    titleElement.textContent = title;
    categoryElement.textContent = category;
    totalSlidesElement.textContent = images.length;
    currentSlideElement.textContent = '1';
    
    // Clear carousel
    carousel.innerHTML = '';
    carousel.className = 'gallery-carousel';
    
    // Add all images but hide all except first
    images.forEach((imageSrc, index) => {
      const slideDiv = document.createElement('div');
      slideDiv.className = 'gallery-slide';
      slideDiv.style.display = index === 0 ? 'flex' : 'none';
      slideDiv.dataset.slideIndex = index;
      
      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = title;
      
      slideDiv.appendChild(img);
      carousel.appendChild(slideDiv);
    });
    
    // Create navigation buttons
    let owlNav = carousel.querySelector('.owl-nav');
    if (!owlNav) {
      owlNav = document.createElement('div');
      owlNav.className = 'owl-nav';
      
      // Create previous button
      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'owl-prev';
      prevBtn.innerHTML = '<span>‹</span>';
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        navigatePrev();
      });
      
      // Create next button
      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'owl-next';
      nextBtn.innerHTML = '<span>›</span>';
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        navigateNext();
      });
      
      owlNav.appendChild(prevBtn);
      owlNav.appendChild(nextBtn);
      carousel.appendChild(owlNav);
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function navigatePrev() {
    currentSlideIndex--;
    if (currentSlideIndex < 0) {
      currentSlideIndex = totalSlides - 1; // Loop to last
    }
    updateGalleryDisplay();
  }
  
  function navigateNext() {
    currentSlideIndex++;
    if (currentSlideIndex >= totalSlides) {
      currentSlideIndex = 0; // Loop to first
    }
    updateGalleryDisplay();
  }
  
  function updateGalleryDisplay() {
    const modal = document.querySelector('.project-gallery-modal');
    const carousel = modal.querySelector('.gallery-carousel');
    const currentSlideElement = modal.querySelector('.current-slide');
    const slides = carousel.querySelectorAll('.gallery-slide');
    
    // Hide all slides
    slides.forEach((slide, index) => {
      if (index === currentSlideIndex) {
        slide.style.display = 'flex';
        slide.style.opacity = '0';
        // Fade in
        setTimeout(() => {
          slide.style.transition = 'opacity 0.3s ease';
          slide.style.opacity = '1';
        }, 10);
      } else {
        slide.style.display = 'none';
      }
    });
    
    // Update counter
    currentSlideElement.textContent = currentSlideIndex + 1;
  }

  function closeGallery() {
    const modal = document.querySelector('.project-gallery-modal');
    const carousel = modal.querySelector('.gallery-carousel');
    
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Clear carousel
      if (carousel) {
        carousel.innerHTML = '';
      }
      
      // Reset state
      currentSlideIndex = 0;
      totalSlides = 0;
      galleryImages = [];
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

  // === CAROUSEL INITIALIZATION ===
  function initializeCarousels() {
    // No longer needed - carousels are initialized when gallery opens
  }

  // === PUBLIC API ===
  window.PortfolioFilter = {
    filter: filterItems,
    updateCount: updatePortfolioCount,
    openGallery: openGallery,
    closeGallery: closeGallery,
  };

  // === INITIALIZE ON DOM READY ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Also try on window load as a fallback
  window.addEventListener('load', function() {
    // Re-initialize if needed
    if (portfolioItems.length === 0) {
      init();
    }
  });

})();

