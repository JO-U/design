const collection = document.getElementById('xpCollection');

let recipesData = [];
const columns = 5;
const cellWidth = 440;
const cellHeight = 380;
const offsetYPerRow = 30;
const totalRows = 6;
let itemsExp = [];
let offsetX = 0, offsetY = 0;

// Carica CSV
Papa.parse('recipe.csv', {
  download: true,
  header: true,
  complete: function(results) {
    recipesData = results.data;
    initExperience();
  }
});

function initExperience() {
  // Genera elementi
  for (let row = 0; row < totalRows; row++) {
    for (let col = 0; col < columns; col++) {
      const r = recipesData[(row * columns + col) % recipesData.length];
      const item = document.createElement('div');
      item.className = 'xp_recipes-collection_item';
      item.style.opacity = 0;
      item.style.transition = 'opacity 0.5s ease';

      // IMG con fade-in reale
      const img = document.createElement("img");
      img.src = r.img;
      img.alt = r.title;

      // <<< AGGIUNTO: fade-in solo quando il file è caricato
      img.onload = () => {
        item.style.opacity = 1;
      };
      // <<< FINE AGGIUNTA

      item.appendChild(img);

      const title = document.createElement("div");
      title.className = "title";
      title.textContent = r.title;
      item.appendChild(title);

      let x = col * cellWidth + (row % 2) * (cellWidth / 2);
      let y = row * (cellHeight - offsetYPerRow);

      item.dataset.baseX = x;
      item.dataset.baseY = y;
      item.dataset.index = (row * columns + col) % recipesData.length;
      item.style.transform = `translate(${x}px, ${y}px)`;

      collection.appendChild(item);
      itemsExp.push(item);

      item.addEventListener('click', () =>
        openRecipePanel(recipesData[item.dataset.index])
      );
    }
  }

  // Observer fade-in per elementi riciclati
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target.querySelector("img");

        // <<< AGGIUNTO: se l’immagine è già caricata → fade-in subito
        if (img.complete) {
          entry.target.style.opacity = 1;
        }
        // <<< FINE AGGIUNTA

        observer.unobserve(entry.target);
      }
    });
  }, { root: null, threshold: 0.1 });

  itemsExp.forEach(item => observer.observe(item));

  setupDrag(observer);
}

// Drag infinito
function setupDrag(observer) {
  let isDragging = false, startX = 0, startY = 0, hasMoved = false;

  collection.addEventListener('pointerdown', e => {
    startX = e.clientX;
    startY = e.clientY;
    isDragging = false;
    hasMoved = false;
  });

  collection.addEventListener('pointermove', e => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!isDragging && !hasMoved) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
        isDragging = true;
      } else if (Math.abs(dy) > 5) {
        hasMoved = true;
        return;
      }
    }

    if (!isDragging) return;
    e.preventDefault();

    offsetX += dx;
    offsetY += dy;

    const canvasW = columns * cellWidth;
    const canvasH = totalRows * cellHeight;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    itemsExp.forEach(item => {
      let x = parseFloat(item.dataset.baseX) + offsetX;
      let y = parseFloat(item.dataset.baseY) + offsetY;

      if (x + cellWidth < 0 || x > viewportW || y + cellHeight < 0 || y > viewportH) {
        while (x + cellWidth < 0) x += canvasW;
        while (x > canvasW) x -= canvasW;
        while (y + cellHeight < 0) y += canvasH;
        while (y > canvasH) y -= canvasH;

        item.style.transform = `translate(${x}px, ${y}px)`;
        item.style.opacity = 0;
        observer.observe(item);
      } else {
        item.style.transform = `translate(${x}px, ${y}px)`;
      }
    });

    startX = e.clientX;
    startY = e.clientY;
  });

  collection.addEventListener('pointerup', () => { isDragging = false; hasMoved = false; });
  collection.addEventListener('pointerleave', () => { isDragging = false; hasMoved = false; });
}

// Apertura pannello ricetta
function openRecipePanel(recipe) {
  const panel = document.getElementById('recipePanel');
  panel.classList.add('active');
  document.getElementById('recipeTitle').textContent = recipe.title;
  document.getElementById('recipeImg').src = recipe.img;
  document.getElementById('recipeDescription').textContent = recipe.description;

  const ul = document.getElementById('recipeIngredients');
  ul.innerHTML = '';
  recipe.ingredients.split(';').forEach(ing => {
    const li = document.createElement('li');
    li.textContent = ing;
    ul.appendChild(li);
  });

  document.getElementById('recipeInstructions').textContent = recipe.instructions;
}

// Chiudi pannello
document.getElementById('closePanel').addEventListener('click', () => {
  document.getElementById('recipePanel').classList.remove('active');
});
