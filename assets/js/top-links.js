// Add [top] links to all headers
(function() {
    'use strict';

    function addTopLinks() {
        // Find all headers.
        const headers = document.querySelectorAll('h2');

        headers.forEach(function(header) {
            // Skip if this header already has a top link
            if (header.querySelector('.top-link')) {
                return;
            }

            // Create the top link element
            const topLink = document.createElement('a');
            topLink.href = '#';
            topLink.className = 'top-link';
            topLink.innerHTML = 'top&nbsp;&#8673;';

            // Add smooth scroll behavior
            topLink.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                // Clear URL hash after scroll completes
                setTimeout(() => {
                    history.pushState(null, null, window.location.pathname);
                }, 500);
            });

            // Append the link to the header
            header.appendChild(topLink);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addTopLinks);
    } else {
        addTopLinks();
    }
})();
