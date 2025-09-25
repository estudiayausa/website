document.addEventListener('DOMContentLoaded', function() {
    initializeCareersCarousel();
});

function initializeCareersCarousel() {
    const carousel = document.getElementById('careers-carousel');
    if (!carousel) return;

    const container = carousel.querySelector('.carousel-container');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const nextBtn = document.querySelector('.carousel-controls .next');
    const cards = container.querySelectorAll('.career-card');

    if (!container || !prevBtn || !nextBtn || cards.length === 0) {
        console.warn('Elementos del carrusel de carreras no encontrados.');
        return;
    }

    let currentIndex = 0;
    const totalCards = cards.length;

    const getVisibleCount = () => {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    };

    const updateCarousel = () => {
        const visibleCount = getVisibleCount();
        const maxIndex = totalCards - visibleCount;

        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        const cardWidth = container.querySelector('.career-card').offsetWidth;
        const margin = 32; // Corresponde a 1rem de margen a cada lado (16px * 2)
        const offset = -currentIndex * (cardWidth + margin);
        container.style.transform = `translateX(${offset}px)`;

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

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
}