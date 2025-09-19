document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
    checkAuthentication();
    loadFeaturedCourses();
    loadCategories();
    initializeCarousels();
    initializeNewsletter();
});

function initializeComponents() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Search functionality
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.querySelector('.hero-search input');
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            window.location.href = `#catalogo?category=${category}`;
        });
    });
}

function checkAuthentication() {
    const user = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
    
    if (user) {
        const userData = JSON.parse(user);
        updateUIForAuthenticatedUser(userData);
    } else {
        updateUIForAnonymousUser();
    }
}

function updateUIForAuthenticatedUser(userData) {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <a href="#profile" class="btn btn-outline">Perfil</a>
            <a href="#logout" class="btn btn-primary">Cerrar sesión</a>
        `;
    }
}

function updateUIForAnonymousUser() {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <a href="#login" class="btn btn-outline">Iniciar sesión</a>
            <a href="#register" class="btn btn-primary">Registrarse</a>
        `;
    }
}

async function loadFeaturedCourses() {
    const coursesContainer = document.getElementById('courses-container');
    
    try {
        const response = await new API().getCourses({ limit: 6 });
        const courses = response.courses || [];
        
        if (courses.length === 0) {
            coursesContainer.innerHTML = '<p>No se encontraron cursos en este momento.</p>';
            return;
        }
        
        coursesContainer.innerHTML = courses.map(course => createCourseCard(course)).join('');
        
    } catch (error) {
        console.error('Error loading courses:', error);
        coursesContainer.innerHTML = '<p>Error al cargar los cursos. Por favor, inténtalo de nuevo más tarde.</p>';
    }
}

async function loadCategories() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    for (const card of categoryCards) {
        const category = card.dataset.category;
        const courseCountElement = card.querySelector('.course-count');
        
        try {
            const response = await new API().getCoursesByCategory(category);
            courseCountElement.textContent = `${response.courses.length} cursos`;
        } catch (error) {
            console.error(`Error loading courses for category ${category}:`, error);
            courseCountElement.textContent = 'Error al cargar';
        }
    }
}

function createCourseCard(course) {
    const affiliateLink = `https://tutellus.com/curso/${course.id}?affiliate=${CONFIG.AFFILIATE_ID}`;
    
    return `
        <div class="course-card">
            <div class="course-image" style="background-image: url('${course.thumbnail || 'https://via.placeholder.com/300x180'}')"></div>
            <div class="course-content">
                <h3 class="course-title">${course.title || 'Título del curso'}</h3>
                <div class="course-instructor">
                    <img src="${course.instructor?.avatar || 'https://via.placeholder.com/30x30'}" alt="${course.instructor?.name || 'Instructor'}" class="instructor-avatar">
                    <span>${course.instructor?.name || 'Nombre del instructor'}</span>
                </div>
                <div class="rating">
                    <div class="stars">
                        ${renderStars(course.rating || 0)}
                    </div>
                    <span>${course.rating || 0} (${course.students || 0})</span>
                </div>
                <div class="course-price">${formatPrice(course.price || 0)}</div>
                <a href="${affiliateLink}" class="btn btn-primary" target="_blank">Ver curso</a>
            </div>
        </div>
    `;
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function formatPrice(price) {
    return price === 0 ? 'Gratis' : `$${price}`;
}

function initializeCarousels() {
    const testimonialContainer = document.querySelector('.testimonial-container');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-carousel .carousel-btn.prev');
    const nextBtn = document.querySelector('.testimonial-carousel .carousel-btn.next');
    let currentIndex = 0;

    function updateTestimonialCarousel() {
        testimonialContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
        updateTestimonialCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        updateTestimonialCarousel();
    });
}

function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        if (email) {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.textContent = '¡Gracias por suscribirte! Revisa tu correo para confirmar.';
            successMessage.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--success-green);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 1000;
            `;
            document.body.appendChild(successMessage);
            
            // Reset form
            this.reset();
            
            // Remove message after 5 seconds
            setTimeout(() => successMessage.remove(), 5000);
        }
    });
}

function performSearch() {
    const searchInput = document.querySelector('.hero-search input');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        window.location.href = `#catalogo?search=${encodeURIComponent(searchTerm)}`;
    }
}

// Handle logout
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href="#logout"]')) {
        e.preventDefault();
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        window.location.href = '#login';
    }
    // Botón de recarga temporal
document.getElementById('reloadData')?.addEventListener('click', function() {
    location.reload();
});