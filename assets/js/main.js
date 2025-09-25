// Importa la configuración
import CONFIG from './config.js';
// Importa la clase API desde su propio archivo para evitar duplicados.
import { API } from './api.js';
// Importa los datos de prueba
import { mockCourses, mockCategoryCounts } from './mock-data.js';

// Función principal para cargar cursos destacados
async function loadFeaturedCourses() {
    const coursesContainer = document.getElementById('courses-container');
    
    if (!coursesContainer) {
        console.error('No se encontró el contenedor de cursos');
        return;
    }

    // Si estamos usando datos de prueba, cárgalos y sal de la función.
    if (CONFIG.USE_MOCK_DATA) {
        console.log('Usando datos de prueba (mock data) para los cursos.');
        displayCourses(mockCourses, 'Cursos Destacados');
        return;
    }

    try {
        // Usamos el parámetro 'sort' para traer los más populares, como indica la API.
        const courses = await new API().getCourses({ limit: 6, sort: '-popularity' });
        console.log('Respuesta de la API (cursos destacados):', courses);

        if (courses && courses.length > 0) {
            displayCourses(courses, 'Cursos Destacados');
            console.log('Cursos cargados desde API:', courses.length);
        } else {
            displayCourses([], 'Cursos Destacados');
        }
    } catch (error) {
        console.error('Error al cargar cursos destacados desde API:', error);
        let userMessage = 'Hubo un problema al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.';
        if (error.message.includes('401')) {
            userMessage = 'El acceso a la API no está autorizado. Por favor, verifica que el token de API sea válido y no haya expirado.';
        }
        coursesContainer.innerHTML = `
            <div class="api-error-message" style="text-align: center; padding: 2rem; width: 100%;">
                <h3>No se pudieron cargar los cursos</h3>
                <p>${userMessage}</p>
                <p><small>Detalle para el desarrollador: ${error.message}</small></p>
            </div>
        `;
    }
}

// Nueva función reutilizable para mostrar cursos en el contenedor
function displayCourses(courses, title) {
    const coursesContainer = document.getElementById('courses-container');
    const sectionTitle = document.querySelector('#cursos .section-title');

    if (!coursesContainer || !sectionTitle) {
        console.error('No se encontró el contenedor de cursos o el título de la sección.');
        return;
    }

    sectionTitle.textContent = title;

    if (courses && courses.length > 0) {
        coursesContainer.innerHTML = courses.map(course => createCourseCard(course)).join('');
    } else {
        coursesContainer.innerHTML = `
            <p style="text-align: center; width: 100%;">No se encontraron cursos. Intenta con otra búsqueda o explora nuestras categorías.</p>
        `;
    }
}

