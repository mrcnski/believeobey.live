const columns = document.querySelectorAll('.columns');
columns.forEach(parent => {
    if (parent.children.length >= 3) {
        parent.classList.add('three-columns');
    }
    if (parent.children.length >= 4) {
        parent.classList.add('four-columns');
    }
})

// Prevent orphan words.
// This replaces the space before the last word with a non-breaking space.
document.querySelectorAll('i').forEach(p => {
    p.innerHTML = p.innerHTML.replace(/\s+([^\s<]+)\s*$/, '&nbsp;$1');
});
