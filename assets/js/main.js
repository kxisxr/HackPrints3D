// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // === Animaciones de entrada (fade-in) ===
    const fadeInElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Opcional: remover 'active' si sale de la vista
                // entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.1 // Activar cuando el 10% del elemento sea visible
    });

    fadeInElements.forEach(el => {
        observer.observe(el);
    });

    // === Carrusel de Imágenes ===
    const carouselSlide = document.querySelector('.carousel-slide');
    const carouselImages = document.querySelectorAll('.carousel-slide img');
    const prevBtn = document.querySelector('.carousel-nav-btn.prev');
    const nextBtn = document.querySelector('.carousel-nav-btn.next');

    if (carouselSlide && carouselImages.length > 0) {
        let counter = 0;
        const size = carouselImages[0].clientWidth; // Ancho de una imagen

        // Clonar la primera y la última imagen para un loop infinito "suave"
        const lastClone = carouselImages[carouselImages.length - 1].cloneNode(true);
        const firstClone = carouselImages[0].cloneNode(true);
        carouselSlide.appendChild(firstClone);
        carouselSlide.insertBefore(lastClone, carouselImages[0]);

        // Mover al primer elemento "real" (después del clon de la última)
        carouselSlide.style.transform = `translateX(${-size * (counter + 1)}px)`;

        const updateCarousel = () => {
            carouselSlide.style.transition = 'transform 0.5s ease-in-out';
            carouselSlide.style.transform = `translateX(${-size * (counter + 1)}px)`;
        };

        const goToNextSlide = () => {
            if (counter >= carouselImages.length) return;
            counter++;
            updateCarousel();
        };

        const goToPrevSlide = () => {
            if (counter <= -1) return; // Permitir ir al clon inicial
            counter--;
            updateCarousel();
        };

        // Eventos para botones
        if (nextBtn) nextBtn.addEventListener('click', goToNextSlide);
        if (prevBtn) prevBtn.addEventListener('click', goToPrevSlide);

        // Transición infinita
        carouselSlide.addEventListener('transitionend', () => {
            if (carouselImages[counter] === firstClone) {
                carouselSlide.style.transition = 'none';
                counter = 0; // Resetear al inicio lógico
                carouselSlide.style.transform = `translateX(${-size * (counter + 1)}px)`;
            }
            if (carouselImages[counter] === lastClone) {
                carouselSlide.style.transition = 'none';
                counter = carouselImages.length - 1; // Resetear al final lógico
                carouselSlide.style.transform = `translateX(${-size * (counter + 1)}px)`;
            }
        });

        // Opcional: Carrusel automático
        // setInterval(goToNextSlide, 5000); 

        // Recalcular el tamaño si la ventana cambia (responsive)
        window.addEventListener('resize', () => {
            const newSize = carouselImages[0].clientWidth;
            carouselSlide.style.transition = 'none'; // Desactivar transición durante el resize
            carouselSlide.style.transform = `translateX(${-newSize * (counter + 1)}px)`;
        });

        // Asegurarse de que el carrusel se inicialice correctamente después de los clones
        // La primera imagen "real" es carouselImages[0] y está en la posición (counter+1)*size
        setTimeout(() => {
            carouselSlide.style.transition = 'none';
            carouselSlide.style.transform = `translateX(${-size * 1}px)`;
            counter = 0;
        }, 0); // Ejecutar después del render inicial
    }
});