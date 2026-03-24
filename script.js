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