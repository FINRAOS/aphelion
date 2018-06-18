// https://github.com/jlmakes/scrollreveal
window.sr = ScrollReveal();
sr.reveal('.reveal');
sr.reveal('#splash-title', { duration: 1000 });
sr.reveal('#splash-menu-finra', { delay: 500, duration: 1000, origin: 'right' });
sr.reveal('#splash-cta', { delay: 500, duration: 1000, origin: 'right' });
sr.reveal('#splash-menu-anchors', { delay: 500, duration: 1000, origin: 'left' });
sr.reveal('#splash-links', { delay: 500, origin: 'left' });
sr.reveal('#splash-img', { delay: 1000, duration: 2000 });
sr.reveal('.reveal-features', { delay: 500, origin: 'top' });
sr.reveal('.reveal-get-started', { delay: 500, origin: 'top' });
sr.reveal('.reveal-related-products', { delay: 500, origin: 'top' }, 300);
