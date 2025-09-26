import { API } from './api.js';
import { createCourseCard } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeCatalog();
});

async function initializeCatalog() {
    await populateFilters();
    await fetchAndDisplayCourses();

    const applyButton = document.getElementById('apply-filters-btn');
    applyButton.addEventListener('click', fetchAndDisplayCourses);
}

async function populateFilters() {
    const api = new API();
    const categorySelect = document.getElementById('filter-category');
    const difficultyContainer = document.getElementById('filter-difficulty');

    // Poblar categorías
    try {
        const categories = await api.getCategories();
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.code;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar categorías para el filtro:", error);
    }

    // Poblar niveles de dificultad (estáticos según la API)
    const difficultyLevels = [
        { value: '', label: 'Todos' },
        { value: 'basic', label: 'Básico' },
        { value: 'intermediate', label: 'Intermedio' },
        { value: 'advanced', label: 'Avanzado' }
    ];

    difficultyContainer.innerHTML = difficultyLevels.map((level, index) => `
        <label>
            <input type="radio" name="difficulty" value="${level.value}" ${index === 0 ? 'checked' : ''}>
            ${level.label}
        </label>
    `).join('');
}

function getAppliedFilters() {
    const query = document.getElementById('filter-search').value;
    const sort = document.getElementById('filter-sort').value;
    const category = document.getElementById('filter-category').value;
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;

    const filters = {};
    if (query) filters.q = query;
    if (sort) filters.sort = sort;
    if (category) filters.category_code = category;
    if (difficulty) filters.difficulty_level = difficulty;

    return filters;
}

async function fetchAndDisplayCourses() {
    const container = document.getElementById('catalog-container');
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;

    const filters = getAppliedFilters();
    const api = new API();

    try {
        const courses = await api.getCourses(filters);
        displayCourses(courses);
    } catch (error) {
        console.error("Error al obtener los cursos del catálogo:", error);
        container.innerHTML = `<p class="error-message">No se pudieron cargar los cursos. Inténtalo de nuevo.</p>`;
    }
}

function displayCourses(courses) {
    const container = document.getElementById('catalog-container');
    
    if (!courses || courses.length === 0) {
        container.innerHTML = `<p class="no-results-message">No se encontraron cursos que coincidan con tu búsqueda.</p>`;
        return;
    }

    // Reutilizamos la función `createCourseCard` que ya tenemos en `utils.js`
    container.innerHTML = `
        <div class="course-grid">
            ${courses.map(course => createCourseCard(course)).join('')}
        </div>
    `;
}