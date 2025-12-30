/* ============================================
   MODERN NAVIGATION FUNCTIONALITY
   Vanilla JavaScript - No dependencies
   ============================================ */

(function() {
  'use strict';

  // === CONFIGURATION ===
  const config = {
    scrollThreshold: 100, // Pixels scrolled before header changes
    scrollHideThreshold: 50, // Distance to scroll before hiding/showing
  };

  // === STATE ===
  let lastScrollPosition = 0;
  let isMenuOpen = false;

  // === DOM ELEMENTS ===
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.main-nav');
  const overlay = document.querySelector('.menu-overlay');
  const navLinks = document.querySelectorAll('.main-nav a');
  const body = document.body;

  // === INITIALIZE ===
  function init() {
    if (!header) return;

    setupScrollBehavior();
    setupMobileMenu();
    setupActiveLinks();
    setupSmoothScroll();
  }

  // === SCROLL BEHAVIOR ===
  // Hide/show header on scroll, add shadow
  function setupScrollBehavior() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  function handleScroll() {
    const currentScrollPosition = window.pageYOffset;

    // Add shadow when scrolled
    if (currentScrollPosition > config.scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Hide header on scroll down, show on scroll up
    // Don't hide at top of page or when menu is open
    if (currentScrollPosition < config.scrollThreshold || isMenuOpen) {
      header.classList.remove('hidden');
    } else {
      if (currentScrollPosition > lastScrollPosition && 
          Math.abs(currentScrollPosition - lastScrollPosition) > config.scrollHideThreshold) {
        // Scrolling down
        header.classList.add('hidden');
      } else if (currentScrollPosition < lastScrollPosition &&
                 Math.abs(currentScrollPosition - lastScrollPosition) > config.scrollHideThreshold) {
        // Scrolling up
        header.classList.remove('hidden');
      }
    }

    lastScrollPosition = currentScrollPosition;
  }

  // === MOBILE MENU ===
  function setupMobileMenu() {
    if (!menuToggle || !nav || !overlay) return;

    // Toggle button click
    menuToggle.addEventListener('click', toggleMenu);

    // Overlay click (close menu)
    overlay.addEventListener('click', closeMenu);

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isMenuOpen) {
          closeMenu();
        }
      });
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    });

    // Close menu on window resize (desktop breakpoint)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 1024 && isMenuOpen) {
          closeMenu();
        }
      }, 250);
    });
  }

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    isMenuOpen = true;
    menuToggle.classList.add('active');
    nav.classList.add('active');
    overlay.classList.add('active');
    body.classList.add('menu-open');
    header.classList.add('menu-is-open');
    
    // Set aria-expanded for accessibility
    menuToggle.setAttribute('aria-expanded', 'true');
    
    // Trap focus in menu
    trapFocus(nav);
  }

  function closeMenu() {
    isMenuOpen = false;
    menuToggle.classList.remove('active');
    nav.classList.remove('active');
    overlay.classList.remove('active');
    body.classList.remove('menu-open');
    header.classList.remove('menu-is-open');
    
    // Set aria-expanded for accessibility
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  // === FOCUS TRAP (Accessibility) ===
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    // Focus first element
    firstFocusable.focus();
    
    // Trap focus within menu
    function handleTabKey(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    }
    
    element.addEventListener('keydown', handleTabKey);
  }

  // === ACTIVE LINK HIGHLIGHTING ===
  // Highlight nav link based on current page
  function setupActiveLinks() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      
      if (linkPath === currentPage || 
          (currentPage === '' && linkPath === 'index.html') ||
          (currentPage === 'index.html' && linkPath === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // === SMOOTH SCROLL ===
  // Smooth scroll to anchor links
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Ignore empty anchors
        if (href === '#' || href === '#!') return;
        
        const targetId = href.substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          e.preventDefault();
          
          // Get header height for offset
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }
      });
    });
  }

  // === INITIALIZE ON DOM READY ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // === PUBLIC API (if needed) ===
  window.MJNavigation = {
    openMenu,
    closeMenu,
    toggleMenu
  };

})();

