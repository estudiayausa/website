// Importa funciones de ayuda que podríamos reutilizar
import { createCourseCard } from './utils.js';

// Datos de ejemplo para las carreras. En un futuro, esto vendría de una API.
const careersData = {
    blockchain: {
        title: "Carrera Blockchain",
        subtitle: "Domina la tecnología que está revolucionando el mundo, desde criptomonedas hasta contratos inteligentes.",
        description: "<p>Conviértete en un experto en Blockchain. Aprenderás los fundamentos de la tecnología, a desarrollar tus propias criptomonedas, a programar Contratos Inteligentes (Smart Contracts) en Solidity y a crear aplicaciones descentralizadas (dApps) sobre Ethereum. Esta carrera te prepara para uno de los perfiles más demandados del mercado tecnológico.</p>",
        image: "https://images.unsplash.com/photo-1642104793539-2b89a154c738?q=80&w=2070&auto=format&fit=crop",
        coursesCount: 12,
        duration: "80h",
        outcomes: ["Desarrollador Blockchain", "Consultor de Criptoactivos", "Arquitecto de Soluciones Descentralizadas"],
        learningPath: [
            { id: 1, name: "Introducción a Blockchain y Criptomonedas", image_url: "https://picsum.photos/seed/bc1/300/180" },
            { id: 2, name: "Fundamentos de Ethereum", image_url: "https://picsum.photos/seed/bc2/300/180" },
            { id: 3, name: "Programación con Solidity", image_url: "https://picsum.photos/seed/bc3/300/180" },
            { id: 4, name: "Desarrollo de Smart Contracts", image_url: "https://picsum.photos/seed/bc4/300/180" },
        ]
    },
    emprendimiento: {
        title: "Carrera Emprendimiento Digital",
        subtitle: "Aprende a crear, lanzar y escalar tu propio negocio en el mundo digital con estrategias probadas.",
        description: "<p>Esta carrera te guía paso a paso en el proceso de convertir una idea en un negocio rentable. Cubre desde la validación de la idea y el modelo de negocio, hasta estrategias de marketing digital, ventas, y gestión financiera para startups. Ideal para futuros fundadores y intraemprendedores.</p>",
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop",
        coursesCount: 15,
        duration: "110h",
        outcomes: ["Fundador de Startup", "Gerente de Producto Digital", "Growth Hacker"],
        learningPath: [
            { id: 5, name: "Lean Startup: De la idea al producto", image_url: "https://picsum.photos/seed/em1/300/180" },
            { id: 6, name: "Marketing Digital para Startups", image_url: "https://picsum.photos/seed/em2/300/180" },
            { id: 7, name: "Finanzas para Emprendedores", image_url: "https://picsum.photos/seed/em3/300/180" },
            { id: 8, name: "Estrategias de Crecimiento y Escalado", image_url: "https://picsum.photos/seed/em4/300/180" },
        ]
    },
    ia: {
        title: "Carrera Experto en IA",
        subtitle: "Conviértete en un profesional de la Inteligencia Artificial, aprendiendo Machine Learning y Deep Learning.",
        description: "<p>Sumérgete en el campo de la Inteligencia Artificial. Esta ruta de aprendizaje te llevará desde los fundamentos de Python y las matemáticas para IA, hasta la implementación de algoritmos de Machine Learning, redes neuronales y modelos de Deep Learning con TensorFlow y PyTorch. Prepárate para la profesión del futuro.</p>",
        image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2070&auto=format&fit=crop",
        coursesCount: 18,
        duration: "150h",
        outcomes: ["Científico de Datos (Data Scientist)", "Ingeniero de Machine Learning", "Especialista en IA"],
        learningPath: [
            { id: 9, name: "Python para Data Science", image_url: "https://picsum.photos/seed/ia1/300/180" },
            { id: 10, name: "Fundamentos de Machine Learning", image_url: "https://picsum.photos/seed/ia2/300/180" },
            { id: 11, name: "Deep Learning con TensorFlow", image_url: "https://picsum.photos/seed/ia3/300/180" },
            { id: 12, name: "Procesamiento de Lenguaje Natural (NLP)", image_url: "https://picsum.photos/seed/ia4/300/180" },
        ]
    }
};

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