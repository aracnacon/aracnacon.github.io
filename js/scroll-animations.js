/* ===== GSAP ScrollTrigger — Scroll-Driven Reveals ===== */

(function () {
  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // Shared defaults
  var defaults = {
    duration: 0.8,
    ease: 'power2.out',
  };

  // --- Section-level reveals ---

  // Animate all .gs-reveal elements (fade up)
  gsap.utils.toArray('.gs-reveal').forEach(function (el) {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      opacity: 1,
      y: 0,
      duration: defaults.duration,
      ease: defaults.ease,
    });
  });

  // Animate .gs-reveal-scale elements (fade + scale)
  gsap.utils.toArray('.gs-reveal-scale').forEach(function (el) {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      opacity: 1,
      scale: 1,
      duration: defaults.duration,
      ease: defaults.ease,
    });
  });

  // Animate .gs-reveal-left elements (fade from left)
  gsap.utils.toArray('.gs-reveal-left').forEach(function (el) {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      opacity: 1,
      x: 0,
      duration: defaults.duration,
      ease: defaults.ease,
    });
  });

  // Animate .gs-reveal-right elements (fade from right)
  gsap.utils.toArray('.gs-reveal-right').forEach(function (el) {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      opacity: 1,
      x: 0,
      duration: defaults.duration,
      ease: defaults.ease,
    });
  });

  // --- Staggered content reveals inside sections ---

  gsap.utils.toArray('section.gs-reveal').forEach(function (section) {
    // Select direct children that should stagger in
    var children = section.querySelectorAll(':scope > h2, :scope > h3, :scope > p, :scope > ul, :scope > blockquote, :scope > .screenshot-gallery, :scope > .demo-row, :scope > .hex-grid, :scope > .story-row, :scope > .social-row, :scope > form');

    if (children.length < 2) return; // no stagger needed for single-child sections

    // Set initial state on children
    gsap.set(children, { opacity: 0, y: 20 });

    // Stagger children when section enters viewport
    gsap.to(children, {
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        once: true,
      },
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.12,
      delay: 0.2, // slight delay after section itself appears
      ease: defaults.ease,
    });
  });

  // --- Stagger hex-groups on aracnatech page ---

  gsap.utils.toArray('.hex-group.gs-reveal').forEach(function (group, i) {
    gsap.to(group, {
      scrollTrigger: {
        trigger: group,
        start: 'top 85%',
        once: true,
      },
      opacity: 1,
      y: 0,
      duration: defaults.duration,
      delay: i * 0.15,
      ease: defaults.ease,
    });
  });

  // --- Stagger screenshot thumbnails ---

  gsap.utils.toArray('.screenshot-gallery').forEach(function (gallery) {
    var thumbs = gallery.querySelectorAll('.screenshot-thumb');
    if (!thumbs.length) return;

    gsap.set(thumbs, { opacity: 0, scale: 0.85 });

    gsap.to(thumbs, {
      scrollTrigger: {
        trigger: gallery,
        start: 'top 85%',
        once: true,
      },
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.3,
      ease: 'back.out(1.4)',
    });
  });

  // --- Stagger list items ---

  gsap.utils.toArray('section.gs-reveal ul').forEach(function (list) {
    var items = list.querySelectorAll('li');
    if (items.length < 2) return;

    gsap.set(items, { opacity: 0, x: -15 });

    gsap.to(items, {
      scrollTrigger: {
        trigger: list,
        start: 'top 85%',
        once: true,
      },
      opacity: 1,
      x: 0,
      duration: 0.4,
      stagger: 0.08,
      delay: 0.3,
      ease: defaults.ease,
    });
  });

  // --- Footer reveal ---

  var footer = document.querySelector('footer');
  if (footer) {
    footer.classList.add('gs-reveal');
    gsap.to(footer, {
      scrollTrigger: {
        trigger: footer,
        start: 'top 95%',
        once: true,
      },
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: defaults.ease,
    });
  }

  // --- Parallax backgrounds ---

  // Pages with background images get a subtle parallax shift
  var body = document.body;
  var hasPageBg = body.classList.contains('page-home') ||
                  body.classList.contains('page-marines') ||
                  body.classList.contains('page-experience') ||
                  body.classList.contains('page-projects') ||
                  body.classList.contains('page-faith') ||
                  body.classList.contains('page-aracnatech') ||
                  body.classList.contains('page-compare');

  if (hasPageBg) {
    gsap.to(body, {
      scrollTrigger: {
        trigger: body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      },
      backgroundPosition: '50% 30%',
      ease: 'none',
    });
  }
})();
