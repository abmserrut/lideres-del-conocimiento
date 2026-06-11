// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeStorageKey = 'ldc-theme';
  const themeIconDark = '\u263d';
  const themeIconLight = '\u2600';

  const setTheme = (theme) => {
    body.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const icon = button.querySelector('.theme-toggle-icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? themeIconLight : themeIconDark;
      }

      button.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'
      );
      button.setAttribute(
        'title',
        theme === 'dark' ? 'Modo claro' : 'Modo oscuro'
      );
    });
  };

  const savedTheme = localStorage.getItem(themeStorageKey);
  setTheme(savedTheme === 'dark' ? 'dark' : 'light');

  const year = new Date().getFullYear();
  ['year', 'year2', 'year3', 'year4', 'year5'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = year;
  });

  const brandHeadingSelector = [
    '.hero .display-4',
    'main h1',
    'main .section-title',
    'main .card-title',
    'main .card h2:not(.section-title):not(.card-title)',
    'main .card h3:not(.section-title):not(.card-title)',
    'main .card h4:not(.section-title):not(.card-title)',
    'main .card h5:not(.section-title):not(.card-title)',
    'main .card h6:not(.section-title):not(.card-title)',
    '#subscribe h3'
  ].join(', ');

  document.querySelectorAll(brandHeadingSelector).forEach((heading) => {
    if (heading.dataset.brandHeadingStyled === 'true') return;

    const text = heading.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;

    const words = text.split(' ');
    heading.textContent = '';
    heading.classList.add('brand-heading');
    heading.dataset.brandHeadingStyled = 'true';

    if (words.length === 1) {
      heading.classList.add('brand-heading-single');
      const single = document.createElement('span');
      single.className = 'brand-heading-accent';
      single.textContent = words[0];
      heading.appendChild(single);
      return;
    }

    const accent = document.createElement('span');
    accent.className = 'brand-heading-accent';
    accent.textContent = words.shift();

    const main = document.createElement('span');
    main.className = 'brand-heading-main';
    main.textContent = words.join(' ');

    heading.appendChild(accent);
    heading.appendChild(main);
  });

  document.querySelectorAll('.navbar').forEach((navbar) => {
    if (navbar.querySelector('[data-theme-toggle]')) return;

    const actions = document.createElement('div');
    actions.className = 'nav-actions';

    const themeToggle = document.createElement('button');
    themeToggle.type = 'button';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('data-theme-toggle', '');

    const icon = document.createElement('span');
    icon.className = 'theme-toggle-icon';
    icon.setAttribute('aria-hidden', 'true');
    themeToggle.appendChild(icon);

    themeToggle.addEventListener('click', () => {
      themeToggle.classList.remove('is-animating');
      void themeToggle.offsetWidth;
      themeToggle.classList.add('is-animating');

      const nextTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(themeStorageKey, nextTheme);
      setTheme(nextTheme);
    });

    themeToggle.addEventListener('animationend', () => {
      themeToggle.classList.remove('is-animating');
    });

    themeToggle.addEventListener('transitionend', (event) => {
      if (event.propertyName === 'transform') {
        themeToggle.classList.remove('is-animating');
      }
    });

    actions.appendChild(themeToggle);

    const collapse = navbar.querySelector('.navbar-collapse');
    if (collapse) {
      collapse.appendChild(actions);
    } else {
      navbar.appendChild(actions);
    }
  });

  setTheme(body.dataset.theme === 'dark' ? 'dark' : 'light');

  const scrollTopButton = document.createElement('button');
  scrollTopButton.type = 'button';
  scrollTopButton.className = 'scroll-top';
  scrollTopButton.setAttribute('aria-label', 'Volver arriba');
  scrollTopButton.setAttribute('title', 'Volver arriba');

  const scrollTopIcon = document.createElement('span');
  scrollTopIcon.className = 'scroll-top-icon';
  scrollTopIcon.setAttribute('aria-hidden', 'true');
  scrollTopIcon.textContent = '\u2191';
  scrollTopButton.appendChild(scrollTopIcon);

  scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  body.appendChild(scrollTopButton);

  const toggleScrollTopVisibility = () => {
    if (window.scrollY > 420) {
      scrollTopButton.classList.add('is-visible');
    } else {
      scrollTopButton.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', toggleScrollTopVisibility, { passive: true });
  toggleScrollTopVisibility();

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value;
      if (email && email.includes('@')) {
        alert('Gracias por suscribirte: ' + email);
        newsletterForm.reset();
      } else {
        alert('Ingresa un correo v\u00E1lido.');
      }
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      ['name', 'email', 'message'].forEach((id) => {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
          el.classList.add('is-invalid');
          valid = false;
        } else {
          el.classList.remove('is-invalid');
        }
      });

      const email = document.getElementById('email');
      if (email && !/^\S+@\S+\.\S+$/.test(email.value)) {
        email.classList.add('is-invalid');
        valid = false;
      }

      if (valid) {
        alert('Formulario enviado. Gracias por contactarnos.');
        contactForm.reset();
      } else {
        alert('Por favor completa los campos requeridos.');
      }
    });
  }

  const links = document.querySelectorAll('.navbar .nav-link');
  links.forEach((link) => {
    if (
      link.href === window.location.href ||
      link.getAttribute('href') === window.location.pathname.split('/').pop()
    ) {
      link.classList.add('active');
    }
  });

  const activateLazyVideo = (video) => {
    const source = video.querySelector('source[data-src]');
    if (source && !source.src) {
      const useMobileSource = window.matchMedia('(max-width: 768px)').matches;
      source.src = useMobileSource && source.dataset.srcMobile
        ? source.dataset.srcMobile
        : source.dataset.src;
      video.load();
    }

    if (video.autoplay) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    }
  };

  const lazyVideos = document.querySelectorAll('video[data-lazy-video]');
  if (lazyVideos.length) {
    if ('IntersectionObserver' in window) {
      const lazyVideoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          activateLazyVideo(entry.target);
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '200px 0px' });

      lazyVideos.forEach((video) => lazyVideoObserver.observe(video));
    } else {
      lazyVideos.forEach(activateLazyVideo);
    }
  }
});
