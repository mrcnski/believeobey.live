// Show the floating "back to top" button once the page is scrolled, and scroll
// smoothly to the top when it's clicked. Replaces the old per-heading [top]
// links (top-links.js).
(function () {
    'use strict';

    const btn = document.querySelector('.to-top');
    if (!btn) {
        return;
    }

    // Reveal after roughly one-and-a-half screens of scrolling.
    function threshold() {
        return window.innerHeight * 1.5;
    }

    let ticking = false;
    function update() {
        btn.classList.toggle('is-visible', window.scrollY > threshold());
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    update();

    btn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Clear URL hash after the scroll settles (matches the old [top] links).
        setTimeout(() => {
            history.pushState(null, null, window.location.pathname);
        }, 500);
    });
})();
