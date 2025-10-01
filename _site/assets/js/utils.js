// Este archivo contendrá funciones de ayuda reutilizables en todo el proyecto.

/**
 * Crea el HTML para una tarjeta de curso.
 * @param {object} course - El objeto del curso con sus datos.
 * @returns {string} - El string HTML de la tarjeta.
 */
export function createCourseCard(course) {
    // Enlace a la página de detalle del curso.
    const courseLink = `course.html?code=${course.code || course.id}`; 
    const instructorName = course.teacher?.name || 'Instructor';
    // Usamos un placeholder para el avatar.
    const instructorAvatar = `https://picsum.photos/seed/avatar-${course.code || course.id}/30/30`;
    const rating = course.stats?.reviews_avg || 0;
    const studentsCount = course.stats?.students || 0;
    const price = course.price?.USD ?? course.price?.EUR ?? 0;

    return `
        <div class="course-card">
            <div class="course-image" style="background-image: url('${course.image_url || `https://picsum.photos/seed/course-${course.code || course.id}/300/180`}')"></div>
            <div class="course-content">
                <h3 class="course-title">${course.name || 'Título del curso'}</h3>
                <div class="course-instructor">
                    <img src="${instructorAvatar}" alt="${instructorName}" class="instructor-avatar">
                    <span>${instructorName}</span>
                </div>
                ${rating > 0 ? `
                <div class="rating">
                    <div class="stars">${renderStars(rating)}</div>
                    <span>${rating.toFixed(1)} (${studentsCount})</span>
                </div>
                ` : ''}
                <div class="course-price">${formatPrice(price)}</div>
                <a href="${courseLink}" class="btn btn-primary">Ver curso</a>
            </div>
        </div>
    `;
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) stars += '<i class="fas fa-star"></i>';
        else if (i - 0.5 <= rating) stars += '<i class="fas fa-star-half-alt"></i>';
        else stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

function formatPrice(price) {
    return price === 0 ? 'Gratis' : `$${price}`;
}