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