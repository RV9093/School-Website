
const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach(drop => {
  drop.addEventListener("click", function (event) {
    // Prevent the click from closing instantly
    event.stopPropagation();

    // Close other open dropdowns
    dropdowns.forEach(d => {
      if (d !== this) d.querySelector(".dropdown-menu").style.display = "none";
    });

    // Toggle current dropdown
    const menu = this.querySelector(".dropdown-menu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
  });
});

// Close dropdowns when clicking outside
window.addEventListener("click", function () {
  dropdowns.forEach(d => d.querySelector(".dropdown-menu").style.display = "none");
});

// Image Slider

const track = document.getElementById("image-container");
let slides = document.querySelectorAll(".school-function-image-1");

// Clone first and last slides for infinite effect
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.id = "first-clone";
lastClone.id = "last-clone";

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

slides = document.querySelectorAll(".school-function-image-1");

let counter = 1;
const slideCount = slides.length;

// Initial position
track.style.transform = `translateX(-${counter * 100}%)`;

// Lock for fast clicks
let isAnimating = false;

// NEXT
function sliderNext() {
  if (isAnimating) return;
  isAnimating = true;
  counter++;
  track.style.transition = "transform 0.6s ease-in-out";
  track.style.transform = `translateX(-${counter * 100}%)`;
}

// PREV
function sliderPrev() {
  if (isAnimating) return;
  isAnimating = true;
  counter--;
  track.style.transition = "transform 0.6s ease-in-out";
  track.style.transform = `translateX(-${counter * 100}%)`;
}

// Handle clones for infinite loop
track.addEventListener("transitionend", () => {
  if (slides[counter].id === "first-clone") {
    track.style.transition = "none";
    counter = 1;
    track.style.transform = `translateX(-${counter * 100}%)`;
  }
  if (slides[counter].id === "last-clone") {
    track.style.transition = "none";
    counter = slides.length - 2;
    track.style.transform = `translateX(-${counter * 100}%)`;
  }
  isAnimating = false;
});

// Auto-slide
let autoSlide = setInterval(sliderNext, 3000);

// Pause on hover
track.parentElement.addEventListener("mouseenter", () => clearInterval(autoSlide));
track.parentElement.addEventListener("mouseleave", () => autoSlide = setInterval(sliderNext, 3000));

//INSIDE school

/* =====================================
   INSIDE SCHOOL – TAB LOGIC (TABLE STYLE)
   ===================================== */

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".insideTabs .nav-link");
  const panes = document.querySelectorAll(".tab-pane");

  function activateTab(targetId) {
    // Deactivate all tabs
    tabs.forEach(tab => {
      tab.classList.remove("active");
      tab.setAttribute("aria-selected", "false");
    });

    // Hide all panes
    panes.forEach(pane => {
      pane.classList.remove("active", "show");
    });

    // Activate selected tab
    const activeTab = document.querySelector(
      `.insideTabs .nav-link[data-bs-target="${targetId}"]`
    );
    if (activeTab) {
      activeTab.classList.add("active");
      activeTab.setAttribute("aria-selected", "true");
    }

    // Show selected pane
    const activePane = document.querySelector(targetId);
    if (activePane) {
      activePane.classList.add("active", "show");
    }
  }

  // Click handling
  tabs.forEach(tab => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("data-bs-target");
      activateTab(targetId);
    });
  });

  // Ensure correct default state on load
  const defaultTab = document.querySelector(".insideTabs .nav-link.active");
  if (defaultTab) {
    activateTab(defaultTab.getAttribute("data-bs-target"));
  }
});

// PHOTOS

document.addEventListener('DOMContentLoaded', function () {

  const slider = document.querySelector('.photosSliders');
  const track = document.querySelector('.img-track');
  let slides = Array.from(document.querySelectorAll('.img-slide'));

  if (!slider || !track || slides.length === 0) return;

  const visibleSlides = 3;
  let index = visibleSlides;
  let slideWidth = 0;
  let autoSlideTimer;

  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  /* ---------- Clone slides for infinite loop ---------- */
  function cloneSlides() {
    const firstClones = slides.slice(0, visibleSlides).map(slide => slide.cloneNode(true));
    const lastClones = slides.slice(-visibleSlides).map(slide => slide.cloneNode(true));

    firstClones.forEach(clone => track.appendChild(clone));
    lastClones.forEach(clone => track.insertBefore(clone, track.firstChild));

    slides = Array.from(document.querySelectorAll('.img-slide'));
  }

  /* ---------- Setup ---------- */
  function calculateWidth() {
    slideWidth = slides[0].offsetWidth;
  }

  function setPosition(animate = true) {
    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(${-index * slideWidth}px)`;
  }

  /* ---------- Infinite correction ---------- */
  function checkInfinite() {
    if (index <= 0) {
      index = slides.length - (visibleSlides * 2);
      setPosition(false);
    }

    if (index >= slides.length - visibleSlides) {
      index = visibleSlides;
      setPosition(false);
    }
  }

  /* ---------- Auto slide ---------- */
  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      index++;
      setPosition(true);
    }, 2500);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideTimer);
  }

  /* ---------- Drag ---------- */
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    prevTranslate = -index * slideWidth;
    track.style.transition = 'none';
    stopAutoSlide();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta = e.pageX - startX;
    currentTranslate = prevTranslate + delta;
    track.style.transform = `translateX(${currentTranslate}px)`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -50) index++;
    if (movedBy > 50) index--;

    setPosition(true);
    startAutoSlide();
  });

  /* ---------- Hover pause ---------- */
  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);

  /* ---------- Transition end ---------- */
  track.addEventListener('transitionend', checkInfinite);

  /* ---------- Init ---------- */
  window.addEventListener('load', () => {
    cloneSlides();
    calculateWidth();
    setPosition(false);
    startAutoSlide();
  });

  window.addEventListener('resize', () => {
    calculateWidth();
    setPosition(false);
  });

});

// ===================== COPYRIGHT SECTION ===================== 

document.addEventListener("DOMContentLoaded", function () {
  const footerSection = document.querySelector(".Copyright-section");
  const plusBtn = document.querySelector(".Mi-Footer-More-Btn.plus");
  const minusBtn = document.querySelector(".Mi-Footer-More-Btn.minus");

  if (!footerSection) return;

  plusBtn.addEventListener("click", () => {
    footerSection.classList.add("footer-open");
  });

  minusBtn.addEventListener("click", () => {
    footerSection.classList.remove("footer-open");
  });
});
