/* ============================================
   THEME SWITCHER
   Light/Dark Mode Toggle with LocalStorage
   ============================================ */

(function() {
  'use strict';

  // === CONFIGURATION ===
  const THEME_KEY = 'mjstudio-theme';
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';

  // === STATE ===
  let currentTheme = THEME_LIGHT;

  // === DOM ELEMENTS ===
  const html = document.documentElement;
  const body = document.body;

  // === INITIALIZE ===
  function init() {
    // Load saved theme or detect system preference
    loadTheme();
    
    // Create theme toggle button
    createThemeToggle();
    
    // Listen for system theme changes
    watchSystemTheme();
  }

  // === LOAD THEME ===
  function loadTheme() {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    if (savedTheme) {
      currentTheme = savedTheme;
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      currentTheme = prefersDark ? THEME_DARK : THEME_LIGHT;
    }
    
    applyTheme(currentTheme, false);
  }

  // === APPLY THEME ===
  function applyTheme(theme, animate = true) {
    // Add transitioning class to prevent flashing
    if (!animate) {
      html.classList.add('theme-transitioning');
    }
    
    // Set theme
    html.setAttribute('data-theme', theme);
    currentTheme = theme;
    
    // Update meta theme-color for mobile browsers
    updateMetaThemeColor(theme);
    
    // Remove transitioning class after a short delay
    if (!animate) {
      setTimeout(() => {
        html.classList.remove('theme-transitioning');
      }, 50);
    }
    
    // Save preference
    localStorage.setItem(THEME_KEY, theme);
    
    // Update toggle button
    updateToggleButton();
    
    // Dispatch custom event for other components
    document.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme }
    }));
  }

  // === TOGGLE THEME ===
  function toggleTheme() {
    const newTheme = currentTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
    applyTheme(newTheme, true);
  }

  // === CREATE THEME TOGGLE BUTTON ===
  function createThemeToggle() {
    // Find navigation container
    const nav = document.querySelector('.main-nav ul');
    if (!nav) return;
    
    // Create toggle button
    const toggleButton = document.createElement('li');
    toggleButton.className = 'nav-theme-toggle';
    toggleButton.innerHTML = `
      <button 
        class="theme-toggle" 
        aria-label="Toggle ${currentTheme === THEME_LIGHT ? 'dark' : 'light'} mode"
        title="Toggle theme">
        <span class="theme-toggle-icon">
          <svg class="theme-icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg class="theme-icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </span>
      </button>
    `;
    
    // Add to navigation
    nav.appendChild(toggleButton);
    
    // Add click event
    const button = toggleButton.querySelector('.theme-toggle');
    button.addEventListener('click', toggleTheme);
    
    // Update initial state
    updateToggleButton();
  }

  // === UPDATE TOGGLE BUTTON ===
  function updateToggleButton() {
    const button = document.querySelector('.theme-toggle');
    if (!button) return;
    
    const newLabel = currentTheme === THEME_LIGHT ? 'dark' : 'light';
    button.setAttribute('aria-label', `Toggle ${newLabel} mode`);
    button.setAttribute('title', `Switch to ${newLabel} mode`);
  }

  // === UPDATE META THEME COLOR ===
  function updateMetaThemeColor(theme) {
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    
    // Set color based on theme
    const color = theme === THEME_DARK ? '#1A1A1A' : '#FAF8F5';
    metaTheme.content = color;
  }

  // === WATCH SYSTEM THEME CHANGES ===
  function watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Only auto-switch if user hasn't manually set a preference
    mediaQuery.addEventListener('change', (e) => {
      // Check if user has manually set a theme
      const savedTheme = localStorage.getItem(THEME_KEY);
      
      // Only auto-switch if no manual preference exists
      if (!savedTheme) {
        const newTheme = e.matches ? THEME_DARK : THEME_LIGHT;
        applyTheme(newTheme, true);
      }
    });
  }

  // === PUBLIC API ===
  window.ThemeSwitcher = {
    toggle: toggleTheme,
    setTheme: (theme) => {
      if (theme === THEME_LIGHT || theme === THEME_DARK) {
        applyTheme(theme, true);
      }
    },
    getTheme: () => currentTheme,
    reset: () => {
      localStorage.removeItem(THEME_KEY);
      loadTheme();
    }
  };

  // === INITIALIZE ON DOM READY ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // === KEYBOARD SHORTCUT (Optional) ===
  // Ctrl/Cmd + Shift + D to toggle theme
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      toggleTheme();
    }
  });

})();

