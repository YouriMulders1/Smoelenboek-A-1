// Smoelenboek Dynamic Application - Enhanced Edition
class SmoelenboekApp {
    constructor() {
        this.profiles = [];
        this.currentView = 'home';
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        this.searchTerm = '';
        this.selectedTheme = 'all';
        this.currentTab = 'about';
        this.lightboxImage = null;
        this.init();
    }

    async init() {
        this.showLoadingScreen();
        await this.loadData();
        this.setupEventListeners();
        this.applyDarkMode();
        this.handleRouting();
        this.render();
        this.hideLoadingScreen();
        this.initParticles();
    }

    showLoadingScreen() {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="loadingScreen" class="loading-screen">
                <div class="loading-content">
                    <div class="spinner-container">
                        <div class="spinner"></div>
                        <div class="spinner-ring"></div>
                    </div>
                    <h2 class="loading-text">Loading Smoelenboek...</h2>
                    <div class="loading-bar">
                        <div class="loading-progress"></div>
                    </div>
                </div>
            </div>
        `);
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => loadingScreen.remove(), 500);
            }
        }, 1000);
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
        document.addEventListener('click', (e) => {
            if (e.target.id === 'darkModeToggle') {
                this.toggleDarkMode();
            }
        });

        // Search input
        document.addEventListener('input', (e) => {
            if (e.target.id === 'searchInput') {
                this.searchTerm = e.target.value.toLowerCase();
                this.renderProfiles();
            }
        });

        // Theme filter
        document.addEventListener('change', (e) => {
            if (e.target.id === 'themeFilter') {
                this.selectedTheme = e.target.value;
                this.renderProfiles();
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRouting();
        });

        // Close modal on outside click
        document.addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                this.closeModal();
            }
            if (e.target.classList.contains('modal-close')) {
                this.closeModal();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeLightbox();
            }
        });

        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-button')) {
                this.switchTab(e.target.dataset.tab);
            }
        });

        // Lightbox
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('project-image')) {
                this.openLightbox(e.target.src);
            }
            if (e.target.id === 'lightbox') {
                this.closeLightbox();
            }
        });

        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            this.handleParallax();
        });
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
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
                <div class="header-top">
                    <div class="logo-section">
                        <div class="logo-icon">🎓</div>
                        <div>
                            <h1 class="animated-title">${this.settings?.title || 'Smoelenboek'}</h1>
                            <p class="subtitle">${this.settings?.subtitle || 'Student Portfolio'}</p>
                        </div>
                    </div>
                    <button id="darkModeToggle" class="dark-mode-toggle" title="Toggle Dark Mode">
                        ${this.darkMode ? '☀️' : '🌙'}
                    </button>
                </div>
                <div class="header-controls">
                    <div class="search-box">
                        <span class="search-icon">🔍</span>
                        <input type="text" id="searchInput" placeholder="Search by name, role, or skills..."
                               value="${this.searchTerm}">
                    </div>
                    <select id="themeFilter" class="theme-filter">
                        <option value="all">🎨 All Themes</option>
                        <option value="blue">🔵 Blue</option>
                        <option value="green">🟢 Green</option>
                        <option value="dark">⚫ Dark</option>
                        <option value="purple">🟣 Purple</option>
                    </select>
                </div>
                <div class="header-stats">
                    <div class="stat-item">
                        <span class="stat-number">${this.profiles.length}</span>
                        <span class="stat-label">Students</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.settings?.year || '2024'}</span>
                        <span class="stat-label">Academic Year</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.settings?.course || 'Software'}</span>
                        <span class="stat-label">Course</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderProfiles() {
        const container = document.getElementById('profilesContainer');
        if (!container) return;

        const filteredProfiles = this.profiles.filter(profile => {
            const matchesSearch = profile.name.toLowerCase().includes(this.searchTerm) ||
                                profile.role.toLowerCase().includes(this.searchTerm) ||
                                profile.bio.toLowerCase().includes(this.searchTerm) ||
                                (profile.skills && profile.skills.some(skill =>
                                    skill.toLowerCase().includes(this.searchTerm)));

            const matchesTheme = this.selectedTheme === 'all' || profile.theme === this.selectedTheme;

            return matchesSearch && matchesTheme;
        });

        if (filteredProfiles.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h2>No profiles found</h2>
                    <p>Try adjusting your search or filter</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredProfiles.map((profile, index) => `
            <div class="profile-card ${profile.theme}" data-profile-id="${profile.id}"
                 style="animation-delay: ${index * 0.1}s">
                <div class="profile-card-inner">
                    <div class="profile-image-wrapper">
                        ${profile.coverImage ? `<div class="profile-cover parallax-bg" style="background-image: url('${profile.coverImage}')"></div>` : ''}
                        <img src="${profile.image}" alt="${profile.name}" class="profile-image">
                        <div class="profile-overlay">
                            <span class="view-profile">👁️ View Full Profile</span>
                        </div>
                        <div class="profile-badge ${profile.theme}">
                            ${profile.theme === 'blue' ? '💼' : profile.theme === 'green' ? '🎨' : profile.theme === 'dark' ? '🌲' : '⚡'}
                        </div>
                    </div>
                    <div class="profile-info">
                        <h2 class="profile-name">${profile.name}</h2>
                        <p class="profile-role">${profile.role}</p>
                        ${profile.location ? `<p class="profile-location">📍 ${profile.location}</p>` : ''}

                        <div class="profile-meta">
                            ${profile.age ? `<span class="meta-item">📅 ${profile.age} years</span>` : ''}
                            ${profile.office ? `<span class="meta-item">🏢 ${profile.office}</span>` : ''}
                        </div>

                        <p class="profile-bio">${profile.bio.substring(0, 100)}${profile.bio.length > 100 ? '...' : ''}</p>

                        ${profile.skills ? `
                            <div class="profile-skills-preview">
                                ${profile.skills.slice(0, 3).map(skill =>
                                    `<span class="skill-tag">${skill}</span>`
                                ).join('')}
                                ${profile.skills.length > 3 ? `<span class="skill-tag more">+${profile.skills.length - 3}</span>` : ''}
                            </div>
                        ` : ''}

                        ${profile.hobbies ? `
                            <div class="profile-hobbies">
                                ${profile.hobbies.slice(0, 3).map(hobby =>
                                    `<span class="hobby-tag">${hobby}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                    </div>
                    <div class="profile-footer">
                        <button class="btn-view-details" onclick="app.showProfileModal('${profile.id}')">
                            <span>View Details</span>
                            <span class="btn-icon">→</span>
                        </button>
                    </div>
                </div>
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
            <button class="modal-close">×</button>

            <div class="modal-hero ${profile.theme}">
                ${profile.coverImage ? `
                    <div class="modal-cover-image" style="background-image: url('${profile.coverImage}')"></div>
                ` : ''}
                <div class="modal-hero-content">
                    <img src="${profile.image}" alt="${profile.name}" class="modal-profile-image">
                    <div class="modal-profile-info">
                        <h2>${profile.name}</h2>
                        <p class="modal-role">${profile.role}</p>
                        ${profile.location ? `<p class="modal-location">📍 ${profile.location}</p>` : ''}
                        ${profile.social ? `
                            <div class="social-links">
                                ${profile.social.github ? `<a href="${profile.social.github}" class="social-link" title="GitHub">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                    </svg>
                                </a>` : ''}
                                ${profile.social.linkedin ? `<a href="${profile.social.linkedin}" class="social-link" title="LinkedIn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>` : ''}
                                ${profile.social.twitter ? `<a href="${profile.social.twitter}" class="social-link" title="Twitter">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>` : ''}
                                ${profile.social.instagram ? `<a href="${profile.social.instagram}" class="social-link" title="Instagram">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                                    </svg>
                                </a>` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>

            <div class="modal-tabs">
                <button class="tab-button active" data-tab="about">About</button>
                <button class="tab-button" data-tab="skills">Skills</button>
                <button class="tab-button" data-tab="projects">Projects</button>
                <button class="tab-button" data-tab="contact">Contact</button>
            </div>

            <div class="modal-body">
                <div id="tab-about" class="tab-content active">
                    ${this.renderAboutTab(profile)}
                </div>
                <div id="tab-skills" class="tab-content">
                    ${this.renderSkillsTab(profile)}
                </div>
                <div id="tab-projects" class="tab-content">
                    ${this.renderProjectsTab(profile)}
                </div>
                <div id="tab-contact" class="tab-content">
                    ${this.renderContactTab(profile)}
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Update URL without page reload
        window.history.pushState({}, '', `#profile/${profileId}`);

        // Animate skills bars
        setTimeout(() => this.animateSkillBars(), 300);
    }

    renderAboutTab(profile) {
        return `
            <div class="info-section">
                <h3>📖 Biography</h3>
                <p class="bio-text">${profile.bio}</p>
            </div>

            ${profile.favoriteQuote ? `
                <div class="info-section quote-section">
                    <blockquote class="favorite-quote">
                        <span class="quote-mark">"</span>
                        ${profile.favoriteQuote}
                        <span class="quote-mark">"</span>
                    </blockquote>
                </div>
            ` : ''}

            ${profile.hobbies && profile.hobbies.length > 0 ? `
                <div class="info-section">
                    <h3>🎯 Hobbies & Interests</h3>
                    <div class="hobbies-grid">
                        ${profile.hobbies.map(hobby => `
                            <div class="hobby-item ${profile.theme}">
                                <span class="hobby-icon">✨</span>
                                <span>${hobby}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="info-section">
                <h3>📊 Quick Stats</h3>
                <div class="stats-grid">
                    ${profile.age ? `
                        <div class="stat-box">
                            <div class="stat-icon">🎂</div>
                            <div class="stat-value">${profile.age}</div>
                            <div class="stat-label">Years Old</div>
                        </div>
                    ` : ''}
                    ${profile.birthday ? `
                        <div class="stat-box">
                            <div class="stat-icon">📅</div>
                            <div class="stat-value">${profile.birthday}</div>
                            <div class="stat-label">Birthday</div>
                        </div>
                    ` : ''}
                    ${profile.skills ? `
                        <div class="stat-box">
                            <div class="stat-icon">💪</div>
                            <div class="stat-value">${profile.skills.length}</div>
                            <div class="stat-label">Skills</div>
                        </div>
                    ` : ''}
                    ${profile.projects ? `
                        <div class="stat-box">
                            <div class="stat-icon">🚀</div>
                            <div class="stat-value">${profile.projects.length}</div>
                            <div class="stat-label">Projects</div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderSkillsTab(profile) {
        if (!profile.skills || profile.skills.length === 0) {
            return '<div class="empty-state">No skills listed yet</div>';
        }

        return `
            <div class="info-section">
                <h3>💻 Technical Skills</h3>
                <div class="skills-list">
                    ${profile.skills.map((skill, index) => {
                        const level = 60 + Math.random() * 40; // Random level between 60-100
                        return `
                            <div class="skill-item" style="animation-delay: ${index * 0.1}s">
                                <div class="skill-header">
                                    <span class="skill-name">${skill}</span>
                                    <span class="skill-percentage">${Math.round(level)}%</span>
                                </div>
                                <div class="skill-bar">
                                    <div class="skill-progress ${profile.theme}" data-level="${level}"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    renderProjectsTab(profile) {
        if (!profile.projects || profile.projects.length === 0) {
            return '<div class="empty-state">No projects listed yet</div>';
        }

        return `
            <div class="info-section">
                <h3>🚀 Featured Projects</h3>
                <div class="projects-grid">
                    ${profile.projects.map(project => `
                        <div class="project-card ${profile.theme}">
                            <div class="project-image-wrapper">
                                <img src="${project.image}" alt="${project.name}" class="project-image">
                                <div class="project-overlay">
                                    <span class="zoom-icon">🔍</span>
                                </div>
                            </div>
                            <div class="project-info">
                                <h4 class="project-name">${project.name}</h4>
                                <p class="project-description">${project.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderContactTab(profile) {
        return `
            <div class="info-section">
                <h3>📞 Contact Information</h3>
                <div class="contact-grid">
                    ${profile.email ? `
                        <div class="contact-card">
                            <div class="contact-icon">📧</div>
                            <div class="contact-details">
                                <div class="contact-label">Email</div>
                                <a href="mailto:${profile.email}" class="contact-value">${profile.email}</a>
                            </div>
                        </div>
                    ` : ''}
                    ${profile.phone ? `
                        <div class="contact-card">
                            <div class="contact-icon">📱</div>
                            <div class="contact-details">
                                <div class="contact-label">Phone</div>
                                <a href="tel:${profile.phone}" class="contact-value">${profile.phone}</a>
                            </div>
                        </div>
                    ` : ''}
                    ${profile.office ? `
                        <div class="contact-card">
                            <div class="contact-icon">🏢</div>
                            <div class="contact-details">
                                <div class="contact-label">Office</div>
                                <span class="contact-value">${profile.office}</span>
                            </div>
                        </div>
                    ` : ''}
                    ${profile.location ? `
                        <div class="contact-card">
                            <div class="contact-icon">📍</div>
                            <div class="contact-details">
                                <div class="contact-label">Location</div>
                                <span class="contact-value">${profile.location}</span>
                            </div>
                        </div>
                    ` : ''}
                    ${profile.work ? `
                        <div class="contact-card">
                            <div class="contact-icon">💼</div>
                            <div class="contact-details">
                                <div class="contact-label">Work</div>
                                <span class="contact-value">${profile.work}</span>
                            </div>
                        </div>
                    ` : ''}
                    ${profile.officeNumber ? `
                        <div class="contact-card">
                            <div class="contact-icon">🔢</div>
                            <div class="contact-details">
                                <div class="contact-label">Office Number</div>
                                <span class="contact-value">${profile.officeNumber}</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>

            ${profile.pitch ? `
                <div class="info-section">
                    <h3>💡 Personal Pitch</h3>
                    <div class="pitch-box">
                        <p>${profile.pitch}</p>
                    </div>
                </div>
            ` : ''}
        `;
    }

    switchTab(tabName) {
        // Update button states
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Update content visibility
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`tab-${tabName}`)?.classList.add('active');

        // Animate skill bars if switching to skills tab
        if (tabName === 'skills') {
            setTimeout(() => this.animateSkillBars(), 100);
        }
    }

    animateSkillBars() {
        document.querySelectorAll('.skill-progress').forEach(bar => {
            const level = bar.dataset.level;
            bar.style.width = level + '%';
        });
    }

    openLightbox(imageSrc) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">×</button>
                <img src="${imageSrc}" alt="Project preview">
            </div>
        `;
        document.body.appendChild(lightbox);
        setTimeout(() => lightbox.classList.add('active'), 10);
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            setTimeout(() => lightbox.remove(), 300);
        }
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

    initParticles() {
        // Simple particle effect for background
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (10 + Math.random() * 20) + 's';
            particlesContainer.appendChild(particle);
        }
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SmoelenboekApp();
});

// Auto-refresh profiles every 60 seconds (for dynamic updates)
setInterval(() => {
    if (app && document.visibilityState === 'visible') {
        app.loadData().then(() => {
            app.renderProfiles();
        });
    }
}, 60000);
