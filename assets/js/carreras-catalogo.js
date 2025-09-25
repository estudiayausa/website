// Importamos los datos de las carreras desde el mismo archivo que usa la página de detalle
import { careersData } from './career-data.js';

document.addEventListener('DOMContentLoaded', () => {
    loadCareersCatalog();
});

function loadCareersCatalog() {
    const gridContainer = document.getElementById('careers-grid-container');
    if (!gridContainer) return;

    if (careersData && Object.keys(careersData).length > 0) {
        gridContainer.innerHTML = Object.entries(careersData).map(([id, career]) => {
            return createCareerCard(id, career);
        }).join('');
    } else {
        gridContainer.innerHTML = '<p>No se encontraron carreras disponibles.</p>';
    }
}

function createCareerCard(id, career) {
    return `
        <div class="career-card" style="background-image: url('${career.image}');">
            <div class="career-card-content">
                <h3>${career.title}</h3>
                <p>${career.subtitle}</p>
                <div class="career-stats">
                    <span><i class="fas fa-book"></i> ${career.coursesCount} Cursos</span>
                    <span><i class="fas fa-clock"></i> ${career.duration} de contenido</span>
                </div>
                <a href="carrera-detail.html?id=${id}" class="btn btn-primary">Ver Carrera</a>
            </div>
        </div>
    `;
}