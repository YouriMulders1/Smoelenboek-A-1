// Smoelenboek Dynamic Application
class SmoelenboekApp {
    constructor() {
        this.profiles = [];
        this.currentView = 'home';
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        this.searchTerm = '';
        this.selectedTheme = 'all';
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.applyDarkMode();
        this.handleRouting();
        this.render();
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            this.profiles = data.profiles;
            this.settings = data.settings;
        } catch (error) {
            console.error('Error loading data:', error);
            this.profiles = [];
        }
    }

    setupEventListeners() {
        // Dark mode toggle
        document.getElementById('darkModeToggle')?.addEventListener('click', () => {
            this.toggleDarkMode();
        });

        // Search input
        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderProfiles();
        });

        // Theme filter
        document.getElementById('themeFilter')?.addEventListener('change', (e) => {
            this.selectedTheme = e.target.value;
            this.renderProfiles();
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRouting();
        });

        // Close modal on outside click
        document.getElementById('modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                this.closeModal();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    handleRouting() {
        const hash = window.location.hash.slice(1) || 'home';
        this.currentView = hash;

        if (hash.startsWith('profile/')) {
            const profileId = hash.split('/')[1];
            this.showProfileModal(profileId);
        } else {
            this.closeModal();
        }
    }

    render() {
        this.renderHeader();
        this.renderProfiles();
        this.addAnimations();
    }

    renderHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        header.innerHTML = `
            <div class="header-content">
                <h1 class="animated-title">${this.settings?.title || 'Smoelenboek'}</h1>
                <p class="subtitle">${this.settings?.subtitle || 'Student Portfolio'}</p>
                <div class="header-controls">
                    <div class="search-box">
                        <input type="text" id="searchInput" placeholder="Search profiles..."
                               value="${this.searchTerm}">
                        <span class="search-icon">🔍</span>
                    </div>
                    <select id="themeFilter" class="theme-filter">
                        <option value="all">All Themes</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="dark">Dark</option>
                        <option value="purple">Purple</option>
                    </select>
                    <button id="darkModeToggle" class="dark-mode-toggle"
                            title="Toggle Dark Mode">
                        ${this.darkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>
        `;

        // Re-attach event listeners after rendering
        document.getElementById('darkModeToggle')?.addEventListener('click', () => {
            this.toggleDarkMode();
        });

        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderProfiles();
        });

        document.getElementById('themeFilter')?.addEventListener('change', (e) => {
            this.selectedTheme = e.target.value;
            this.renderProfiles();
        });
    }

    renderProfiles() {
        const container = document.getElementById('profilesContainer');
        if (!container) return;

        const filteredProfiles = this.profiles.filter(profile => {
            const matchesSearch = profile.name.toLowerCase().includes(this.searchTerm) ||
                                profile.role.toLowerCase().includes(this.searchTerm) ||
                                profile.bio.toLowerCase().includes(this.searchTerm);

            const matchesTheme = this.selectedTheme === 'all' || profile.theme === this.selectedTheme;

            return matchesSearch && matchesTheme;
        });

        if (filteredProfiles.length === 0) {
            container.innerHTML = '<div class="no-results">No profiles found</div>';
            return;
        }

        container.innerHTML = filteredProfiles.map((profile, index) => `
            <div class="profile-card ${profile.theme}"
                 data-profile-id="${profile.id}"
                 style="animation-delay: ${index * 0.1}s">
                <div class="profile-image-wrapper">
                    <img src="${profile.image}" alt="${profile.name}" class="profile-image">
                    <div class="profile-overlay">
                        <span class="view-profile">View Profile</span>
                    </div>
                </div>
                <div class="profile-info">
                    <h2 class="profile-name">${profile.name}</h2>
                    <p class="profile-role">${profile.role}</p>
                    <div class="profile-meta">
                        ${profile.age ? `<span class="meta-item">Age: ${profile.age}</span>` : ''}
                        ${profile.office ? `<span class="meta-item">${profile.office}</span>` : ''}
                    </div>
                    <p class="profile-bio">${profile.bio}</p>
                    <div class="profile-hobbies">
                        ${profile.hobbies.map(hobby => `<span class="hobby-tag">${hobby}</span>`).join('')}
                    </div>
                </div>
                <button class="btn-view-details" onclick="app.showProfileModal('${profile.id}')">
                    View Details
                </button>
            </div>
        `).join('');

        this.addCardAnimations();
    }

    showProfileModal(profileId) {
        const profile = this.profiles.find(p => p.id === profileId);
        if (!profile) return;

        const modal = document.getElementById('modal');
        const modalContent = document.getElementById('modalContent');

        modalContent.innerHTML = `
            <button class="modal-close" onclick="app.closeModal()">×</button>
            <div class="modal-header ${profile.theme}">
                <img src="${profile.image}" alt="${profile.name}" class="modal-profile-image">
                <div class="modal-profile-info">
                    <h2>${profile.name}</h2>
                    <p class="modal-role">${profile.role}</p>
                </div>
            </div>
            <div class="modal-body">
                <div class="info-section">
                    <h3>About</h3>
                    <p>${profile.bio}</p>
                </div>

                <div class="info-section">
                    <h3>Contact Information</h3>
                    <div class="contact-grid">
                        ${profile.email ? `
                            <div class="contact-item">
                                <span class="contact-icon">📧</span>
                                <a href="mailto:${profile.email}">${profile.email}</a>
                            </div>
                        ` : ''}
                        ${profile.phone ? `
                            <div class="contact-item">
                                <span class="contact-icon">📱</span>
                                <a href="tel:${profile.phone}">${profile.phone}</a>
                            </div>
                        ` : ''}
                        ${profile.office ? `
                            <div class="contact-item">
                                <span class="contact-icon">🏢</span>
                                <span>${profile.office}</span>
                            </div>
                        ` : ''}
                        ${profile.location ? `
                            <div class="contact-item">
                                <span class="contact-icon">📍</span>
                                <span>${profile.location}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                ${profile.hobbies && profile.hobbies.length > 0 ? `
                    <div class="info-section">
                        <h3>Hobbies & Interests</h3>
                        <div class="hobbies-list">
                            ${profile.hobbies.map(hobby => `
                                <span class="hobby-badge ${profile.theme}">${hobby}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${profile.work ? `
                    <div class="info-section">
                        <h3>Work</h3>
                        <p>${profile.work}</p>
                    </div>
                ` : ''}

                ${profile.age ? `
                    <div class="info-section">
                        <h3>Additional Info</h3>
                        <p>Age: ${profile.age}</p>
                    </div>
                ` : ''}
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Update URL without page reload
        window.history.pushState({}, '', `#profile/${profileId}`);
    }

    closeModal() {
        const modal = document.getElementById('modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        window.history.pushState({}, '', '#home');
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
        this.applyDarkMode();

        // Update button
        const button = document.getElementById('darkModeToggle');
        if (button) {
            button.textContent = this.darkMode ? '☀️' : '🌙';
        }
    }

    applyDarkMode() {
        document.body.classList.toggle('dark-mode', this.darkMode);
    }

    addAnimations() {
        // Add scroll-triggered animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.profile-card').forEach(card => {
            observer.observe(card);
        });
    }

    addCardAnimations() {
        // Add hover effects and interactions
        document.querySelectorAll('.profile-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });

            // Click to view details
            card.addEventListener('click', function(e) {
                if (!e.target.closest('button')) {
                    const profileId = this.dataset.profileId;
                    app.showProfileModal(profileId);
                }
            });
        });
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SmoelenboekApp();
});

// Auto-refresh profiles every 30 seconds (for dynamic updates)
setInterval(() => {
    if (app && document.visibilityState === 'visible') {
        app.loadData().then(() => {
            app.renderProfiles();
        });
    }
}, 30000);
