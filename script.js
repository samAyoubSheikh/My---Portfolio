/* =========================================================
   PORTFOLIO SCRIPT
   Everything personal lives in CONFIG below.
   Leave a value as '' (empty) and that link/button shows as
   "not added yet" instead of pointing to a fake destination.
   ========================================================= */
(() => {
  'use strict';

  /* ---------------------------------------------------------
     CUSTOMISE: YOUR DETAILS (edit only this block)
     --------------------------------------------------------- */
  const CONFIG = {
    // Your full name. Replaces every [YOUR NAME] on the page.
    // (Also edit the <title> and meta tags in index.html by hand.)
    name: 'Sameer Ayoub',

    // Your email address. Used for the email link AND as the recipient of the contact form draft.
    // Example: 'yourname@gmail.com'
    email: 'sameerayoub6998@gmail.com',

    // Full profile URLs, including https://
    // Example: 'https://github.com/your-username'
    github: 'https://github.com/samAyoubSheikh',
    // Example: 'https://www.linkedin.com/in/your-profile'
    linkedin: 'https://www.linkedin.com/in/sameer-ayoub-56aa9923b',

    // Path to your résumé file, relative to index.html.
    // Example: 'assets/resume.pdf'
    resume: 'assets/Sameer_Ayoub_Resume.pdf',

    // Path to your profile photo, relative to index.html.
    // Example: 'assets/profile.jpg'
    profileImage: 'assets/Portfolio_image.jpeg',

    // Project links and screenshots. Keys match data-project="..." in index.html.
    // image  -> e.g. 'assets/projects/portfolio.png'
    // live   -> full live demo URL
    // source -> full repository URL
    projects: {
      portfolio: { image: '', live: '', source: 'https://github.com/samAyoubSheikh/My---Portfolio' },
      python:    { image: '', source: 'https://github.com/samAyoubSheikh/pythonlibraries' },
      java:      { image: '', source: 'https://github.com/samAyoubSheikh/Java-programming' }
    }
  };

  /* ---------------------------------------------------------
     HELPERS
     --------------------------------------------------------- */
  const $  = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = () => motionQuery.matches;

  const isUsable = (value) =>
    typeof value === 'string' && value.trim() !== '' && !/^\s*(javascript|data|vbscript):/i.test(value);

  document.documentElement.classList.add('js');

  /* ---------------------------------------------------------
     TOAST (small message shown when a button is not configured)
     --------------------------------------------------------- */
  const toast = $('#toast');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-shown'), 4500);
  }

  /* ---------------------------------------------------------
     LINK SETUP
     Real URL    -> normal working link
     Empty value -> disabled-looking control that explains itself
     --------------------------------------------------------- */
  function setupLink(el, url, missingMessage) {
    if (isUsable(url)) {
      el.setAttribute('href', url.trim());
      el.classList.remove('is-unconfigured');
      el.removeAttribute('aria-disabled');
      el.removeAttribute('role');
      el.removeAttribute('tabindex');
      el.removeAttribute('title');
      if (/^https?:\/\//i.test(url)) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
      return true;
    }
    el.removeAttribute('href');
    el.classList.add('is-unconfigured');
    el.setAttribute('role', 'link');
    el.setAttribute('aria-disabled', 'true');
    el.setAttribute('tabindex', '0');
    el.setAttribute('title', 'Not configured yet');
    el.dataset.missing = missingMessage;
    return false;
  }

  // Show the toast when someone clicks / presses a not-yet-configured control
  document.addEventListener('click', (event) => {
    const el = event.target.closest('.is-unconfigured');
    if (!el) return;
    event.preventDefault();
    showToast(el.dataset.missing || 'This link has not been added yet.');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const el = event.target.closest && event.target.closest('.is-unconfigured');
    if (!el) return;
    event.preventDefault();
    showToast(el.dataset.missing || 'This link has not been added yet.');
  });

  /* ---------------------------------------------------------
     IMAGE HELPER (profile photo + project screenshots)
     Missing or broken images never cause errors; the
     placeholder simply stays visible.
     --------------------------------------------------------- */
  function attachImage(container, src, alt, markerClass) {
    if (!container || !isUsable(src)) return;
    const img = new Image();
    img.alt = alt;
    img.decoding = 'async';
    img.addEventListener('load', () => container.classList.add(markerClass));
    img.addEventListener('error', () => img.remove());
    img.src = src.trim();
    container.appendChild(img);
  }

  function cleanUrlForDisplay(url) {
    return url.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '');
  }

  /* ---------------------------------------------------------
     APPLY CONFIG TO THE PAGE
     --------------------------------------------------------- */
  const displayName = (CONFIG.name || '').trim();

  if (displayName) {
    $$('[data-name]').forEach((el) => { el.textContent = displayName; });
    document.title = `${displayName} | Aspiring Software Developer`;
  }

  // Social, email and résumé links
  const linkMap = {
    email: {
      url: isUsable(CONFIG.email) ? `mailto:${CONFIG.email.trim()}` : '',
      message: 'Your email address has not been added yet. Set CONFIG.email in script.js.',
      text: isUsable(CONFIG.email) ? CONFIG.email.trim() : ''
    },
    github: {
      url: CONFIG.github,
      message: 'GitHub link has not been added yet. Set CONFIG.github in script.js.',
      text: isUsable(CONFIG.github) ? cleanUrlForDisplay(CONFIG.github) : ''
    },
    linkedin: {
      url: CONFIG.linkedin,
      message: 'LinkedIn link has not been added yet. Set CONFIG.linkedin in script.js.',
      text: isUsable(CONFIG.linkedin) ? cleanUrlForDisplay(CONFIG.linkedin) : ''
    },
    resume: {
      url: CONFIG.resume,
      message: 'Résumé has not been added yet. Set CONFIG.resume in script.js.',
      text: ''
    }
  };

  Object.keys(linkMap).forEach((key) => {
    const { url, message, text } = linkMap[key];
    $$(`[data-link="${key}"]`).forEach((el) => setupLink(el, url, message));
    if (text) $$(`[data-link-text="${key}"]`).forEach((el) => { el.textContent = text; });
  });

  // Profile photo
  attachImage(
    $('#avatar'),
    CONFIG.profileImage,
    displayName ? `Portrait of ${displayName}` : 'Profile photo',
    'has-image'
  );
  const avatar = $('#avatar');
  if (avatar && isUsable(CONFIG.profileImage)) {
    avatar.removeAttribute('role');
    avatar.removeAttribute('aria-label');
  }

  // Projects
  $$('.project-card').forEach((card) => {
    const key = card.dataset.project;
    const project = (CONFIG.projects && CONFIG.projects[key]) || {};
    const title = ($('.project-title', card) || {}).textContent || 'project';
    let hasAnyLink = false;

    $$('[data-project-link]', card).forEach((el) => {
      const kind = el.dataset.projectLink; // 'live' or 'source'
      const label = kind === 'live' ? 'live demo' : 'source code';
      const ok = setupLink(
        el,
        project[kind],
        `The ${label} link for this project has not been added yet. Set CONFIG.projects.${key}.${kind} in script.js.`
      );
      if (ok) hasAnyLink = true;
    });

    const status = $('.project-status', card);
    if (status) status.hidden = hasAnyLink;

    attachImage($('.project-media', card), project.image, `Screenshot of ${title}`, 'has-image');
  });

  // Footer year
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ---------------------------------------------------------
     SMOOTH SCROLLING FOR IN-PAGE LINKS
     --------------------------------------------------------- */
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    try { history.replaceState(null, '', `#${id}`); } catch (e) { /* ignore (some file:// contexts) */ }
  });

  /* ---------------------------------------------------------
     MOBILE NAVIGATION
     --------------------------------------------------------- */
  const header = $('.site-header');
  const navToggle = $('.nav-toggle');
  const nav = $('#primary-nav');
  const MOBILE_BREAKPOINT = 860;

  function setMenu(open, returnFocus = false) {
    if (!navToggle || !nav) return;
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    if (!open && returnFocus) navToggle.focus();
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close after choosing a link
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false);
    });

    // Close with Escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false, true);
    });

    // Close when clicking outside
    document.addEventListener('click', (event) => {
      if (!nav.classList.contains('is-open')) return;
      if (!event.target.closest('.site-header')) setMenu(false);
    });

    // Reset when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) setMenu(false);
    });
  }

  /* ---------------------------------------------------------
     ACTIVE NAV LINK (based on visible section)
     --------------------------------------------------------- */
  const navLinks = $$('.nav-link');
  const linkById = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));

  function setActive(id) {
    navLinks.forEach((a) => {
      a.classList.remove('is-active');
      a.removeAttribute('aria-current');
    });
    const link = linkById.get(id);
    if (link) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'true');
    }
  }

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    $$('main section[id]').forEach((section) => sectionObserver.observe(section));
  }

  /* ---------------------------------------------------------
     SCROLL REVEAL
     --------------------------------------------------------- */
  const revealEls = $$('.reveal');

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------------------------------------------------
     SCROLL-DEPENDENT UI (sticky header style, back-to-top)
     --------------------------------------------------------- */
  const backToTop = $('#back-to-top');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;

    if (header) header.classList.toggle('is-scrolled', y > 10);
    if (backToTop) backToTop.classList.toggle('is-shown', y > 600);

    // When scrolled to the very bottom, make sure the last nav section is highlighted
    const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 4;
    if (atBottom && y > 0) setActive('contact');

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     CONTACT FORM: validate, then open a pre-filled email draft
     --------------------------------------------------------- */
  const form = $('#contact-form');
  const statusBox = $('#form-status');

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validators = {
    name(value) {
      if (!value) return 'Please enter your name.';
      if (value.length < 2) return 'Your name should be at least 2 characters.';
      return '';
    },
    email(value) {
      if (!value) return 'Please enter your email address.';
      if (!EMAIL_PATTERN.test(value)) return 'Please enter a valid email address.';
      return '';
    },
    subject(value) {
      if (!value) return 'Please enter a subject.';
      if (value.length < 3) return 'The subject should be at least 3 characters.';
      return '';
    },
    message(value) {
      if (!value) return 'Please write a message.';
      if (value.length < 10) return 'Your message should be at least 10 characters.';
      return '';
    }
  };

  function setFieldError(input, message) {
    const errorEl = document.getElementById(`${input.id}-error`);
    if (errorEl) errorEl.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  function validateField(input) {
    const rule = validators[input.name];
    const message = rule ? rule(input.value.trim()) : '';
    setFieldError(input, message);
    return !message;
  }

  function setStatus(type, message) {
    if (!statusBox) return;
    statusBox.className = 'form-status';
    statusBox.textContent = message;
    if (message) statusBox.classList.add(type === 'error' ? 'is-error' : 'is-success');
  }

  if (form) {
    const inputs = $$('input, textarea', form);

    inputs.forEach((input) => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') validateField(input);
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      setStatus('', '');

      let firstInvalid = null;
      inputs.forEach((input) => {
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        setStatus('error', 'Please fix the highlighted fields and try again.');
        firstInvalid.focus();
        return;
      }

      if (!isUsable(CONFIG.email)) {
        setStatus('error', 'The recipient email address has not been set up yet. Add it as CONFIG.email in script.js.');
        return;
      }

      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const subject = form.elements.subject.value.trim();
      const message = form.elements.message.value.trim();

      const body = `${message}\r\n\r\n--\r\n${name}\r\n${email}`;
      const mailto = `mailto:${CONFIG.email.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;

      setStatus(
        'success',
        'Your email app should now open with your message ready. Press send there to deliver it. If nothing opens, you may not have an email app set up, so you can write to me directly at ' + CONFIG.email.trim() + '.'
      );
    });
  }
})();