export function init(recipes) {
    loadCSS("css/grid.css"); 
    loadCSS("css/grid_menu.css"); 
    const container = document.getElementById("gridContainer");
    container.innerHTML = "";

    // grid menu
    let mealMenuContainer = document.getElementById("mealMenu");
    if (!mealMenuContainer) {
        mealMenuContainer = document.createElement("div");
        mealMenuContainer.id = "mealMenu";
        mealMenuContainer.className = "meal-menu-grid";
        container.parentNode.insertBefore(mealMenuContainer, container);
    }
    mealMenuContainer.innerHTML = "";

    // raggruppa ricette 
    const groups = {};
    recipes.forEach(r => {
        const type = r.mealType || "Altro";
        if (!groups[type]) groups[type] = [];
        groups[type].push(r);
    });

    // crea pulsante 
    Object.entries(groups).forEach(([meal, items]) => {
        const btn = document.createElement("button");
        btn.className = "meal-menu-item";
        btn.textContent = meal;

        btn.addEventListener("click", () => {
            populateGrid(items);
            document.querySelectorAll(".meal-menu-item").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });

        mealMenuContainer.appendChild(btn);
    });

    populateGrid(recipes);
}

// --- POPOLA GRIGLIA ---
function populateGrid(data) {
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = '';
    gridContainer.className = "grid-layout"; // griglia

    data.forEach(recipe => {
        const div = document.createElement('div');
        div.className = 'food-item';

        const difficultyColor =
            recipe.difficulty === "Facile" ? "#37B35C" :
            recipe.difficulty === "Media" ? "#FFD93D" :
            recipe.difficulty === "Difficile" ? "#D16643":
            "#a8a6a6ff";

        const imgSrc = recipe.imgGrid || recipe.imgList || recipe.img || "";

        div.innerHTML = `
            <div class="difficulty-bar" style="background:${difficultyColor}"></div>
            <div class="top-right-info">
                <div class="info-box">${recipe.time || "N/A"}</div>
                <div class="info-box"><i class="fa fa-clock-o" style="color:#FFF8EF"></i></div>
            </div>
            <img src="${imgSrc}" alt="${recipe.title}">
            <div class="bottom-row">
                <h3>${recipe.title}</h3>
                <div class="arrow">➜</div>
            </div>
        `;

        div.querySelector(".arrow").addEventListener("click", () => openRecipe(recipe));
        div.addEventListener("click", () => openRecipe(recipe));

        gridContainer.appendChild(div);
    });
}

// --- APRI RICETTA ---
function openRecipe(recipe) {
    const slug = recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    window.location.href = `recipe.html?id=${slug}`;
}

// --- CARICA CSS ---
function loadCSS(path) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = path;
    document.head.appendChild(link);
}
