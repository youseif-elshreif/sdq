/**
 * SDQ WORLD — reveal-on-scroll
 *
 * Adds a subtle fade-in-up entrance to top-level theme sections.
 * - Respects `prefers-reduced-motion` and low-power devices.
 * - No-JS safe: elements are only hidden once JS adds `.sdq-reveal`.
 * - Sections already in the viewport on load are revealed immediately
 *   so the View Transitions snapshot never shows empty content.
 */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPower = Number(navigator.hardwareConcurrency) <= 2 || Number(navigator.deviceMemory) <= 2;
  if (reduceMotion || lowPower) return;

  // When the browser lacks the View Transitions API, add a CSS-only
  // page-entrance fallback so navigation still feels smooth everywhere.
  if (!('startViewTransition' in document)) {
    document.documentElement.classList.add('sdq-no-vt');
  }

  const main = document.querySelector('.content-for-layout');
  if (!main) return;

  const sections = Array.from(main.querySelectorAll(':scope > .section'));
  if (!sections.length) return;

  sections.forEach((section) => section.classList.add('sdq-reveal'));

  if (!('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('sdq-reveal--visible'));
    return;
  }

  const inViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('sdq-reveal--visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  );

  sections.forEach((section, index) => {
    if (inViewport(section)) {
      section.classList.add('sdq-reveal--visible');
      return;
    }
    // Small stagger for below-the-fold sections only.
    section.style.transitionDelay = `${Math.min(index * 80, 400)}ms`;
    observer.observe(section);
  });
})();