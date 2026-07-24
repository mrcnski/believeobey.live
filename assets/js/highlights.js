// Theme-linked highlights.
//
// Highlights rest as a soft wash; hovering one brings every highlight of the
// same color in the same section up to full strength, so related phrases find
// each other across verses.
//
// On touch (no hover), tapping a highlight locks its theme on; tapping it
// again, or tapping away, releases it.
//
// Scoping: highlight colors are reused for unrelated themes elsewhere on a
// page, so linking is limited to a shared scope:
//
// - Inside a table that is the row, or the row group (tbody) when the table
//   uses several, per the rowspan-group convention.
// - Outside tables it is the content under the nearest heading.
(function () {
    'use strict';

    const THEMES = ['hl-1', 'hl-2', 'hl-3', 'hl-4', 'hl-5', 'hl-6', 'hl-7', 'hl-8'];
    const SELECTOR = THEMES.map(t => '.' + t).join(', ');

    if (!document.querySelector(SELECTOR)) {
        return;
    }

    // Number the heading-delimited sections in document order, and stamp each
    // highlight with the section it falls under.
    let section = 0;
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, ' + SELECTOR).forEach(el => {
        if (/^H[1-6]$/.test(el.tagName)) {
            section += 1;
        } else {
            el.dataset.hlSection = String(section);
        }
    });

    function themeOf(el) {
        return THEMES.find(t => el.classList.contains(t));
    }

    function scopeOf(el) {
        const row = el.closest('tr');
        if (!row) {
            return 'section-' + el.dataset.hlSection;
        }
        const table = row.closest('table');
        const grouped = table && table.querySelectorAll(':scope > tbody').length > 1;
        return grouped ? row.closest('tbody') : row;
    }

    function setTheme(theme, scope, on) {
        document.querySelectorAll('.' + theme).forEach(el => {
            if (scopeOf(el) === scope) {
                el.classList.toggle('on', on);
            }
        });
    }

    // A tapped theme stays lit until released; hover never overrides it.
    let locked = null;

    document.addEventListener('mouseover', function (e) {
        if (locked || !(e.target instanceof Element)) {
            return;
        }
        const hl = e.target.closest(SELECTOR);
        if (hl) {
            setTheme(themeOf(hl), scopeOf(hl), true);
        }
    });

    document.addEventListener('mouseout', function (e) {
        if (locked || !(e.target instanceof Element)) {
            return;
        }
        const hl = e.target.closest(SELECTOR);
        if (hl) {
            setTheme(themeOf(hl), scopeOf(hl), false);
        }
    });

    document.addEventListener('click', function (e) {
        const hl = e.target instanceof Element ? e.target.closest(SELECTOR) : null;
        if (!hl) {
            if (locked) {
                setTheme(locked.theme, locked.scope, false);
                locked = null;
            }
            return;
        }
        const theme = themeOf(hl);
        const scope = scopeOf(hl);
        if (locked && locked.theme === theme && locked.scope === scope) {
            locked = null;
            setTheme(theme, scope, false);
        } else {
            if (locked) {
                setTheme(locked.theme, locked.scope, false);
            }
            locked = { theme: theme, scope: scope };
            setTheme(theme, scope, true);
        }
    });
})();
