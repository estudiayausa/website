// Importa la configuración
import CONFIG from './config.js';
// Importa la clase API desde su propio archivo para evitar duplicados.
import { API } from './api.js';
// Importa los datos de prueba
import { mockCourses, mockCategoryCounts } from './mock-data.js';
// Importa la función reutilizable desde utils.js
import { createCourseCard } from './utils.js';

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

// Función para cargar categorías
async function loadCategories() {
    console.log('Cargando conteo de cursos por categoría...');
    try {
        const api = new API();
        let allApiCategories;

        if (CONFIG.USE_MOCK_DATA) {
            allApiCategories = mockApiCategories;
        } else {
            allApiCategories = await api.getCategories();
        }

        // Creamos un mapa para buscar fácilmente el conteo por el código de la API
        const categoryCountsMap = new Map(allApiCategories.map(cat => [cat.code, cat.courses || 0]));
        const subcategoryCountsMap = new Map(allApiCategories.flatMap(cat => cat.subcategories || []).map(sub => [sub.code, sub.courses || 0]));

        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            const categoryKey = card.dataset.category;
            const subcategoryCode = card.dataset.subcategoryCode;
            const courseCountElement = card.querySelector('.course-count');

            if (courseCountElement) {
                let count = 0;
                if (categoryKey && CONFIG.CATEGORIES_MAPPING) {
                    // Es una categoría principal
                    const mapping = CONFIG.CATEGORIES_MAPPING[categoryKey];
                    if (mapping) {
                        if (mapping.type === 'category_code') {
                            count = categoryCountsMap.get(mapping.code) || 0;
                        } else if (mapping.type === 'subcategory_code') {
                            count = subcategoryCountsMap.get(mapping.code) || 0;
                        }
                    }
                } else if (subcategoryCode) {
                    // Es una subcategoría
                    count = subcategoryCountsMap.get(subcategoryCode) || 0;
                }
                courseCountElement.textContent = `${count} ${count === 1 ? 'curso' : 'cursos'}`;
            }
        });

    } catch (error) {
        console.error('Error al cargar el conteo de categorías:', error);
        document.querySelectorAll('.course-count').forEach(el => {
            el.textContent = 'Error al cargar';
        });
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
            const categoryKey = card.dataset.category;
            const subcategoryCode = card.dataset.subcategoryCode;
            const cardTitle = card.querySelector('h3').textContent;

            // Muestra un estado de carga y se desplaza a la sección de cursos
            displayCourses([], `Cargando cursos de ${cardTitle}...`);
            document.getElementById('cursos').scrollIntoView({ behavior: 'smooth' });

            try {
                let courses;
                if (categoryKey) {
                    // Lógica para categoría principal desde la home
                    const mapping = CONFIG.CATEGORIES_MAPPING[categoryKey];
                    if (mapping) {
                        const params = { sort: '-popularity' };
                        params[mapping.type] = mapping.code; // Asigna dinámicamente category_code o subcategory_code
                        courses = await new API().getCourses(params);
                    }
                } else if (subcategoryCode) {
                    // Lógica para subcategoría desde la sección "Explora por Subcategoría"
                    courses = await new API().getCourses({ subcategory_code: subcategoryCode, sort: '-popularity' });
                }
                displayCourses(courses, `Cursos de ${cardTitle}`);
            } catch (error) {
                console.error(`Error al cargar cursos para ${cardTitle}:`, error);
                displayCourses([], `Error al cargar cursos de ${cardTitle}`);
            }
        });
    });
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
    const testimonialsSection = document.getElementById('testimonios');
    if (!testimonialsSection) return;

    const container = testimonialsSection.querySelector('.testimonial-container');
    const prevBtn = testimonialsSection.querySelector('.carousel-btn.prev');
    const nextBtn = testimonialsSection.querySelector('.carousel-btn.next');
    if (!container) return;
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
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM cargado, inicializando componentes...');

    // Inicializa componentes que no dependen de la API primero
    initializeCarousels();
    initializeNewsletter();
    initializeSearch();

    // Carga todo el contenido que depende de la API de forma asíncrona
    // y espera a que termine antes de hacer los elementos interactivos.
    await Promise.all([
        loadFeaturedCourses(),
        loadCategories(),
        loadAllSubcategories() // Esta función ya llama a initializeSubcategoriesInteraction() al terminar
    ]);

    // Ahora que todo está cargado, inicializamos la interacción de las categorías principales.
    initializeCategoriesInteraction();
});