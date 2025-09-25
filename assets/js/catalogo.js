import CONFIG from './config.js';
import { API } from './api.js';
import { mockCourses, mockApiCategories } from './mock-data.js';

document.addEventListener('DOMContentLoaded', () => {
    loadCatalog();
});

async function loadCatalog() {
    const catalogContainer = document.getElementById('catalog-container');
    const api = new API();

    try {
        let categories;
        // 1. Fetch all categories (from mock or API)
        if (CONFIG.USE_MOCK_DATA) {
            console.log('CATALOG: Using mock data for categories.');
            categories = mockApiCategories;
        } else {
            categories = await api.getCategories();
        }

        if (!categories || categories.length === 0) {
            catalogContainer.innerHTML = '<p>No se encontraron categorías.</p>';
            return;
        }

        // Clear loading spinner
        catalogContainer.innerHTML = '';

        // 2. For each main category, fetch top 4 courses
        for (const category of categories) {
            const categorySection = document.createElement('section');
            categorySection.className = 'category-section';
            catalogContainer.appendChild(categorySection);

            // Show loading state for the category
            categorySection.innerHTML = `
                <div class="category-header">
                    <h2>${category.name}</h2>
                </div>
                <div class="loading"><div class="spinner"></div></div>
            `;

            let courses;
            if (CONFIG.USE_MOCK_DATA) {
                // Simulate fetching courses for a category
                courses = mockCourses.slice(0, 4);
            } else {
                courses = await api.getCourses({ category_code: category.code, limit: 4, sort: '-popularity' });
            }

            // Only render the section if there are courses
            if (courses && courses.length > 0) {
                let subcategoriesHTML = '';
                if (category.subcategories && category.subcategories.length > 0) {
                    subcategoriesHTML = `
                        <div class="subcategories-list">
                            <h4>Subcategorías:</h4>
                            <ul>
                                ${category.subcategories.map(sub => `<li><a href="#">${sub.name} (${sub.courses})</a></li>`).join('')}
                            </ul>
                        </div>
                    `;
                }

                categorySection.innerHTML = `
                    <div class="category-header">
                        <h2>${category.name}</h2>
                        <a href="index.html#cursos" class="view-more-btn">Ver más cursos</a>
                    </div>
                    <div class="course-grid">
                        ${courses.map(course => createCourseCard(course)).join('')}
                    </div>
                    ${subcategoriesHTML}
                `;
            } else {
                // If no courses, remove the section
                categorySection.remove();
            }
        }

    } catch (error) {
        console.error('Error loading catalog:', error);
        let userMessage = 'Hubo un problema al cargar el catálogo.';
        if (error.message.includes('401')) {
            userMessage = 'No se pudo conectar con la API. Por favor, verifica la configuración.';
        }
        catalogContainer.innerHTML = `<p style="text-align: center;">${userMessage}</p>`;
    }
}

// Helper functions copied from main.js
function createCourseCard(course) {
    const courseLink = `course.html?code=${course.code || course.id}`; 
    const instructorName = course.teacher?.name || course.user?.name || 'Instructor no disponible';
    const instructorAvatar = `https://picsum.photos/seed/avatar-${course.code || course.id}/30/30`;
    const rating = course.stats?.reviews_avg || course.rating_avg || 0;
    const studentsCount = course.stats?.students || course.students_count || 0;
    const price = course.price?.USD ?? course.price?.EUR ?? course.price?.amount ?? 0;

    return `
        <div class="course-card">
            <div class="course-image" style="background-image: url('${course.image_url || course.thumbnail || `https://picsum.photos/seed/course-${course.code || course.id}/300/180`}')"></div>
            <div class="course-content">
                <h3 class="course-title">${course.name || course.title || 'Título del curso'}</h3>
                <div class="course-instructor">
                    <img src="${instructorAvatar}" alt="${instructorName}" class="instructor-avatar">
                    <span>${instructorName}</span>
                </div>
                <div class="rating">
                    <div class="stars">${renderStars(rating)}</div>
                    <span>${rating.toFixed(1)} (${studentsCount})</span>
                </div>
                <div class="course-price">${formatPrice(price)}</div>
                <a href="${courseLink}" class="btn btn-primary">Ver curso</a>
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
    return price === 0 ? 'Gratis' : `$${price.toFixed(2)}`;
}