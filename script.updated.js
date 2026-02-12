document.addEventListener('DOMContentLoaded', () => {

    // --- NAVIGATION MENU OVERLAY LOGIC ---
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const overlayLinks = document.querySelectorAll('.overlay-nav-link');

    const openMenu = () => {
        menuOverlay.classList.add('is-open');
        document.body.classList.add('no-scroll');
    };

    const closeMenu = () => {
        menuOverlay.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
    };

    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    overlayLinks.forEach(link => link.addEventListener('click', closeMenu));

    // --- INTERACTIVE SCROLL ANIMATION LOGIC (REVISED) ---

    // 1. Special handling for the hero parallax effect (tied to scroll position)
    const heroSection = document.querySelector('[data-animation="hero-parallax"]');
    if (heroSection) {
        const handleHeroParallax = () => {
            const rect = heroSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight && rect.bottom > 0) {
                const sectionHeight = rect.height;
                const viewportCenter = windowHeight / 2;
                const sectionCenter = rect.top + sectionHeight / 2;
                const distanceFromCenter = viewportCenter - sectionCenter;
                const progress = distanceFromCenter / viewportCenter;
                
                const opacity = 1 - Math.abs(progress);
                const translation = progress * 100;
                const rotation = progress * 5;

                const heroText = heroSection.querySelector('.hero-text-content');
                const heroImage = heroSection.querySelector('.hero-image-slider');
                if (heroText) {
                    heroText.style.opacity = 1 - Math.abs(progress * 1.5);
                    heroText.style.transform = `translateX(${translation * -1.2}px) rotate(${rotation * -0.5}deg)`;
                }
                if (heroImage) {
                    heroImage.style.opacity = 1 - Math.abs(progress * 1.5);
                    heroImage.style.transform = `translateX(${translation * 1.2}px) rotate(${rotation * 0.5}deg)`;
                }
            }
        };
        
        let isTicking = false;
        document.addEventListener('scroll', () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    handleHeroParallax();
                    isTicking = false;
                });
                isTicking = true;
            }
        });
        handleHeroParallax(); // Initial call
    }

    // 2. Modern "fade-in-on-scroll" for all other sections using Intersection Observer
    const animatedSections = document.querySelectorAll('.interactive-section:not([data-animation="hero-parallax"])');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // When the element is in view
            if (entry.isIntersecting) {
                // Add a delay if specified in data-delay attribute
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                
                // Stop observing the element once it's visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Attach the observer to each animated section
    animatedSections.forEach(section => {
        observer.observe(section);
    });


    // --- SLIDER LOGIC (REMAINS THE SAME) ---
    // --- HERO IMAGE SLIDER LOGIC ---
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const prevHeroButton = document.querySelector('.hero-image-slider .slider-nav.prev');
    const nextHeroButton = document.querySelector('.hero-image-slider .slider-nav.next');
    
    if (sliderWrapper && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;

        function applySlideAnimation(index) {
            slides.forEach(s => s.classList.remove('slide-is-active'));
            if (slides[index]) slides[index].classList.add('slide-is-active');
        }

        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            else if (index >= totalSlides) index = 0;
            
            sliderWrapper.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
            applySlideAnimation(currentIndex);
        }

        if(prevHeroButton && nextHeroButton) {
            prevHeroButton.addEventListener('click', () => goToSlide(currentIndex - 1));
            nextHeroButton.addEventListener('click', () => goToSlide(currentIndex + 1));
        }
        applySlideAnimation(0);
    }

    // --- PROGRAMS SLIDER LOGIC ---
    const programsSlider = document.querySelector('.programs-slider-wrapper');
    if (programsSlider) {
        const prevProgramBtn = document.querySelector('.program-slider-nav.prev');
        const nextProgramBtn = document.querySelector('.program-slider-nav.next');
        const paginationContainer = document.querySelector('.programs-pagination');
        const programCards = programsSlider.querySelectorAll('.program-card');
        
        let currentIndex = 0;
        let cardsPerPage = getCardsPerPage();
        let totalCards = programCards.length;
        let totalPages = Math.ceil(totalCards / cardsPerPage);

        function getCardsPerPage() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 991) return 2;
            return 3;
        }

        function setupPagination() {
            if (!paginationContainer) return;
            paginationContainer.innerHTML = '';
            totalPages = Math.ceil(totalCards / cardsPerPage);
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToProgramPage(i));
                paginationContainer.appendChild(dot);
            }
        }

        function updateSlider() {
            const newCardsPerPage = getCardsPerPage();
            if (newCardsPerPage !== cardsPerPage) {
                cardsPerPage = newCardsPerPage;
                setupPagination();
            }
            goToProgramPage(Math.floor(currentIndex / cardsPerPage));
        }

        function goToProgramPage(pageIndex) {
            let newCurrentIndex = pageIndex * cardsPerPage;
            
            if (newCurrentIndex > totalCards - cardsPerPage) newCurrentIndex = totalCards - cardsPerPage;
            if (newCurrentIndex < 0) newCurrentIndex = 0;

            currentIndex = newCurrentIndex;

            const cardElement = programsSlider.querySelector('.program-card');
            if (!cardElement) return;

            const cardWidth = cardElement.offsetWidth;
            const cardStyle = window.getComputedStyle(cardElement);
            const cardMargin = parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);
            
            const offset = (cardWidth + cardMargin) * currentIndex;
            
            programsSlider.style.transform = `translateX(-${offset}px)`;

            if (!paginationContainer) return;
            const dots = paginationContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => dot.classList.toggle('active', index === pageIndex));
        }
        
        if(nextProgramBtn) nextProgramBtn.addEventListener('click', () => {
            let currentPage = (cardsPerPage === 1) ? currentIndex : Math.floor(currentIndex / cardsPerPage);
            if (currentPage < totalPages - 1) goToProgramPage(currentPage + 1);
        });

        if(prevProgramBtn) prevProgramBtn.addEventListener('click', () => {
            let currentPage = (cardsPerPage === 1) ? currentIndex : Math.floor(currentIndex / cardsPerPage);
            if (currentPage > 0) goToProgramPage(currentPage - 1);
        });

        window.addEventListener('resize', updateSlider);
        setupPagination();
    }

    // --- TESTIMONIALS SLIDER LOGIC ---
    const testimonialWrapper = document.querySelector('.testimonial-slider-wrapper');
    if (testimonialWrapper) {
        const prevTestimonialBtn = document.querySelector('.testimonial-slider-nav.prev');
        const nextTestimonialBtn = document.querySelector('.testimonial-slider-nav.next');
        const testimonialPagination = document.querySelector('.testimonial-pagination');
        const testimonialSlides = document.querySelectorAll('.testimonial-slide');
        const totalTestimonialSlides = testimonialSlides.length;
        let currentTestimonialIndex = 0;

        function setupTestimonialPagination() {
            if (!testimonialPagination) return;
            testimonialPagination.innerHTML = '';
            for (let i = 0; i < totalTestimonialSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToTestimonialSlide(i));
                testimonialPagination.appendChild(dot);
            }
        }

        function updateTestimonialPagination() {
            if (!testimonialPagination) return;
            const dots = testimonialPagination.querySelectorAll('.dot');
            dots.forEach((dot, index) => dot.classList.toggle('active', index === currentTestimonialIndex));
        }

        function goToTestimonialSlide(index) {
            if (index < 0) index = totalTestimonialSlides - 1;
            else if (index >= totalTestimonialSlides) index = 0;
            
            testimonialWrapper.style.transform = `translateX(-${index * 100}%)`;
            currentTestimonialIndex = index;
            updateTestimonialPagination();
        }

        if(prevTestimonialBtn) prevTestimonialBtn.addEventListener('click', () => goToTestimonialSlide(currentTestimonialIndex - 1));
        if(nextTestimonialBtn) nextTestimonialBtn.addEventListener('click', () => goToTestimonialSlide(currentTestimonialIndex + 1));

        setupTestimonialPagination();
    }

    // --- LAUNCHED PROJECTS TOGGLE LOGIC (CORRECTED) ---
    const showLaunchesBtn = document.getElementById('show-launches-btn');
    const launchedProjectsSection = document.getElementById('launched-projects');

    if (showLaunchesBtn && launchedProjectsSection) {
        // Ensure the section is hidden by default
        launchedProjectsSection.classList.add('hidden');

        showLaunchesBtn.addEventListener('click', () => {
            const isHidden = launchedProjectsSection.classList.contains('hidden');

            if (isHidden) {
                // To show: remove 'hidden' class to start the transition
                launchedProjectsSection.classList.remove('hidden');
                showLaunchesBtn.innerHTML = '<i class="fas fa-eye-slash"></i> <span>Hide Results</span>';
                
                // Scroll to the button's container to make sure the new section is in view.
                setTimeout(() => {
                    showLaunchesBtn.parentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 50); // A small delay to ensure the element is visible before scrolling
            } else {
                // To hide: add 'hidden' class
                launchedProjectsSection.classList.add('hidden');
                showLaunchesBtn.innerHTML = '<i class="fas fa-rocket"></i> <span>View Launch Results</span>';
            }
        });
    }
});


/* ===== MATRIX RED EFFECT ===== */
const matrixCanvas = document.getElementById('matrix-canvas');
if (matrixCanvas) {
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const letters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ$@#';
    const fontSize = 16;
    const columns = matrixCanvas.width / fontSize;
    const drops = Array.from({ length: columns }).fill(1);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(5, 2, 10, 0.08)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        ctx.fillStyle = 'rgba(225, 6, 0, 0.7)';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 50);
}
