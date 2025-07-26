// Generate link anchors for all headlines.
$('h2,h3,h4,h5,h6').filter('[id]').each(function () {
    const el = $(this);

    const id = el.attr('id');
    el.html('<a href="#'+id+'">' + el.text() + '</a>');

    // Set smooth scrolling to this headline from all links to it.
    $('a[href="#'+id+'"]').each(function () {
        this.addEventListener('click', function(e) {
            e.preventDefault();

            // Get the target position JIT, as it may have shifted on the page (e.g. TOC opened).
            const top = el.offset().top;
            window.scrollTo({
                top,
                behavior: 'smooth'
            });

            // Update URL after smooth scroll completes
            setTimeout(() => {
                history.pushState(null, null, '#' + id);
            }, 500);
        });
    });
});