// Función para crear tarjetas de curso
function createCourseCard(course) {
    // CORRECCIÓN: Se ajustan las propiedades a la estructura real de la API de Tutellus.
    // Se añaden fallbacks más robustos para evitar errores si un dato no viene.
    // Para probar en GitHub Pages, volvemos a enlazar a nuestra página de detalle local.
    const courseLink = `course.html?code=${course.code}`; 
    const instructorName = course.teacher?.name || 'Instructor no disponible';
    // La API no proporciona avatar del instructor, usamos un placeholder.
    const instructorAvatar = `https://picsum.photos/seed/avatar-${course.code || course.id}/30/30`;
    const rating = course.stats?.reviews_avg || 0;
    const studentsCount = course.stats?.students || 0;
    // Usamos el precio en USD como predeterminado, o EUR si no está disponible.
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

// Función para renderizar estrellas de calificación
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

// Función para formatear precios
function formatPrice(price) {
    return price === 0 ? 'Gratis' : `$${price}`;
}

// Función para cargar categorías
async function loadCategories() {
    console.log('Cargando categorías...');
    const categoryCards = document.querySelectorAll('.category-card');
    
    for (const card of categoryCards) {
        const category = card.dataset.category;
        const courseCountElement = card.querySelector('.course-count');
        
        if (!courseCountElement) continue;
        
        // Si usamos datos de prueba, los usamos y continuamos al siguiente.
        if (CONFIG.USE_MOCK_DATA) {
            const mockCount = mockCategoryCounts[category] || 0;
            courseCountElement.textContent = `${mockCount} ${mockCount === 1 ? 'curso' : 'cursos'}`;
            continue;
        }

        try {
            // Usamos la API centralizada
            const response = await new API().getCoursesByCategory(category);
            console.log(`Respuesta de la API (categoría ${category}):`, response);
            // CORRECCIÓN: La API devuelve un array directamente.
            const courseCount = response?.length || 0;
            courseCountElement.textContent = `${courseCount} ${courseCount === 1 ? 'curso' : 'cursos'}`;
        } catch (error) {
            console.error(`Error cargando categoría ${category}:`, error);
            if (error.message.includes('401')) {
                courseCountElement.textContent = 'No autorizado';
            } else {
                courseCountElement.textContent = 'Error al cargar';
            }
        }
    }
}

// Función para cargar todas las subcategorías
async function loadAllSubcategories() {
    const subcategoriesContainer = document.getElementById('subcategories-container');
    if (!subcategoriesContainer) return;

    try {
        const api = new API();
        let allCategories;

        if (CONFIG.USE_MOCK_DATA) {
            console.log('Usando datos de prueba (mock data) para las subcategorías.');
            allCategories = mockApiCategories;
        } else {
            allCategories = await api.getCategories();
        }

        // Aplanamos el array de subcategorías de todas las categorías
        const allSubcategories = allCategories.flatMap(category => category.subcategories || []);

        if (allSubcategories.length > 0) {
            subcategoriesContainer.innerHTML = allSubcategories.map(sub => 
                `<button class="subcategory-tag" data-subcategory-code="${sub.code}">${sub.name}</button>`
            ).join('');
            initializeSubcategoriesInteraction();
        } else {
            subcategoriesContainer.innerHTML = '<p>No se encontraron subcategorías.</p>';
        }
    } catch (error) {
        console.error('Error al cargar las subcategorías:', error);
        subcategoriesContainer.innerHTML = '<p>Error al cargar subcategorías.</p>';
    }
}

// Función para que las etiquetas de subcategoría sean interactivas
function initializeSubcategoriesInteraction() {
    const subcategoryTags = document.querySelectorAll('.subcategory-tag');
    subcategoryTags.forEach(tag => {
        tag.addEventListener('click', async () => {
            const subcategoryCode = tag.dataset.subcategoryCode;
            const subcategoryName = tag.textContent;

            displayCourses([], `Cargando cursos de ${subcategoryName}...`);
            document.getElementById('cursos').scrollIntoView({ behavior: 'smooth' });

            try {
                const courses = await new API().getCourses({ subcategory_code: subcategoryCode });
                displayCourses(courses, `Cursos de ${subcategoryName}`);
            } catch (error) {
                console.error(`Error al cargar cursos para la subcategoría ${subcategoryCode}:`, error);
                displayCourses([], `Error al cargar cursos de ${subcategoryName}`);
            }
        });
    });
}

// Función para que las tarjetas de categoría sean interactivas
function initializeCategoriesInteraction() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', async (e) => {
            e.preventDefault(); // Previene el salto brusco del enlace
            const category = card.dataset.category;
            const categoryTitle = card.querySelector('h3').textContent;

            // Muestra un estado de carga y se desplaza a la sección de cursos
            displayCourses([], `Cargando cursos de ${categoryTitle}...`);
            document.getElementById('cursos').scrollIntoView({ behavior: 'smooth' });

            try {
                const courses = await new API().getCoursesByCategory(category);
                displayCourses(courses, `Cursos de ${categoryTitle}`);
            } catch (error) {
                console.error(`Error al cargar cursos para la categoría ${category}:`, error);
                displayCourses([], `Error al cargar cursos de ${categoryTitle}`);
            }
        });
    });

    // Funcionalidad para el botón "Ver todos los cursos" para que recargue los destacados
    const viewAllBtn = document.getElementById('view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Vuelve a cargar los cursos destacados
            loadFeaturedCourses();
            // Se desplaza suavemente a la sección de cursos
            document.getElementById('cursos').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// Función para inicializar la barra de búsqueda
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    if (!searchInput || !searchButton) return;

    const performSearch = async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        // Mostramos un estado de carga
        displayCourses([], `Buscando cursos para "${query}"...`);
        document.getElementById('cursos').scrollIntoView({ behavior: 'smooth' });

        try {
            const results = await new API().search(query);
            displayCourses(results, `Resultados para "${query}"`);
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            displayCourses([], 'Error en la búsqueda');
        }
    };

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evita que el formulario se envíe (si lo hubiera)
            performSearch();
        }
    });
}

// Función para inicializar el carrusel de testimonios
function initializeCarousels() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;

    const container = carousel.querySelector('.testimonial-container');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const testimonials = container.querySelectorAll('.testimonial-card');

    if (!container || !prevBtn || !nextBtn || testimonials.length === 0) {
        console.warn('Elementos del carrusel de testimonios no encontrados.');
        return;
    }

    let currentIndex = 0;
    const totalTestimonials = testimonials.length;

    const getVisibleCount = () => {
        // Asumimos que en pantallas pequeñas (< 768px) se ve 1 testimonio, y en grandes se ven 2.
        // Esto debe coincidir con tu CSS (en responsive.css).
        return window.innerWidth < 768 ? 1 : 2;
    };

    const updateCarousel = () => {
        const visibleCount = getVisibleCount();
        const maxIndex = totalTestimonials - visibleCount;

        // Asegurarse de que el índice no se salga de los límites
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        // El desplazamiento se calcula basado en el número de tarjetas visibles.
        // Esto asume que las tarjetas tienen un `flex-basis` o `width` porcentual en el CSS.
        const offset = -currentIndex * (100 / visibleCount);
        container.style.transform = `translateX(${offset}%)`;

        // Actualizar estado de los botones
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    };

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        updateCarousel();
    });

    // Actualizar el carrusel si cambia el tamaño de la ventana
    window.addEventListener('resize', updateCarousel);

    // Llamada inicial para establecer el estado correcto
    updateCarousel();
}

// Función para inicializar el formulario de la newsletter
function initializeNewsletter() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(newsletterForm);
        const submitButton = newsletterForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;

        // Deshabilitar botón y mostrar estado de carga
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                // Netlify necesita que le enviemos el nombre del formulario en el cuerpo de la petición para AJAX.
                body: new URLSearchParams({
                    'form-name': newsletterForm.getAttribute('name'),
                    ...Object.fromEntries(formData)
                }).toString()
            });

            if (response.ok) {
                showSuccess('¡Gracias por suscribirte!');
                newsletterForm.reset();
            } else {
                throw new Error('Falló el envío del formulario');
            }
        } catch (error) {
            console.error('Error en la suscripción:', error);
            alert('Hubo un error al enviar tu suscripción. Por favor, inténtalo de nuevo.');
        } finally {
            // Rehabilitar el botón
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// --- Helper Functions ---
function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after animation ends
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando componentes...');
    // TODO: Implementar las siguientes funciones
    initializeCarousels();
    initializeNewsletter();
    initializeSearch();
    loadFeaturedCourses();
    loadCategories();
    loadAllSubcategories();
    initializeCategoriesInteraction();
});