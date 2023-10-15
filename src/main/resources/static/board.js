document.addEventListener('DOMContentLoaded', () => {
    let draggedImage = null;

    // Listen to dragstart for the initial images
    document.querySelectorAll('.draggable-image').forEach(img => {
        img.addEventListener('dragstart', (e) => {
            draggedImage = e.target;
        });
    });

    // Listen to mouseup for overlay images that have been placed in hexagons
    document.addEventListener('mouseup', (e) => {
        if(e.target.classList.contains('overlay-image')) {
            draggedImage = e.target;
            e.target.parentNode.removeChild(e.target);
        }
    });

    document.querySelectorAll('.container div').forEach(hex => {
        hex.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        hex.addEventListener('drop', () => {
            if (draggedImage) {
                const newImage = document.createElement('img');
                newImage.src = draggedImage.src;
                newImage.classList.add('overlay-image');
                hex.appendChild(newImage);
            }
        });
    });
});
