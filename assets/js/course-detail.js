import CONFIG from './config.js';
import { API } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    loadCourseDetails();
});

async function loadCourseDetails() {
    const container = document.getElementById('course-detail-container');
    const urlParams = new URLSearchParams(window.location.search);
    const courseCode = urlParams.get('code');

    if (!courseCode) {
        container.innerHTML = `<p>Error: No se ha especificado un código de curso.</p>`;
        return;
    }

    try {
        const api = new API();
        const course = await api.getCourseById(courseCode);
        console.log('Course Details:', course);

        if (!course) {
            throw new Error('No se encontraron detalles para este curso.');
        }

        renderCourse(course, container);
        initializePageInteractions();

    } catch (error) {
        console.error('Error loading course details:', error);
        container.innerHTML = `<p>Error al cargar los detalles del curso. Por favor, inténtalo de nuevo.</p>`;
    }
}

function renderCourse(course, container) {
    const instructorName = course.teacher?.name || 'No disponible';
    const rating = course.stats?.reviews_avg || 0;
    const ratingCount = course.stats?.reviews || 0;
    const studentCount = course.stats?.students || 0;
    const durationInSeconds = course.stats?.duration || 0;
    const price = course.price?.USD ?? course.price?.EUR ?? 0;

    container.innerHTML = `
        <section class="course-header">
            <div class="container">
                <div class="course-header-content">
                    <div class="course-header-info">
                        <h1>${course.name}</h1>
                        <p class="course-subtitle">${course.summary || ''}</p>
                        <div class="course-meta">
                            <div class="rating">
                                <span class="rating-value">${rating.toFixed(1)}</span>
                                <div class="stars">${renderStars(rating)}</div>
                                <span class="rating-count">(${ratingCount.toLocaleString()} valoraciones)</span>
                            </div>
                        </div>
                        <div class="course-stats">
                            <div class="stat"><i class="fas fa-users"></i><span>${studentCount.toLocaleString()} estudiantes</span></div>
                            <div class="stat"><i class="fas fa-clock"></i><span>${formatDuration(durationInSeconds)}</span></div>
                            <div class="stat"><i class="fas fa-signal"></i><span>${course.difficulty_level || 'Todos los niveles'}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="container course-main-content">
            <div class="course-details-body">
                <div class="tab-nav">
                    <button class="tab-button active" data-tab="description">Descripción</button>
                    <button class="tab-button" data-tab="curriculum">Currículo</button>
                    <button class="tab-button" data-tab="instructor">Instructor</button>
                </div>
                <div class="tab-content">
                    <div class="tab-panel active" id="description">
                        <h3>Descripción del curso</h3>
                        <div class="description-text">${course.description || '<p>No hay descripción disponible.</p>'}</div>
                    </div>
                    <div class="tab-panel" id="curriculum">
                        <h3>Temario del Curso</h3>
                        ${renderCurriculum(course.sections)}
                    </div>
                    <div class="tab-panel" id="instructor">
                        ${renderInstructor(course.teacher)}
                    </div>
                </div>
            </div>
            <aside class="course-sidebar">
                <div class="course-video-placeholder" style="background-image: url('${course.image_url}')">
                    <a href="${course.video_url || '#'}" target="_blank" class="play-button"><i class="fas fa-play-circle"></i></a>
                </div>
                <div class="price-section">
                    <span class="current-price">${formatPrice(price)}</span>
                </div>
                <div class="course-actions">
                    <a href="${course.url}" target="_blank" class="btn btn-primary">Inscribirme ahora</a>
                </div>
                <div class="course-includes">
                    <h4>Este curso incluye:</h4>
                    <ul>
                        <li><i class="fas fa-video"></i><span>${formatDuration(durationInSeconds)} de vídeo bajo demanda</span></li>
                        <li><i class="fas fa-file-alt"></i><span>Recursos descargables</span></li>
                        <li><i class="fas fa-mobile-alt"></i><span>Acceso en dispositivos móviles y TV</span></li>
                        <li><i class="fas fa-infinity"></i><span>Acceso de por vida</span></li>
                        <li><i class="fas fa-certificate"></i><span>Certificado de finalización</span></li>
                    </ul>
                </div>
            </aside>
        </div>
    `;
}

function renderCurriculum(sections = []) {
    if (!sections || sections.length === 0) {
        return '<p>El temario de este curso no está disponible.</p>';
    }
    return sections.map((section, index) => `
        <div class="module">
            <div class="module-header" data-module-index="${index}">
                <div class="module-title">
                    <span>${section.title}</span>
                </div>
                <div class="module-lessons">${section.content?.length || 0} lecciones</div>
                <i class="fas fa-chevron-down module-toggle"></i>
            </div>
            <div class="module-content">
                ${(section.content || []).map(lessonTitle => `
                    <div class="lesson">
                        <div class="lesson-info">
                            <i class="fas fa-play-circle lesson-type"></i>
                            <span class="lesson-title">${lessonTitle}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function renderInstructor(instructor) {
    if (!instructor) {
        return '<h3>Instructor</h3><p>La información del instructor no está disponible.</p>';
    }
    return `
        <h3>Sobre el Instructor</h3>
        <div class="instructor-section">
            <div class="instructor-info">
                <h4 class="instructor-name">${instructor.name}</h4>
                <a href="${instructor.url}" target="_blank" class="btn btn-outline">Ver perfil</a>
            </div>
        </div>
    `;
}

function initializePageInteractions() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const targetTab = button.dataset.tab;
            tabPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === targetTab);
            });
        });
    });

    // Accordion for curriculum
    const moduleHeaders = document.querySelectorAll('.module-header');
    moduleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('open');
        });
    });
}

// --- Helper Functions ---

function formatPrice(price) {
    return price === 0 ? 'Gratis' : `$${price.toFixed(2)}`;
}

function formatDuration(totalSeconds) {
    if (!totalSeconds) return 'N/A';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
    return result.trim() || 'N/A';
}

function renderStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}