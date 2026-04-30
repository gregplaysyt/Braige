// script.js
function switchTab(service) {
    const contents = document.querySelectorAll('.service-tab-content');

    const currentActive = document.querySelector('.service-tab-content.active');
    const nextContent = document.getElementById('content-' + service);

    if (!nextContent || currentActive === nextContent) return;

    contents.forEach(content => {
        if (content !== currentActive && content !== nextContent) {
            content.classList.add('hidden');
            content.classList.remove('active');
        }
    });

    if (currentActive) {
        currentActive.classList.remove('active');
        currentActive.addEventListener('transitionend', () => {
            currentActive.classList.add('hidden');
        }, { once: true });
    }

    // Reset all tabs
    const tabs = document.querySelectorAll('[id^="tab-"]');
    tabs.forEach(tab => {
        tab.classList.remove('bg-primary', 'text-white', 'shadow-lg');
        tab.classList.add('text-[#191c1d]', 'bg-slate-100', 'hover:bg-slate-200');
    });

    // Show next panel (fade in)
    nextContent.classList.remove('hidden');
    nextContent.classList.remove('active');
    requestAnimationFrame(() => {
        nextContent.classList.add('active');
    });

    // Set active tab style
    const activeTab = document.getElementById('tab-' + service);
    activeTab.classList.remove('text-[#191c1d]', 'bg-slate-100', 'hover:bg-slate-200');
    activeTab.classList.add('bg-primary', 'text-white', 'shadow-lg');
}

// Initialize services tabs so non-active are not in layout
document.addEventListener('DOMContentLoaded', () => {
    const contents = document.querySelectorAll('.service-tab-content');
    if (!contents.length) return;
    contents.forEach(content => {
        if (!content.classList.contains('active')) content.classList.add('hidden');
    });
    
    // Initialize Neumorphic Accordions
    const accordions = document.querySelectorAll('.accordion-item');
    accordions.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if(!header) return;
        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');
            
            // Close all siblings
            const siblings = item.parentElement.querySelectorAll('.accordion-item');
            siblings.forEach(sibling => {
                sibling.classList.remove('is-open');
                sibling.querySelector('.accordion-content').style.gridTemplateRows = '0fr';
                sibling.querySelector('.chevron').style.transform = 'rotate(0deg)';
                sibling.classList.remove('shadow-[inset_6px_6px_12px_#d9dbe9,inset_-6px_-6px_12px_#ffffff]', 'bg-[#eceef8]');
                sibling.classList.add('shadow-[8px_8px_16px_#d9dbe9,-8px_-8px_16px_#ffffff]', 'bg-[#f3f4fb]');
            });

            if (!isOpen) {
                // Open this item
                item.classList.add('is-open');
                item.querySelector('.accordion-content').style.gridTemplateRows = '1fr';
                item.querySelector('.chevron').style.transform = 'rotate(180deg)';
                item.classList.remove('shadow-[8px_8px_16px_#d9dbe9,-8px_-8px_16px_#ffffff]', 'bg-[#f3f4fb]');
                item.classList.add('shadow-[inset_6px_6px_12px_#d9dbe9,inset_-6px_-6px_12px_#ffffff]', 'bg-[#eceef8]');
            }
        });
    });
});

// Counter animation on scroll
function animateCounters(element) {
    const counters = element.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 60; // Animate over ~60 frames
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                // Keep the 100 counter as a true percentage, but show other counters as "X+"
                // (e.g. 50 -> "50+")
                const suffix = target === 100 ? '%' : '+';
                counter.textContent = target + suffix;
            }
        };

        updateCounter();
    });
}

// Intersection Observer for scroll-triggered animation
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.grid.grid-cols-3');

    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters(entry.target.closest('div'));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }
});

// Scroll animation observer for all elements with scroll-animate class
document.addEventListener('DOMContentLoaded', () => {
    const scrollAnimateElements = document.querySelectorAll('.scroll-animate');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    scrollAnimateElements.forEach(element => {
        observer.observe(element);
    });
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!mobileMenuButton || !mobileMenu) return;

    const mobileMenuIcon = mobileMenuButton.querySelector('.material-symbols-outlined');

    const setOpen = (open) => {
        mobileMenu.classList.toggle('hidden', !open);
        mobileMenuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (mobileMenuIcon) mobileMenuIcon.textContent = open ? 'close' : 'menu';
    };

    const getIsOpen = () => !mobileMenu.classList.contains('hidden');
    setOpen(false);

    mobileMenuButton.addEventListener('click', () => {
        setOpen(!getIsOpen());
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('click', (e) => {
        if (!getIsOpen()) return;
        if (mobileMenu.contains(e.target)) return;
        if (mobileMenuButton.contains(e.target)) return;
        setOpen(false);
    }, { capture: true });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
    });
});

// Portfolio Slideshow logic
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.portfolio-slider');
    
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const indicators = slider.querySelectorAll('.indicator-btn');
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');
        
        if (!slides.length) return;
        
        let currentIndex = parseInt(slider.getAttribute('data-current-slide') || '0');
        let autoPlayInterval;
        const isAutoPlay = slider.getAttribute('data-auto-play') === 'true';
        
        // Extract the active color class dynamically (bg-primary or bg-secondary)
        let activeIndicatorClass = 'bg-primary';
        if (indicators.length > 0) {
            const match = indicators[0].className.match(/bg-(primary|secondary)/);
            if (match) activeIndicatorClass = match[0];
        }
        
        function updateSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            // Hide current slide
            slides[currentIndex].classList.remove('opacity-100');
            slides[currentIndex].classList.add('opacity-0', 'pointer-events-none');
            
            // Update current indicator
            if (indicators[currentIndex]) {
                indicators[currentIndex].classList.remove('w-6', activeIndicatorClass);
                indicators[currentIndex].classList.add('w-2', 'bg-white');
            }
            
            // Set new current index
            currentIndex = index;
            slider.setAttribute('data-current-slide', currentIndex);
            
            // Show new slide
            slides[currentIndex].classList.remove('opacity-0', 'pointer-events-none');
            slides[currentIndex].classList.add('opacity-100');
            
            // Update new indicator
            if (indicators[currentIndex]) {
                indicators[currentIndex].classList.remove('w-2', 'bg-white');
                indicators[currentIndex].classList.add('w-6', activeIndicatorClass);
            }
        }
        
        function nextSlide() { updateSlide(currentIndex + 1); }
        function prevSlide() { updateSlide(currentIndex - 1); }
        
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        indicators.forEach((indicator, idx) => {
            indicator.addEventListener('click', () => updateSlide(idx));
        });
        
        function startAutoPlay() {
            if (isAutoPlay) {
                autoPlayInterval = setInterval(nextSlide, 5000);
            }
        }
        
        function stopAutoPlay() {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        }
        
        // Pause on hover
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
        
        // Initialize
        startAutoPlay();
    });
});