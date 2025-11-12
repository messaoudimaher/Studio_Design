// Ultra Modern Home Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    
    // ===== HERO SLIDESHOW =====
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentSlide = 0;
    let slideInterval;
    
    const showSlide = (index) => {
        // Remove active class from all slides and dots
        slides.forEach(slide => {
            slide.classList.remove('active');
            // Reset animations for slide content
            const content = slide.querySelectorAll('[data-aos]');
            content.forEach(el => {
                el.style.opacity = '0';
            });
        });
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Trigger animations for active slide content
        setTimeout(() => {
            const activeContent = slides[index].querySelectorAll('[data-aos]');
            activeContent.forEach(el => {
                el.style.opacity = '1';
            });
        }, 100);
    };
    
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };
    
    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    };
    
    const startSlideshow = () => {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    };
    
    const stopSlideshow = () => {
        clearInterval(slideInterval);
    };
    
    // Navigation buttons
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            stopSlideshow();
            prevSlide();
            startSlideshow();
        });
        
        nextBtn.addEventListener('click', () => {
            stopSlideshow();
            nextSlide();
            startSlideshow();
        });
    }
    
    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlideshow();
            currentSlide = index;
            showSlide(currentSlide);
            startSlideshow();
        });
    });
    
    // Start slideshow
    startSlideshow();
    
    // Pause on hover
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopSlideshow);
        sliderContainer.addEventListener('mouseleave', startSlideshow);
    }
    
    // ===== COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // ===== SCROLL ANIMATIONS =====
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Animate counters when stats section comes into view
                if (entry.target.classList.contains('stat-box') && !countersAnimated) {
                    countersAnimated = true;
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-count'));
                        animateCounter(stat, target);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all animate elements
    animateElements.forEach(el => observer.observe(el));
    
    // Also observe stat boxes for counter animation
    document.querySelectorAll('.stat-box').forEach(box => observer.observe(box));
    
    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== PARALLAX EFFECT FOR STATS BANNER =====
    const statsBanner = document.querySelector('.stats-banner');
    if (statsBanner) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            statsBanner.style.backgroundPositionY = rate + 'px';
        });
    }
    
    // ===== LOADING ANIMATION =====
    // Add a slight delay to ensure smooth initial load
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // ===== KEYBOARD NAVIGATION FOR SLIDER =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            stopSlideshow();
            prevSlide();
            startSlideshow();
        } else if (e.key === 'ArrowRight') {
            stopSlideshow();
            nextSlide();
            startSlideshow();
        }
    });
    
    // ===== TOUCH SWIPE FOR MOBILE =====
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleSwipe = () => {
        if (touchEndX < touchStartX - 50) {
            // Swipe left
            stopSlideshow();
            nextSlide();
            startSlideshow();
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe right
            stopSlideshow();
            prevSlide();
            startSlideshow();
        }
    };
    
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
});

