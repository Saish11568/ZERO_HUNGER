// Main Interactions

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-6 right-6 p-4 rounded-[20px] shadow-ambient z-50 transform transition-all duration-300 translate-y-2 opacity-0 flex items-center gap-3 border ${type === 'success' ? 'bg-white border-green-200' : 'bg-white border-red-200'}`;
    
    const icon = document.createElement('span');
    icon.className = `material-symbols-outlined ${type === 'success' ? 'text-green-500' : 'text-red-500'}`;
    icon.innerText = type === 'success' ? 'check_circle' : 'error';
    
    const text = document.createElement('span');
    text.className = 'font-body-md font-semibold text-slate-800';
    text.innerText = message;
    
    toast.appendChild(icon);
    toast.appendChild(text);
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-[-10px]');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Dynamic Sidebar Rendering
function renderSidebar() {
    const navContainer = document.querySelector('nav div.flex-1.flex.flex-col') || 
                         document.querySelector('nav.flex-1') || 
                         document.querySelector('#main-nav') ||
                         document.querySelector('nav .flex-1.py-6.px-4') ||
                         document.querySelector('nav .flex-1.overflow-y-auto ul') ||
                         document.querySelector('nav .flex-1.overflow-y-auto');
    
    if (!navContainer) return;

    const user = window.auth?.getUser();
    if (!user) return;

    const currentPath = window.location.pathname;
    
    let links = [];
    if (user.role === 'NGO') {
        links = [
            { name: 'Dashboard', icon: 'dashboard', href: 'NGO_Dashboard.html' },
            { name: 'Food Alerts', icon: 'campaign', href: 'Food_Alerts.html' },
            { name: 'Incoming Deliveries', icon: 'local_shipping', href: 'Incoming_Deliveries.html' },
            { name: 'Volunteers', icon: 'group', href: 'Volunteer_Fleet.html' },
            { name: 'Meal Forecast', icon: 'trending_up', href: 'Meal_Forecast.html' },
            { name: 'Analytics', icon: 'monitoring', href: 'Analytics.html' }
        ];
    } else if (user.role === 'Donor' || user.role === 'Supermarket') {
        links = [
            { name: 'Dashboard', icon: 'dashboard', href: 'Donor_Dashboard.html' },
            { name: 'List Food', icon: 'post_add', href: 'List_Food.html' },
            { name: 'My Donations', icon: 'volunteer_activism', href: 'My_Donations.html' },
            { name: 'Analytics', icon: 'monitoring', href: 'Analytics.html' }
        ];
    } else if (user.role === 'Volunteer') {
        links = [
            { name: 'Dashboard', icon: 'dashboard', href: 'Zone_Dispatch.html' },
            { name: 'Volunteers', icon: 'group', href: 'Volunteer_Fleet.html' },
            { name: 'Analytics', icon: 'monitoring', href: 'Analytics.html' }
        ];
    }

    // Clear and render
    navContainer.innerHTML = '';
    links.forEach(link => {
        const isActive = currentPath.includes(link.href) && link.href !== '#' && link.href !== '';
        const a = document.createElement('a');
        a.href = link.href;
        
        // Consistent classes based on original dashboard styles
        if (isActive) {
            a.className = "flex items-center gap-3 px-6 py-3 text-[#0D7377] bg-teal-50/50 dark:bg-teal-900/20 font-semibold border-r-4 border-[#0D7377] transition-all duration-200 ease-in-out";
        } else {
            a.className = "flex items-center gap-3 px-6 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors hover:bg-teal-50/30 dark:hover:bg-teal-900/10 transition-all duration-200 ease-in-out";
        }

        const icon = document.createElement('span');
        icon.className = "material-symbols-outlined text-xl";
        icon.innerText = link.icon;
        if (isActive) icon.style.fontVariationSettings = "'FILL' 1";

        const text = document.createElement('span');
        text.innerText = ` ${link.name}`;
        
        a.appendChild(icon);
        a.appendChild(text);

        // Prevent redirect if already on the page
        if (isActive) {
            a.addEventListener('click', (e) => {
                e.preventDefault();
            });
        }

        // If navContainer is a ul, we should append li elements
        if (navContainer.tagName.toLowerCase() === 'ul') {
            const li = document.createElement('li');
            li.appendChild(a);
            navContainer.appendChild(li);
        } else {
            navContainer.appendChild(a);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth check
    if (window.auth && typeof window.auth.checkAuth === 'function') {
        window.auth.checkAuth();
    }
    
    // 2. Sidebar
    renderSidebar();

    // 3. Global click interceptors
    const isDashboard = window.location.pathname.includes('Dashboard') || 
                        window.location.pathname.includes('Dispatch') || 
                        window.location.pathname.includes('Alerts') || 
                        window.location.pathname.includes('Forecast') || 
                        window.location.pathname.includes('Analytics') ||
                        window.location.pathname.includes('Fleet') ||
                        window.location.pathname.includes('Donation') ||
                        window.location.pathname.includes('List');
    
    const clickElements = document.querySelectorAll('button, a');
    clickElements.forEach(el => {
        const text = el.innerText.trim().toLowerCase();
        const icon = el.querySelector('.material-symbols-outlined')?.innerText;
        
        // Handle Logout
        if (text === 'logout' || icon === 'logout' || el.id === 'logout-btn' || el.classList.contains('logout-btn')) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.auth) window.auth.logout();
            });
            return;
        }

        // Handle Dashboard role-specific links
        if (text === 'dashboard' || icon === 'dashboard') {
            el.addEventListener('click', (e) => {
                const user = window.auth?.getUser();
                if (user) {
                    e.preventDefault();
                    if (user.role === 'NGO') window.location.href = 'NGO_Dashboard.html';
                    else if (user.role === 'Donor' || user.role === 'Supermarket') window.location.href = 'Donor_Dashboard.html';
                    else if (user.role === 'Volunteer') window.location.href = 'Zone_Dispatch.html';
                }
            });
            return;
        }

        // Handle Login/Reg redirects (only on landing/public pages)
        if (!isDashboard) {
            if (text === 'sign in' || text.includes('log in')) {
                el.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'Login.html'; });
            } else if (text.includes('join as restaurant') || text === 'business donor' || text === 'donor') {
                el.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'Registration.html'; });
            } else if (text.includes('join as ngo') || text === 'ngo partner') {
                el.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'NGO_Registration.html'; });
            } else if (text.includes('volunteer')) {
                el.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'Volunteer_Registration.html'; });
            }
        }
    });

    // 4. Form handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            // Let page-specific scripts handle login/registration forms
            const isAuthForm = form.id === 'login-form' || form.id === 'registration-form' || window.location.pathname.includes('Registration');
            if (isAuthForm) return;

            e.preventDefault();
            showToast('Action successful!');
            form.reset();
        });
    });

    // 5. Shared Dashboard Component Logic
    // Preferences toggle
    document.querySelectorAll('.pref-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('bg-primary-container');
            toggle.classList.toggle('text-on-primary');
            toggle.classList.toggle('bg-surface-container');
            toggle.classList.toggle('text-on-surface-variant');
            const icon = toggle.querySelector('.material-symbols-outlined');
            if (icon) icon.innerText = icon.innerText === 'add' ? 'check' : 'add';
            showToast('Preference updated!');
        });
    });

    // NGO Accept/Skip
    const acceptBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Accept Delivery'));
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            showToast('Delivery Accepted!');
            acceptBtn.closest('.mb-stack-lg')?.remove();
        });
    }
    const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Skip'));
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            showToast('Alert skipped.');
            skipBtn.closest('.mb-stack-lg')?.remove();
        });
    }

    // Business Type Selection (Registration)
    const businessTypeGrid = document.querySelector('.grid.grid-cols-2.sm\\:grid-cols-3');
    if (businessTypeGrid) {
        const typeButtons = businessTypeGrid.querySelectorAll('button[type="button"]');
        const typeInput = Array.from(document.querySelectorAll('label')).find(l => l.innerText.trim().toUpperCase() === 'BUSINESS TYPE')?.nextElementSibling;

        typeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                typeButtons.forEach(b => b.className = 'bg-surface border-1.5 border-outline-variant text-on-surface rounded-[10px] py-3 px-4 font-body-sm text-center hover:border-primary-container transition-colors');
                btn.className = 'bg-primary-container text-on-primary rounded-[10px] py-3 px-4 font-body-sm font-semibold text-center shadow-lg';
                if (typeInput) typeInput.value = btn.innerText.trim();
            });
        });
    }

    // 6. List Food Page specific logic
    if (window.location.pathname.includes('List_Food.html')) {
        const categoryButtons = document.querySelectorAll('.flex.gap-4.overflow-x-auto button');
        // Filter out sidebar buttons if any, just to be safe. The storage buttons are in the main area.
        const storageButtons = document.querySelectorAll('.mb-stack-lg .flex.gap-3 button');
        const donationInput = document.querySelector('input[type="text"]');
        const trlValue = document.querySelector('.font-display.text-display');
        const listDonationBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('List Donation'));

        // Category selection
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Reset all
                categoryButtons.forEach(b => {
                    b.className = 'flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden relative group cursor-pointer border-2 border-transparent hover:border-primary-container transition-all';
                    const span = b.querySelector('div > span');
                    if (span) {
                        const text = span.innerText.replace('check_circle', '').trim();
                        span.className = 'text-white font-label-md text-label-md font-semibold';
                        span.innerHTML = text;
                    }
                });

                // Set active
                btn.className = 'flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden relative group cursor-pointer border-2 border-primary-container transition-all';
                const span = btn.querySelector('div > span');
                if (span) {
                    const text = span.innerText.trim();
                    span.className = 'text-white font-label-md text-label-md font-semibold flex items-center gap-1';
                    span.innerHTML = `<span class="material-symbols-outlined text-[14px]">check_circle</span> ${text}`;
                    
                    // Update input
                    if (donationInput) donationInput.value = `Assorted ${text}`;
                    
                    // Update TRL based on category loosely
                    if (trlValue) {
                        const trls = { 'Grains': 24, 'Curries': 4, 'Breads': 12, 'Salads': 2, 'Desserts': 6 };
                        trlValue.innerText = trls[text] || 4;
                    }
                }
            });
        });

        // Storage selection
        storageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                storageButtons.forEach(b => {
                    b.className = 'px-5 py-2 rounded-full border border-outline-variant/50 text-on-surface-variant hover:border-primary-container hover:text-primary-container font-label-md text-label-md transition-colors';
                });
                btn.className = 'px-5 py-2 rounded-full border border-primary-container bg-primary-container text-white font-label-md text-label-md transition-colors';
                
                // Adjust TRL based on storage
                if (trlValue) {
                    let currentTrl = parseInt(trlValue.innerText);
                    const type = btn.innerText.trim();
                    if (type === 'Refrigerated') currentTrl = Math.floor(currentTrl * 1.5) || 1;
                    if (type === 'Hot') currentTrl = Math.max(1, Math.floor(currentTrl * 0.8));
                    trlValue.innerText = currentTrl;
                }
            });
        });

        // List donation
        if (listDonationBtn) {
            listDonationBtn.addEventListener('click', () => {
                showToast('Donation listed successfully!');
                setTimeout(() => {
                    window.location.href = 'Donor_Dashboard.html';
                }, 1500);
            });
        }
    }
});

window.showToast = showToast;
