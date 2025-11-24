let collection = document.getElementById('xpCollection');
let itemsExp = [];
let offsetX = 0, offsetY = 0;
let panelOpen = false;
const columns = 5, cellWidth = 440, cellHeight = 380, offsetYPerRow = 30, totalRows = 6;
let dragging = false;

function initExperience(data) {
    collection.innerHTML = '';
    itemsExp = [];

    for (let row = 0; row < totalRows; row++) {
        for (let col = 0; col < columns; col++) {
            const r = data[(row * columns + col) % data.length];
            const item = document.createElement('div');
            item.className = 'xp_recipes-collection_item';
            item.style.opacity = 0;
            item.style.transition = 'opacity 0.5s ease';

            const img = document.createElement('img');
            img.src = r.img;
            img.alt = r.title;
            item.appendChild(img);

            const title = document.createElement('div');
            title.className = 'title';
            title.textContent = r.title;
            item.appendChild(title);

            let x = col * cellWidth + (row % 2) * (cellWidth / 2);
            let y = row * (cellHeight - offsetYPerRow);
            item.dataset.baseX = x;
            item.dataset.baseY = y;
            item.dataset.index = (row * columns + col) % data.length;
            item.style.transform = `translate(${x}px, ${y}px)`;

            collection.appendChild(item);
            itemsExp.push(item);

            item.addEventListener('click', e => {
                if (!dragging) openRecipePanel(data[item.dataset.index]);
            });
        }
    }

    setupDrag();
    setupFadeIn();
}

// Drag infinito
function setupDrag() {
    let isDragging = false, startX = 0, startY = 0, lastX = 0, lastY = 0;
    const dragSpeed = 0.3;

    collection.addEventListener('pointerdown', e => {
        if (panelOpen) return;
        startX = e.clientX; startY = e.clientY; lastX = startX; lastY = startY;
        isDragging = false;
        collection.setPointerCapture(e.pointerId);
    });

    collection.addEventListener('pointermove', e => {
        if (panelOpen) return;
        const dx = (e.clientX - lastX) * dragSpeed;
        const dy = (e.clientY - lastY) * dragSpeed;

        if (!isDragging) {
            const dist = Math.sqrt((e.clientX - startX)**2 + (e.clientY - startY)**2);
            if (dist > 5) isDragging = true;
        }
        dragging = isDragging;
        if (!isDragging) return;

        e.preventDefault();
        offsetX += dx; offsetY += dy;

        itemsExp.forEach(item => {
            const x = parseFloat(item.dataset.baseX) + offsetX;
            const y = parseFloat(item.dataset.baseY) + offsetY;
            item.style.transform = `translate(${x}px, ${y}px)`;
        });

        lastX = e.clientX; lastY = e.clientY;
    });

    function endDrag(e) { dragging = false; isDragging = false; collection.releasePointerCapture(e.pointerId); }
    collection.addEventListener('pointerup', endDrag);
    collection.addEventListener('pointerleave', endDrag);
    collection.addEventListener('pointercancel', endDrag);
}

// Fade-in dolce
function setupFadeIn() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => { entry.target.style.opacity = 1; }, Math.random() * 500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    itemsExp.forEach(item => { item.style.opacity = 0; observer.observe(item); });
}

// Pannello ricetta
function openRecipePanel(recipe) {
    panelOpen = true;
    document.getElementById('xpOverlay').classList.add('active');
    const panel = document.getElementById('recipePanel');
    panel.classList.add('active');
    document.getElementById('recipeTitle').textContent = recipe.title;
    document.getElementById('recipeImg').src = recipe.img;
    document.getElementById('recipeDescription').textContent = recipe.description;

    const ul = document.getElementById('recipeIngredients'); ul.innerHTML = '';
    recipe.ingredients.split(';').forEach(ing => { const li = document.createElement('li'); li.textContent = ing; ul.appendChild(li); });
    document.getElementById('recipeInstructions').textContent = recipe.instructions;
}

document.getElementById('closePanel').addEventListener('click', () => {
    panelOpen = false;
    document.getElementById('recipePanel').classList.remove('active');
    document.getElementById('xpOverlay').classList.remove('active');
});
