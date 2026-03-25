// script.js
function switchTab(service) {
    // Hide all content
    const contents = document.querySelectorAll('.service-tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Reset all tabs
    const tabs = document.querySelectorAll('[id^="tab-"]');
    tabs.forEach(tab => {
        tab.classList.remove('bg-primary', 'text-white', 'shadow-lg');
        tab.classList.add('text-[#191c1d]', 'bg-slate-100', 'hover:bg-slate-200');
    });

    // Show active content
    document.getElementById('content-' + service).classList.add('active');

    // Set active tab style
    const activeTab = document.getElementById('tab-' + service);
    activeTab.classList.remove('text-[#191c1d]', 'bg-slate-100', 'hover:bg-slate-200');
    activeTab.classList.add('bg-primary', 'text-white', 'shadow-lg');
}

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
                counter.textContent = target + '+';
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