/* ======================
   Main JavaScript
   ====================== */


// --- Mobile Navigation Toggle ---

const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav__links--open');
  });
}


// --- Sticky Nav on Scroll ---

const navHeader = document.querySelector('.nav-header');

if (navHeader) {
  const SCROLL_THRESHOLD = 40;

  const onScroll = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navHeader.classList.add('nav-header--scrolled');
    } else {
      navHeader.classList.remove('nav-header--scrolled');
    }
  };

  // Check on load in case page is already scrolled
  onScroll();

  window.addEventListener('scroll', onScroll, { passive: true });
}


// --- Lottie Underline on Nav Hover ---

document.querySelectorAll('.nav__link').forEach((link) => {
  const player = link.querySelector('dotlottie-player');
  if (!player) return;

  link.addEventListener('mouseenter', () => {
    player.stop();
    player.play();
  });

  link.addEventListener('mouseleave', () => {
    player.stop();
  });
});


// --- Gallery Lightbox ---

(function initLightbox() {
  const lightbox      = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxLabel = document.getElementById('lightbox-label');
  const lightboxDesc  = document.getElementById('lightbox-description');
  const lightboxCount = document.getElementById('lightbox-counter');
  const btnClose      = document.getElementById('lightbox-close');
  const btnPrev       = document.getElementById('lightbox-prev');
  const btnNext       = document.getElementById('lightbox-next');

  if (!lightbox) return;

  let currentIndex = 0;
  let previousFocus = null;
  let items = [];

  // Reel page: gallery cards
  const galleryCards = Array.from(document.querySelectorAll('[data-lightbox]'));
  if (galleryCards.length > 0) {
    items = galleryCards.map((card) => {
      const img = card.querySelector('.gallery__image');
      const label = card.querySelector('.gallery__label');
      const desc = card.querySelector('.gallery__description');
      return {
        src:   img ? img.src : '',
        alt:   img ? img.alt : '',
        label: label ? label.textContent : '',
        desc:  desc ? desc.textContent : ''
      };
    });

    galleryCards.forEach((card) => {
      card.addEventListener('click', () => {
        open(parseInt(card.dataset.lightbox, 10));
      });
    });
  }

  // Case study page: any image with data-cs-lightbox
  const csTriggers = Array.from(document.querySelectorAll('[data-cs-lightbox]'));
  if (csTriggers.length > 0) {
    items = csTriggers.map((trigger) => {
      const img = trigger.querySelector('img');
      const caption = trigger.querySelector('.cs-image__caption');
      return {
        src:   img ? img.src : '',
        alt:   img ? img.alt : '',
        label: '',
        desc:  caption ? caption.textContent : (img ? img.alt : '')
      };
    });

    csTriggers.forEach((trigger) => {
      trigger.style.cursor = 'pointer';
      trigger.addEventListener('click', () => {
        open(parseInt(trigger.dataset.csLightbox, 10));
      });
    });
  }

  if (items.length === 0) return;

  function show(index) {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxLabel.textContent = item.label;
    lightboxDesc.textContent  = item.desc;
    lightboxCount.textContent = (currentIndex + 1) + ' / ' + items.length;
  }

  function open(index) {
    previousFocus = document.activeElement;
    show(index);
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function close() {
    lightbox.classList.remove('lightbox--open');
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
  }

  // Controls
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(currentIndex - 1));
  btnNext.addEventListener('click', () => show(currentIndex + 1));

  // Click backdrop to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('lightbox--open')) return;

    switch (e.key) {
      case 'Escape':
        close();
        break;
      case 'ArrowLeft':
        show(currentIndex - 1);
        break;
      case 'ArrowRight':
        show(currentIndex + 1);
        break;
    }
  });

  // Trap focus inside lightbox
  lightbox.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const focusable = lightbox.querySelectorAll('button');
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();


// --- About Page: Alternating Photos ---

(function () {
  const photos = document.querySelectorAll('.about-hero__photo-img');
  if (photos.length < 2) return;

  let current = 0;
  setInterval(() => {
    photos[current].classList.remove('about-hero__photo-img--active');
    current = (current + 1) % photos.length;
    photos[current].classList.add('about-hero__photo-img--active');
  }, 1000);
})();
