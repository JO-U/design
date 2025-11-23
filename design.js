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
let isDragging = false, startX = 0, startY = 0, lastX = 0, lastY = 0;

collection.addEventListener('pointerdown', e => {
// Blocca drag se il pannello è aperto
if (panelOpen) return;

```
startX = e.clientX;
startY = e.clientY;
lastX = startX;
lastY = startY;
isDragging = false;

collection.setPointerCapture(e.pointerId);
```

});

collection.addEventListener('pointermove', e => {
if (panelOpen) return; // nessun drag se pannello aperto


const dx = e.clientX - lastX;
const dy = e.clientY - lastY;

// Attiva drag solo se spostamento sufficiente (>5px)
if (!isDragging) {
  const totalDist = Math.sqrt((e.clientX - startX)**2 + (e.clientY - startY)**2);
  if (totalDist > 5) isDragging = true;
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

  // Riciclo infinito
  if (x + cellWidth < 0) x += canvasW;
  if (x > canvasW) x -= canvasW;
  if (y + cellHeight < 0) y += canvasH;
  if (y > canvasH) y -= canvasH;

  item.style.transform = `translate(${x}px, ${y}px)`;
  
  // Reset opacity per elementi riciclati
  if (x < 0 || x > viewportW || y < 0 || y > viewportH) {
    item.style.opacity = 0;
    observer.observe(item);
  }
});

lastX = e.clientX;
lastY = e.clientY;


});

function endDrag(e) {
isDragging = false;
collection.releasePointerCapture(e.pointerId);
}

collection.addEventListener('pointerup', endDrag);
collection.addEventListener('pointerleave', endDrag);
collection.addEventListener('pointercancel', endDrag);
}

let panelOpen = false; // variabile globale

// Apertura pannello ricetta
function openRecipePanel(recipe) {
panelOpen = true; // blocca drag

document.getElementById('xpOverlay').classList.add('active');

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
panelOpen = false; // riabilita drag
document.getElementById('recipePanel').classList.remove('active');
document.getElementById('xpOverlay').classList.remove('active');
});

const toggleExplore = document.getElementById('toggleExplore');
const toggleGrid = document.getElementById('toggleGrid');
const experienceView = document.getElementById('experienceView');
const gridView = document.getElementById('gridView');
const gridContainer = document.getElementById('gridContainer');

//TOGGLE
// Toggle View
toggleExplore.addEventListener('click', () => {
toggleExplore.classList.add('active');
toggleGrid.classList.remove('active');
experienceView.classList.add('active');
gridView.classList.remove('active');
});

toggleGrid.addEventListener('click', () => {
toggleGrid.classList.add('active');
toggleExplore.classList.remove('active');
gridView.classList.add('active');
experienceView.classList.remove('active');
});

// Popola Grid
function populateGrid(recipes) {
gridContainer.innerHTML = ''; // pulisce prima
recipes.forEach(recipe => {
const div = document.createElement('div');
div.className = 'grid-item';
div.innerHTML = `    <span class="time">⏱ ${recipe.time || 'N/A'}</span>       <img src="${recipe.img}" alt="${recipe.title}">       <h3>${recipe.title}</h3>       <div class="info">              <span class="allergens">${recipe.allergens || ''}</span>       </div>
    `;
div.addEventListener('click', () => openRecipePanel(recipe));
gridContainer.appendChild(div);
});
}

// Dopo aver caricato CSV
Papa.parse('recipe.csv', {
download: true,
header: true,
complete: function(results) {
recipesData = results.data;
initExperience();
populateGrid(recipesData);
}
});

// FILTRI 
const showFiltersBtn = document.getElementById("showFiltersBtn");
const closeFiltersBtn = document.getElementById("closeFiltersBtn");
const filterBar = document.getElementById("filterBar");
const selectedFiltersDiv = document.getElementById("selectedFilters");
const resetFiltersBtn = document.getElementById("resetFilters");

const activeFilters = { meal: [], time: [], allergens: [] };


// -------------------------
// MOSTRA FILTRI
// -------------------------
showFiltersBtn.addEventListener("click", e => {
  e.stopPropagation();
  filterBar.style.display = "flex";
  showFiltersBtn.style.display = "none";
  closeFiltersBtn.style.display = "inline-flex";
});


// -------------------------
// CHIUDI FILTRI
// -------------------------
closeFiltersBtn.addEventListener("click", e => {
  e.stopPropagation();
  filterBar.style.display = "none";
  closeAllCategories();
  showFiltersBtn.style.display = "inline-flex";
  closeFiltersBtn.style.display = "none";
});


// -------------------------
// CLICK FUORI → CHIUDI TUTTO
// -------------------------
document.addEventListener("click", e => {
  if (!filterBar.contains(e.target) && e.target !== showFiltersBtn) {
    filterBar.style.display = "none";
    closeAllCategories();
    showFiltersBtn.style.display = "inline-flex";
    closeFiltersBtn.style.display = "none";
  }
});


// -------------------------
// FUNZIONE: chiudi tutte le categorie
// -------------------------
function closeAllCategories() {
  document.querySelectorAll(".filter-category").forEach(c => c.classList.remove("expanded"));
}


// -------------------------
// TOGGLE DELLE CATEGORIE
// -------------------------
document.querySelectorAll(".filter-category").forEach(category => {

  const cat = category.dataset.cat;
  const options = category.querySelectorAll(".filter-option");

  // apri/chiudi categoria
  category.addEventListener("click", e => {
    e.stopPropagation();

    // chiudi tutte le altre
    document.querySelectorAll(".filter-category").forEach(c => {
      if (c !== category) c.classList.remove("expanded");
    });

    // toggle questa
    category.classList.toggle("expanded");
  });

  // selezione opzioni
  options.forEach(opt => {
    opt.addEventListener("click", e => {
      e.stopPropagation();

      const val = opt.textContent.trim();

      if (!activeFilters[cat].includes(val)) {
        activeFilters[cat].push(val);
      }

      updateSelectedFilters();
    });
  });
});


// -------------------------
// AGGIORNA FILTRI SELEZIONATI
// -------------------------
function updateSelectedFilters() {
  selectedFiltersDiv.innerHTML = "";
  let hasFilters = false;

  for (const cat in activeFilters) {
    activeFilters[cat].forEach(choice => {
      hasFilters = true;

      const tag = document.createElement("div");
      tag.classList.add("selected-filter");
      tag.textContent = choice;

      tag.addEventListener("click", () => {
        activeFilters[cat] = activeFilters[cat].filter(c => c !== choice);
        updateSelectedFilters();
      });

      selectedFiltersDiv.appendChild(tag);
    });
  }

  resetFiltersBtn.style.display = hasFilters ? "inline-flex" : "none";
}


// -------------------------
// RESET FILTRI
// -------------------------
resetFiltersBtn.addEventListener("click", () => {
  for (const cat in activeFilters) activeFilters[cat] = [];
  updateSelectedFilters();
});
