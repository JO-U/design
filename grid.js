const gridContainer = document.getElementById('gridContainer');
const showFiltersBtn = document.getElementById("showFiltersBtn");
const closeFiltersBtn = document.getElementById("closeFiltersBtn");
const filterBar = document.getElementById("filterBar");
const selectedFiltersDiv = document.getElementById("selectedFilters");
const resetFiltersBtn = document.getElementById("resetFilters");

const activeFilters = { meal: [], time: [], allergens: [] };

function populateGrid(data) {
    gridContainer.innerHTML = '';
    data.forEach(recipe => {
        const div = document.createElement('div');
        div.className = 'grid-item';
        div.innerHTML = `
            <span class="time">⏱ ${recipe.time || 'N/A'}</span>
            <img src="${recipe.img}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
        `;
        div.addEventListener('click', () => openRecipePanel(recipe));
        gridContainer.appendChild(div);
    });

    setupFilters();
}

function setupFilters() {
    // Mostra/chiudi filtro
    showFiltersBtn.onclick = () => { filterBar.style.display = "flex"; showFiltersBtn.style.display = "none"; closeFiltersBtn.style.display = "inline-flex"; };
    closeFiltersBtn.onclick = () => { filterBar.style.display = "none"; showFiltersBtn.style.display = "inline-flex"; closeFiltersBtn.style.display = "none"; };

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

    resetFiltersBtn.onclick = () => { for(let cat in activeFilters) activeFilters[cat]=[]; updateSelectedFilters(); };

    document.addEventListener("click", e => {
        if(!filterBar.contains(e.target) && e.target !== showFiltersBtn) {
            filterBar.style.display = "none";
            document.querySelectorAll(".filter-category").forEach(c => c.classList.remove("expanded"));
            showFiltersBtn.style.display = "inline-flex"; closeFiltersBtn.style.display = "none";
        }
    });
}

function updateSelectedFilters() {
    selectedFiltersDiv.innerHTML = "";
    let hasFilters = false;
    for(const cat in activeFilters){
        activeFilters[cat].forEach(choice => {
            hasFilters = true;
            const tag = document.createElement("div");
            tag.classList.add("selected-filter");
            tag.textContent = choice;
            tag.onclick = () => { activeFilters[cat] = activeFilters[cat].filter(c=>c!==choice); updateSelectedFilters(); };
            selectedFiltersDiv.appendChild(tag);
        });
    }
    resetFiltersBtn.style.display = hasFilters ? "inline-flex" : "none";
}
