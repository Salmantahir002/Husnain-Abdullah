document.addEventListener('DOMContentLoaded', () => {

  // --- Navigation and Page Switching ---
  const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile-item, .site-title, .nav-link-icon');
  const pages = document.querySelectorAll('.page');
  const desktopNavLinks = document.querySelectorAll('.nav-links .nav-link');
  const mobileNavContainer = document.querySelector('.nav-links-mobile');
  const menuToggle = document.querySelector('.menu-toggle');

  function changePage(targetPageId) {
    if (!targetPageId) return;

    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(targetPageId);
    if (targetPage) targetPage.classList.add('active');

    desktopNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === targetPageId) link.classList.add('active');
    });

    window.scrollTo(0, 0);

    if (mobileNavContainer && mobileNavContainer.classList.contains('active')) {
      mobileNavContainer.classList.remove('active');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.target === '_blank') return;
      e.preventDefault();
      const targetPageId = link.dataset.page;
      changePage(targetPageId);
    });
  });

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (!mobileNavContainer) return;
      mobileNavContainer.classList.toggle('active');
      const expanded = mobileNavContainer.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  // --- Carousel / Slideshow ---
  let slideIndex = 0;
  let slideTimer;
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');

  function showSlides(n) {
    if (!slides.length) return;

    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;

    slides.forEach(slide => slide.style.display = "none");
    dots.forEach(dot => dot.classList.remove('active'));

    slides[slideIndex].style.display = "block";
    slides[slideIndex].classList.add('fade');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
  }

  function startTimer() {
    if (slideTimer) clearTimeout(slideTimer);
    slideTimer = setTimeout(() => {
      slideIndex++;
      showSlides(slideIndex);
      startTimer();
    }, 3000);
  }

  function currentSlide(n) {
    if (slideTimer) clearTimeout(slideTimer);
    slideIndex = n;
    showSlides(slideIndex);
    startTimer();
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => currentSlide(idx));
  });

  if (slides.length) {
    showSlides(slideIndex);
    startTimer();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      slideIndex--;
      showSlides(slideIndex);
    } else if (e.key === 'ArrowRight') {
      slideIndex++;
      showSlides(slideIndex);
    }
  });

  // --- Scroll to Top Button ---
  const scrollBtn = document.getElementById('scrollToTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('show');
      } else {
        scrollBtn.classList.remove('show');
      }
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Lazy-load CV PDF into CV page ---
  (function setupCVViewer() {
    const cvViewer = document.getElementById('cvViewer');
    if (!cvViewer) return;

    const pdfFile = cvViewer.dataset.pdf || 'Curriculum_Vitae (3).pdf';
    const downloadLink = document.getElementById('cvDownload');
    if (downloadLink) downloadLink.href = pdfFile;

    let loaded = false;

    function loadCV() {
      if (loaded) return;
      loaded = true;
      const iframe = document.createElement('iframe');
      iframe.src = pdfFile;
      iframe.title = 'Curriculum Vitae';
      iframe.loading = 'lazy';
      iframe.allow = 'autoplay; fullscreen';
      cvViewer.innerHTML = '';
      cvViewer.appendChild(iframe);
    }

    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-page="cv"]');
      if (target) setTimeout(loadCV, 80);
    });

    if (document.getElementById('cv')?.classList.contains('active')) {
      setTimeout(loadCV, 120);
    }

    window.addEventListener('popstate', () => {
      const cvEl = document.getElementById('cv');
      if (cvEl && cvEl.classList.contains('active')) loadCV();
    });
  })();

}); // <--- Do NOT put any code after this