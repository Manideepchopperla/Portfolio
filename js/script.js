// Portfolio Website JavaScript - Main Script

class Portfolio {
    constructor() {
        this.components = ['hero', 'about', 'projects', 'contact'];
        this.currentSection = 'hero';
        this.isLoading = true;
        
        this.init();
    }

    async init() {
        try {
            // Show loading screen
            this.showLoader();
            
            // Load all components
            await this.loadAllComponents();
            
            // Initialize event listeners
            this.initEventListeners();
            
            // Initialize intersection observer for animations
            this.initIntersectionObserver();
            
            // Initialize mobile menu
            this.initMobileMenu();
            
            // Hide loading screen
            this.hideLoader();
            
            console.log('Portfolio initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio:', error);
            this.hideLoader();
        }
    }

    showLoader() {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.style.display = 'flex';
        }
    }

    hideLoader() {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }

    async loadAllComponents() {
        const loadPromises = this.components.map(component => 
            this.loadComponent(component)
        );
        
        await Promise.all(loadPromises);
    }

    async loadComponent(componentName) {
        try {
            const response = await fetch(`components/${componentName}.html`);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${componentName} component`);
            }
            
            const html = await response.text();
            const section = document.getElementById(componentName);
            
            if (section) {
                section.innerHTML = html;
                console.log(`${componentName} component loaded successfully`);
            }
        } catch (error) {
            console.error(`Error loading ${componentName} component:`, error);
            // Fallback content for failed component loads
            this.loadFallbackContent(componentName);
        }
    }

    loadFallbackContent(componentName) {
        const section = document.getElementById(componentName);
        if (section) {
            section.innerHTML = `
                <div class="flex items-center justify-center min-h-screen">
                    <div class="text-center">
                        <h2 class="text-3xl font-bold mb-4">Content Unavailable</h2>
                        <p class="text-gray-400">The ${componentName} section could not be loaded.</p>
                    </div>
                </div>
            `;
        }
    }

    initEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.updateActiveNavLink(link);
            });
        });

        // Form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'contact-form') {
                e.preventDefault();
                this.handleContactForm(e.target);
            }
        });

        // Window scroll event for navigation highlighting
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Project card interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.project-card')) {
                const projectCard = e.target.closest('.project-card');
                this.handleProjectClick(projectCard);
            }
        });
    }

    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                
                // Toggle hamburger/close icon
                const icon = mobileMenuBtn.querySelector('i');
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });

            // Close mobile menu when clicking on links
            mobileMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }
    }

    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible-element');
                    entry.target.classList.remove('hidden-element');
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        setTimeout(() => {
            document.querySelectorAll('.glass-card, .project-card, .skill-item').forEach(el => {
                el.classList.add('hidden-element');
                observer.observe(el);
            });
        }, 2000);
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navHeight = 80;
            const sectionTop = section.offsetTop - navHeight;
            
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    handleScroll() {
        const sections = this.components;
        const scrollPosition = window.scrollY + 100;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    this.currentSection = sectionId;
                    this.highlightNavLink(sectionId);
                }
            }
        });
    }

    highlightNavLink(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    async handleContactForm(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success state
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = '#10b981';
            
            // Reset form
            form.reset();

            // Show success message
            this.showNotification('Message sent successfully!', 'success');

        } catch (error) {
            console.error('Error submitting form:', error);
            submitBtn.textContent = 'Error - Try Again';
            submitBtn.style.background = '#ef4444';
            
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }
    }

    handleProjectClick(projectCard) {
        const projectTitle = projectCard.querySelector('h3')?.textContent || 'Project';
        const projectDescription = projectCard.querySelector('p')?.textContent || 'No description available';
        
        // Simple modal-like behavior (could be enhanced with a proper modal)
        console.log(`Project clicked: ${projectTitle}`);
        
        // You could implement a modal here or redirect to project details
        this.showNotification(`Viewing: ${projectTitle}`, 'info');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        // Set notification style based on type
        switch (type) {
            case 'success':
                notification.classList.add('bg-green-600', 'text-white');
                break;
            case 'error':
                notification.classList.add('bg-red-600', 'text-white');
                break;
            case 'info':
            default:
                notification.classList.add('bg-blue-600', 'text-white');
                break;
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Utility method to handle Spline viewer loading
    initSplineViewer(containerId, splineUrl) {
        const container = document.getElementById(containerId);
        if (container && splineUrl) {
            const splineViewer = document.createElement('spline-viewer');
            splineViewer.setAttribute('url', splineUrl);
            splineViewer.className = 'spline-viewer';
            container.appendChild(splineViewer);
        }
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new Portfolio();
    
    // Make portfolio instance globally available for debugging
    window.portfolio = portfolio;
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - pausing animations');
    } else {
        console.log('Page visible - resuming animations');
    }
});

// Handle resize events
window.addEventListener('resize', () => {
    // Handle responsive adjustments if needed
    console.log('Window resized:', window.innerWidth, 'x', window.innerHeight);
});
