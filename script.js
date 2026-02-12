document.addEventListener('DOMContentLoaded', () => {

    // --- FORCE SCROLL TO TOP ON LOAD ---
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // --- LOADING SCREEN ---
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        window.addEventListener('load', () => {
            // Keep it visible for at least 1.5 seconds (as requested)
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                // Remove from DOM after transition
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    // Trigger FOUT safety removal here as well to be double sure
                    document.documentElement.classList.remove('wf-loading');
                    document.documentElement.classList.add('wf-active');
                }, 500);
            }, 1500); // 1.5 seconds wait
        });
    }

    // --- HEADER SCROLL EFFECT ---
    const header = document.querySelector('.app-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load

    // --- MOBILE MENU LOGIC ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuBtn && mobileMenu && closeBtn) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = ''; 
        };

        closeBtn.addEventListener('click', closeMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // --- FADE IN ON SCROLL (Subtle Reveal) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });

    /* ===== MATRIX BACKGROUND EFFECT REMOVED ===== */
    /* 
    const matrixCanvas = document.getElementById('matrix-canvas');
    if (matrixCanvas) {
        // ... (removed)
    } 
    */

    // --- NUMBER COUNTING ANIMATION ---
    const metricsSection = document.querySelector('.metrics-section');
    const metricValues = document.querySelectorAll('.metric-value');
    let started = false;

    if (metricsSection && metricValues.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !started) {
                    started = true;
                    metricValues.forEach(el => {
                        const originalText = el.innerText;
                        // Extract number and suffix
                        const match = originalText.match(/([\d\.]+)(.*)/);
                        if (match) {
                            const value = parseFloat(match[1]);
                            const suffix = match[2];
                            
                            // Animate
                            let startTimestamp = null;
                            const duration = 2000; // 2 seconds

                            const step = (timestamp) => {
                                if (!startTimestamp) startTimestamp = timestamp;
                                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                                
                                // Easing
                                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                                
                                const current = easeOutQuart * value;
                                const formatted = Number.isInteger(value) 
                                    ? Math.floor(current) 
                                    : current.toFixed(1);
                                
                                el.innerHTML = formatted + suffix;
                                
                                if (progress < 1) {
                                    window.requestAnimationFrame(step);
                                } else {
                                    el.innerHTML = originalText; // Ensure exact final value
                                }
                            };
                            window.requestAnimationFrame(step);
                        }
                    });
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(metricsSection);
    }

    // --- BOOKING FORM REDIRECT ---
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const project = document.getElementById('project').value;
            
            // Construct a message for the user to paste or just context
            // Redirect to Telegram
            window.open('https://t.me/xswandx5', '_blank');
            
            // Optional: Reset form
            bookingForm.reset();
        });
    }
});
