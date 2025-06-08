const columns = document.querySelectorAll('.columns');
columns.forEach(parent => {
    if (parent.children.length > 2) {
        parent.classList.add('three-columns');
    }
})
