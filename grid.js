// Legge il parametro layout dalla query string
const urlParams = new URLSearchParams(window.location.search);
let layoutVersion = urlParams.get("layout") || "grid"; // default "grid"

const gridContainer = document.getElementById('gridContainer');
const showFiltersBtn = document.getElementById("showFiltersBtn");
const closeFiltersBtn = document.getElementById("closeFiltersBtn");
const filterBar = document.getElementById("filterBar");
const selectedFiltersDiv = document.getElementById("selectedFilters");
const resetFiltersBtn = document.getElementById("resetFilters");

const activeFilters = { meal: [], time: [], allergens: [] };

function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function openRecipePage(recipe) {
    const slug = generateSlug(recipe.title);
    window.location.href = `recipe.html?id=${slug}`;
}

fetch('recipes.json')
    .then(res => res.json())
    .then(data => {
        const recipesArray = Object.values(data).flat();
        window.allRecipes = recipesArray;

        populateGrid(recipesArray);
    })
    .catch(err => console.error("Errore nel caricamento di recipes.json:", err));

// generariamo la griglia
function populateGrid(data) {
    gridContainer.innerHTML = '';

    // Applica classe al contenitore
    gridContainer.classList.remove("grid-layout", "list-layout");
    if(layoutVersion === "list"){
        gridContainer.classList.add("list-layout");
    } else {
        gridContainer.classList.add("grid-layout");
    }

    data.forEach(recipe => {
        const div = document.createElement('div');
        div.className = 'food-item';
        
        const difficultyColor =
            recipe.difficulty === "Easy" ? "#37B35C" :
            recipe.difficulty === "Medium" ? "#FFD93D" :
            recipe.difficulty === "Hard" ? "#D16643":
            "#a8a6a6ff";

        const imgSrc = layoutVersion === "list" 
            ? recipe.imgList 
            : recipe.imgGrid;


        if(layoutVersion === "grid"){
            div.innerHTML = `
                <div class="difficulty-bar" style="background:${difficultyColor}"></div>
                <div class="top-right-info">
                    <div class="info-box">${recipe.time || "N/A"}</div>
                    <div class="info-box">⏱</div>
                </div>
                <img src="${imgSrc}" alt="${recipe.title}">
                <div class="bottom-row">
                    <h3>${recipe.title}</h3>
                    <div class="arrow">➜</div>
                </div>
            `;
        } else { // versione lista
            div.innerHTML = `
                
                <img src="${imgSrc}" alt="${recipe.title}">
                <div class="infoList">
                    <div class="list-right">
                        <h3>${recipe.title}</h3>
                        <div>
                            <div class="difficulty-wrapper">
                                <span class="difficulty-text">
                                    <strong>Difficoltà:</strong> ${recipe.difficulty}
                                </span>
                                <div class="difficulty-bar-list" style="background:${difficultyColor};"></div>
                            </div>

                            <p><strong>Allergeni:</strong> ${recipe.allergens?.join(", ") || "Nessuno"}</p>
                            <div class="top-right-info">
                                <div class="info-box">${recipe.time || "N/A"}</div>
                                <div class="info-box">⏱</div>
                            </div>
                        </div>
                        <p class="description">${recipe.description}</p>
                        <div class="arrow">➜</div>
                    </div>
                </div>
            `;
        }

        div.querySelector(".arrow").addEventListener("click", () => openRecipePage(recipe));
        div.addEventListener("click", () => openRecipePage(recipe));

        gridContainer.appendChild(div);
    });

    setupFilters();
}



//fltri
function setupFilters() {
    showFiltersBtn.onclick = () => {
        filterBar.style.display = "flex";
        showFiltersBtn.style.display = "none";
        closeFiltersBtn.style.display = "inline-flex";
    };
    closeFiltersBtn.onclick = () => {
        filterBar.style.display = "none";
        showFiltersBtn.style.display = "inline-flex";
        closeFiltersBtn.style.display = "none";
    };

    document.querySelectorAll(".filter-category").forEach(category => {
        const cat = category.dataset.cat;
        const options = category.querySelectorAll(".filter-option");

        category.onclick = e => { 
            e.stopPropagation();
            document.querySelectorAll(".filter-category").forEach(c => { if(c!==category)c.classList.remove("expanded"); });
            category.classList.toggle("expanded");
        };

        options.forEach(opt => {
            opt.onclick = e => {
                e.stopPropagation();
                const val = opt.textContent.trim();
                if(!activeFilters[cat].includes(val)) activeFilters[cat].push(val);
                updateSelectedFilters();
            };
        });
    });

    resetFiltersBtn.onclick = () => { 
        for(let cat in activeFilters) activeFilters[cat] = [];
        updateSelectedFilters();
    };

    document.addEventListener("click", e => {
        if(!filterBar.contains(e.target) && e.target !== showFiltersBtn) {
            filterBar.style.display = "none";
            document.querySelectorAll(".filter-category").forEach(c => c.classList.remove("expanded"));
            showFiltersBtn.style.display = "inline-flex"; 
            closeFiltersBtn.style.display = "none";
        }
    });
}

//filtri selezionati
function updateSelectedFilters() {
    selectedFiltersDiv.innerHTML = "";
    let hasFilters = false;
    for(const cat in activeFilters){
        activeFilters[cat].forEach(choice => {
            hasFilters = true;
            const tag = document.createElement("div");
            tag.classList.add("selected-filter");
            tag.textContent = choice;
            tag.onclick = () => { 
                activeFilters[cat] = activeFilters[cat].filter(c => c !== choice);
                updateSelectedFilters();
            };
            selectedFiltersDiv.appendChild(tag);
        });
    }
    resetFiltersBtn.style.display = hasFilters ? "inline-flex" : "none";
}
