/* ========================================
   CONTACT PAGE JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Form Handling
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Basic validation
            if (!validateForm(data)) {
                return;
            }

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>Envoi en cours...</span>';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(function() {
                // Hide form and show success message
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';

                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Reset form after 5 seconds
                setTimeout(function() {
                    contactForm.reset();
                    contactForm.style.display = 'flex';
                    formSuccess.style.display = 'none';
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                }, 5000);

                // In production, you would send data to your backend:
                /*
                fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        contactForm.style.display = 'none';
                        formSuccess.style.display = 'block';
                        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Une erreur s\'est produite. Veuillez réessayer.');
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                });
                */
            }, 1500);
        });
    }

    // Form validation
    function validateForm(data) {
        // Check required fields
        if (!data.firstName || !data.lastName || !data.email || !data.projectType || !data.message) {
            showError('Veuillez remplir tous les champs obligatoires.');
            return false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showError('Veuillez entrer une adresse email valide.');
            return false;
        }

        // Check consent
        if (!data.consent) {
            showError('Veuillez accepter la politique de confidentialité.');
            return false;
        }

        return true;
    }

    // Show error message
    function showError(message) {
        // Create error element if it doesn't exist
        let errorElement = document.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            errorElement.style.cssText = `
                padding: 1rem;
                margin-bottom: 1.5rem;
                background: #fee;
                border: 2px solid #fcc;
                border-radius: 8px;
                color: #c00;
                font-family: var(--font-body);
                font-size: 0.875rem;
                text-align: center;
            `;
            contactForm.insertBefore(errorElement, contactForm.firstChild);
        }

        errorElement.textContent = message;
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove error after 5 seconds
        setTimeout(function() {
            errorElement.remove();
        }, 5000);
    }

    // Real-time field validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#f44336';
            } else {
                this.style.borderColor = '';
            }
        });
    }

    // Phone number formatting (Algerian format)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Format as: +213 XXX XXX XXX
            if (value.startsWith('213')) {
                value = value.substring(3);
            } else if (value.startsWith('0')) {
                value = value.substring(1);
            }
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    e.target.value = '+213 ' + value;
                } else if (value.length <= 6) {
                    e.target.value = '+213 ' + value.substring(0, 3) + ' ' + value.substring(3);
                } else {
                    e.target.value = '+213 ' + value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 9);
                }
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll for info cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all info cards
    document.querySelectorAll('.info-card, .contact-social, .contact-hours').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
});

