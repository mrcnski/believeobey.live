const columns = document.querySelectorAll('.columns');
columns.forEach(elem => {
    elem.dataset.columns = elem.children.length;
})

// Prevent orphan words.
// This replaces the space before the last word with a non-breaking space.
document.querySelectorAll('i').forEach(p => {
    p.innerHTML = p.innerHTML.replace(/\s+([^\s<]+)\s*$/, '&nbsp;$1');
});
