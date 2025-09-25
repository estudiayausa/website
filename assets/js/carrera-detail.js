// Importa funciones de ayuda que podríamos reutilizar
import { createCourseCard } from './utils.js';
// Importa los datos de las carreras desde un archivo centralizado
import { careersData } from './career-data.js';

document.addEventListener('DOMContentLoaded', () => {
    loadCareerDetails();
});

function loadCareerDetails() {
    const container = document.getElementById('career-detail-container');
    const urlParams = new URLSearchParams(window.location.search);
    const careerId = urlParams.get('id');

    if (!careerId || !careersData[careerId]) {
        container.innerHTML = `<p style="text-align: center; padding: 4rem 0;">Error: Carrera no encontrada.</p>`;
        return;
    }

    const career = careersData[careerId];
    renderCareer(career, container);
    initializePageInteractions();
}

function renderCareer(career, container) {
    document.title = `${career.title} - EstudiaYa`;

    container.innerHTML = `
        <section class="career-header" style="background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${career.image}'); background-size: cover; background-position: center;">
            <div class="container">
                <div class="career-header-info">
                    <h1>${career.title}</h1>
                    <p class="career-subtitle">${career.subtitle}</p>
                    <div class="career-meta-stats">
                        <div class="stat"><i class="fas fa-book-open"></i><span>${career.coursesCount} cursos</span></div>
                        <div class="stat"><i class="fas fa-clock"></i><span>${career.duration} de contenido</span></div>
                        <div class="stat"><i class="fas fa-trophy"></i><span>Certificado Profesional</span></div>
                    </div>
                </div>
            </div>
        </section>

        <div class="container career-main-content">
            <div class="career-details-body">
                <div class="tab-nav">
                    <button class="tab-button active" data-tab="description">Descripción</button>
                    <button class="tab-button" data-tab="learning-path">Ruta de Aprendizaje</button>
                </div>
                <div class="tab-content">
                    <div class="tab-panel active" id="description">
                        <h3>Sobre esta Carrera</h3>
                        <div class="description-text">${career.description}</div>
                    </div>
                    <div class="tab-panel" id="learning-path">
                        <h3>Cursos Incluidos</h3>
                        <div class="learning-path-grid">
                            ${career.learningPath.map(course => createCourseCard(course)).join('')}
                        </div>
                    </div>
                </div>
            </div>
            <aside class="career-sidebar">
                <div class="career-image-placeholder" style="background-image: url('${career.image}')"></div>
                <div class="career-actions">
                    <a href="#" class="btn btn-primary">Inscribirme en la Carrera</a>
                </div>
                <div class="career-includes">
                    <h4>Salidas Profesionales:</h4>
                    <ul>
                        ${career.outcomes.map(outcome => `<li><i class="fas fa-user-tie"></i><span>${outcome}</span></li>`).join('')}
                    </ul>
                </div>
            </aside>
        </div>
    `;
}

function initializePageInteractions() {
    // Funcionalidad de Pestañas (Tabs)
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
}