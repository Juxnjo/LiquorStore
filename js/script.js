document.addEventListener("DOMContentLoaded", function() {
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  const progress = document.querySelector(".carousel-progress");
  const indicators = Array.from(document.querySelectorAll(".indicator-item"));

  const slideWidth = slides[0].getBoundingClientRect().width;
  let currentIndex = 0;
  let isTransitioning = false;
  let progressInterval;
  let startTime;
  let elapsedTime = 0;

  function setSlidePosition(index) {
    if (!isTransitioning) {
      isTransitioning = true;
      track.style.transition = "transform 0.3s ease-in";
      track.style.transform = `translateX(-${index * slideWidth}px)`;
    }
  }

  function updateSlide(index) {
    slides[currentIndex].classList.remove("active");
    slides[index].classList.add("active");
    currentIndex = index;
    updateIndicator();
  }

  function showPrevSlide() {
    if (!isTransitioning) {
      const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
      updateSlide(newIndex);
      setSlidePosition(newIndex);
      resetProgress();
    }
  }

  function showNextSlide() {
    if (!isTransitioning) {
      const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
      updateSlide(newIndex);
      setSlidePosition(newIndex);
      resetProgress();
    }
  }

  track.addEventListener("transitionend", function() {
    isTransitioning = false;
    track.style.transition = "";
    track.style.pointerEvents = "auto"; // Habilitar la interacción nuevamente
  });

  prevBtn.addEventListener("click", showPrevSlide);
  nextBtn.addEventListener("click", showNextSlide);

  indicators.forEach(function(indicator, index) {
    indicator.addEventListener("click", function() {
      if (!isTransitioning && index !== currentIndex) {
        updateSlide(index);
        setSlidePosition(index);
        resetProgress();
      }
    });
  });

  function updateIndicator() {
    const indicator = document.querySelector(".carousel-indicator");
    if (indicator) {
      indicator.innerHTML = "";

      slides.forEach((slide, index) => {
        const indicatorItem = document.createElement("div");
        indicatorItem.classList.add("indicator-item");
        if (index === currentIndex) {
          indicatorItem.classList.add("active");
        }
        indicator.appendChild(indicatorItem);
      });
    }
  }

  function resetProgress() {
    clearInterval(progressInterval);
    progress.style.transition = "";
    progress.style.width = "0";
    elapsedTime = 0;
    startProgress();
  }

  function startProgress() {
    startTime = Date.now();
    progressInterval = setInterval(updateProgress, 10);
  }

  function updateProgress() {
    const currentTime = Date.now();
    const deltaTime = currentTime - startTime;
    elapsedTime += deltaTime;
    startTime = currentTime;

    const progressWidth = (elapsedTime / 3000) * 100; // Cambiar 3000 por la duración deseada en milisegundos

    if (progressWidth <= 100) {
      progress.style.width = `${progressWidth}%`;
    } else {
      progress.style.width = "100%";
      clearInterval(progressInterval);
      showNextSlide();
      resetProgress();
    }
  }

  // Agrega los listeners para detener/reiniciar la barra de progreso al pasar el cursor sobre el carousel
  track.addEventListener("mouseenter", function() {
    clearInterval(progressInterval);
    track.style.pointerEvents = "none"; // Deshabilitar la interacción mientras se mueve la barra de progreso
  });

  track.addEventListener("mouseleave", function() {
    startProgress();
  });

  updateSlide(currentIndex);
  slides[currentIndex].classList.add("active");
  updateIndicator();
  startProgress();
});
