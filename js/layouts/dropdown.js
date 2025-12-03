export function init(recipes) {
    loadCSS("css/list.css");
    loadCSS("css/dropdown.css");

    createTopDropdowns(recipes);
    renderList(recipes);
}

function loadCSS(file) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = file;
    document.head.appendChild(link);
}

function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/[&<>"']/g, function (m) {
        return ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[m];
    });
}

/* -------------------------
    DROPDOWNS + FILTRI
   ------------------------- */
function createTopDropdowns(recipes) {
    const gridContainer = document.getElementById("gridContainer");
    let topBar = document.getElementById("topFilterBar");
    if (!topBar) {
        topBar = document.createElement("div");
        topBar.id = "topFilterBar";
        topBar.className = "top-filter-bar";
        gridContainer.parentNode.insertBefore(topBar, gridContainer);
    }
    topBar.innerHTML = `
        <div class="filters-row">
            <div class="dropdown" id="dd-meal">
                <button class="dropdown-button">Portate <span class="caret">▾</span></button>
                <div class="dropdown-panel"></div>
            </div>
            <div class="dropdown" id="dd-difficulty">
                <button class="dropdown-button">Difficoltà <span class="caret">▾</span></button>
                <div class="dropdown-panel"></div>
            </div>
            <div class="dropdown" id="dd-time">
                <button class="dropdown-button">Tempo <span class="caret">▾</span></button>
                <div class="dropdown-panel"></div>
            </div>
            <div class="dropdown" id="dd-allergens">
                <button class="dropdown-button">Allergeni <span class="caret">▾</span></button>
                <div class="dropdown-panel"></div>
            </div>
            <div class="filters-actions">
                <button id="clearFiltersBtn" class="clear-btn">Reset</button>
            </div>
        </div>
    `;

    const mealSet = new Set();
    const difficultySet = new Set();
    const allergenSet = new Set();

    recipes.forEach(r => {
        const mt = (r.mealType || "Altro").toString().split(/\s*\/\s*/).map(s => s.trim()).filter(Boolean);
        mt.forEach(m => mealSet.add(m));
        if (r.difficulty) difficultySet.add(r.difficulty);
        (r.allergens || []).forEach(a => { if (a) allergenSet.add(a); });
    });

    const meals = Array.from(mealSet).sort((a,b)=>a.localeCompare(b));
    const difficulties = Array.from(difficultySet).sort((a,b)=>a.localeCompare(b));
    const allergens = Array.from(allergenSet).sort((a,b)=>a.localeCompare(b));

    const timeRanges = [
        { id: "t-15", label: "≤ 15 min", max: 15 },
        { id: "t-30", label: "≤ 30 min", max: 30 },
        { id: "t-45", label: "≤ 45 min", max: 45 },
        { id: "t-60", label: "≤ 60 min", max: 60 },
        { id: "t-90", label: "≤ 90 min", max: 90 },
        { id: "t-120", label: "≤ 120 min", max: 120 },
        { id: "t-all", label: "Tutti", max: Infinity }
    ];

    const active = {
        meals: new Set(),       
        difficulties: new Set(),
        timeMax: Infinity,      
        allergens: new Set()    
    };

    populateMealPanel(meals, document.querySelector("#dd-meal .dropdown-panel"), active);
    populateDifficultyPanel(difficulties, document.querySelector("#dd-difficulty .dropdown-panel"), active);
    populateTimePanel(timeRanges, document.querySelector("#dd-time .dropdown-panel"), active);
    populateAllergensPanel(allergens, document.querySelector("#dd-allergens .dropdown-panel"), active);

    document.querySelectorAll(".dropdown").forEach(dd => {
        const btn = dd.querySelector(".dropdown-button");
        const panel = dd.querySelector(".dropdown-panel");
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const open = panel.classList.contains("open");
            closeAllPanels();
            if (!open) panel.classList.add("open");
        });
    });

    document.addEventListener("click", () => {
        closeAllPanels();
    });

    const clearBtn = document.getElementById("clearFiltersBtn");
    clearBtn.addEventListener("click", () => {
        active.meals.clear();
        active.difficulties.clear();
        active.timeMax = Infinity;
        active.allergens.clear();
        document.querySelectorAll("#topFilterBar input[type=checkbox]").forEach(cb => cb.checked = false);
        document.querySelectorAll("#topFilterBar input[type=radio]").forEach(rb => rb.checked = false);
        const allTimeRadio = document.querySelector(`#dd-time input[data-max="Infinity"]`);
        if(allTimeRadio) allTimeRadio.checked = true;
        applyFiltersAndRender(recipes, active);
    });

    function closeAllPanels() {
        document.querySelectorAll(".dropdown-panel.open").forEach(p => p.classList.remove("open"));
    }
}

/* ----------  PANNELLI ---------- */

function populateMealPanel(meals, panelEl, active) {
    panelEl.innerHTML = "";
    // tutte option
    const allLabel = document.createElement("label");
    allLabel.className = "option-item";
    allLabel.innerHTML = `<input type="checkbox" data-type="meal" data-value="__all__"> <span>Tutte le portate</span>`;
    panelEl.appendChild(allLabel);

    meals.forEach(m => {
        const lab = document.createElement("label");
        lab.className = "option-item";
        lab.innerHTML = `<input type="checkbox" data-type="meal" data-value="${escapeHtml(m)}"> <span>${escapeHtml(m)}</span>`;
        const cb = lab.querySelector("input");
        cb.addEventListener("change", (e) => {
            if (cb.dataset.value === "__all__") {
                if (cb.checked) {
                    panelEl.querySelectorAll('input[data-type="meal"]').forEach(inp => {
                        if (inp !== cb) inp.checked = false;
                    });
                    active.meals.clear();
                }
            } else {
                const allCb = panelEl.querySelector('input[data-value="__all__"]');
                if (cb.checked) {
                    if (allCb) allCb.checked = false;
                    active.meals.add(cb.dataset.value.toLowerCase());
                } else {
                    active.meals.delete(cb.dataset.value.toLowerCase());
                }
            }
            applyFiltersFromActiveState();
        });
        panelEl.appendChild(lab);
    });
}

function populateDifficultyPanel(difficulties, panelEl, active) {
    panelEl.innerHTML = "";
    const allLabel = document.createElement("label");
    allLabel.className = "option-item";
    allLabel.innerHTML = `<input type="checkbox" data-type="difficulty" data-value="__all__"> <span>Tutte</span>`;
    panelEl.appendChild(allLabel);

    difficulties.forEach(d => {
        const lab = document.createElement("label");
        lab.className = "option-item";
        lab.innerHTML = `<input type="checkbox" data-type="difficulty" data-value="${escapeHtml(d)}"> <span>${escapeHtml(d)}</span>`;
        const cb = lab.querySelector("input");
        cb.addEventListener("change", () => {
            if (cb.dataset.value === "__all__") {
                if (cb.checked) {
                    panelEl.querySelectorAll('input[data-type="difficulty"]').forEach(inp => {
                        if (inp !== cb) inp.checked = false;
                    });
                    active.difficulties.clear();
                }
            } else {
                const allCb = panelEl.querySelector('input[data-value="__all__"]');
                if (cb.checked) {
                    if (allCb) allCb.checked = false;
                    active.difficulties.add(cb.dataset.value.toLowerCase());
                } else {
                    active.difficulties.delete(cb.dataset.value.toLowerCase());
                }
            }
            applyFiltersFromActiveState();
        });
        panelEl.appendChild(lab);
    });
}

function populateTimePanel(timeRanges, panelEl, active) {
    panelEl.innerHTML = "";
    timeRanges.forEach(tr => {
        const lab = document.createElement("label");
        lab.className = "option-item";
        const maxAttr = (tr.max === Infinity) ? "Infinity" : tr.max;
        lab.innerHTML = `<input type="radio" name="timeRange" data-type="time" data-max="${maxAttr}"> <span>${escapeHtml(tr.label)}</span>`;
        const rb = lab.querySelector("input");
        rb.addEventListener("change", () => {
            if (rb.checked) {
                active.timeMax = (tr.max === Infinity) ? Infinity : tr.max;
            }
            applyFiltersFromActiveState();
        });
        if (tr.max === Infinity) {
            rb.checked = true;
            active.timeMax = Infinity;
        }
        panelEl.appendChild(lab);
    });
}

function populateAllergensPanel(allergens, panelEl, active) {
    panelEl.innerHTML = "";
    const noneLabel = document.createElement("label");
    noneLabel.className = "option-item";
    noneLabel.innerHTML = `<input type="checkbox" data-type="allergen" data-value="__none__"> <span>Nessuno</span>`;
    noneLabel.querySelector("input").addEventListener("change", (e) => {
        const cb = e.target;
        if (cb.checked) {
            panelEl.querySelectorAll('input[data-type="allergen"]').forEach(inp => {
                if (inp !== cb) inp.checked = false;
            });
            active.allergens.clear();
            active.allergens.add("__none__");
        } else {
            active.allergens.delete("__none__");
        }
        applyFiltersFromActiveState();
    });
    panelEl.appendChild(noneLabel);

    allergens.forEach(a => {
        const lab = document.createElement("label");
        lab.className = "option-item";
        lab.innerHTML = `<input type="checkbox" data-type="allergen" data-value="${escapeHtml(a)}"> <span>${escapeHtml(a)}</span>`;
        const cb = lab.querySelector("input");
        cb.addEventListener("change", () => {
            const noneCb = panelEl.querySelector('input[data-value="__none__"]');
            if (cb.checked) {
                if (noneCb) noneCb.checked = false;
                active.allergens.add(cb.dataset.value.toLowerCase());
            } else {
                active.allergens.delete(cb.dataset.value.toLowerCase());
            }
            applyFiltersFromActiveState();
        });
        panelEl.appendChild(lab);
    });
}

/* ---------- APPLICA FILTRI ---------- */

function applyFiltersFromActiveState() {
    const gridContainer = document.getElementById("gridContainer");
    const allRecipes = window.allRecipes || []; 
    if (!allRecipes || allRecipes.length === 0) {
        return;
    }

    const mealInputs = document.querySelectorAll('#topFilterBar input[data-type="meal"]');
    const selectedMeals = [];
    mealInputs.forEach(inp => {
        const v = inp.dataset.value;
        if (v === "__all__") return;
        if (inp.checked) selectedMeals.push(v.toLowerCase());
    });

    const diffInputs = document.querySelectorAll('#topFilterBar input[data-type="difficulty"]');
    const selectedDiffs = [];
    diffInputs.forEach(inp => {
        const v = inp.dataset.value;
        if (v === "__all__") return;
        if (inp.checked) selectedDiffs.push(v.toLowerCase());
    });

    const timeRadio = document.querySelector('#topFilterBar input[data-type="time"]:checked');
    const timeMax = timeRadio ? (timeRadio.dataset.max === "Infinity" ? Infinity : parseInt(timeRadio.dataset.max, 10)) : Infinity;

    const allergenInputs = document.querySelectorAll('#topFilterBar input[data-type="allergen"]');
    const selectedAllergens = [];
    let noneSelected = false;
    allergenInputs.forEach(inp => {
        if (inp.dataset.value === "__none__" && inp.checked) noneSelected = true;
        else if (inp.checked) selectedAllergens.push(inp.dataset.value.toLowerCase());
    });

    const filtered = allRecipes.filter(r => {
        // time
        const t = parseTimeToMinutes(r.time);
        if (!isNaN(t) && t > timeMax) return false;

        // meal: support composizioni "Primo / Zuppa"
        if (selectedMeals.length > 0) {
            const recipeMeals = (r.mealType || "").toString().split(/\s*\/\s*/).map(s => s.trim().toLowerCase());
            const matchesMeal = selectedMeals.some(sm => recipeMeals.includes(sm));
            if (!matchesMeal) return false;
        }

        // difficulty
        if (selectedDiffs.length > 0) {
            const rd = (r.difficulty || "").toLowerCase();
            if (!selectedDiffs.includes(rd)) return false;
        }

        // allergens
        const rAll = (r.allergens || []).map(x => x.toLowerCase());
        if (noneSelected) {
            if (rAll.length > 0) return false; // vogliamo solo ricette senza allergeni
        } else if (selectedAllergens.length > 0) {
            // filter out recipes that contain any of the selected allergens
            if (selectedAllergens.some(a => rAll.includes(a))) return false;
        }

        return true;
    });

    renderList(filtered);
}

/* ---------- HELPERS ---------- */

function parseTimeToMinutes(timeStr) {
    if (!timeStr) return NaN;
    const s = timeStr.toLowerCase().trim();
    let minutes = 0;
    const hMatch = s.match(/(\d+)\s*h/);
    if (hMatch) minutes += parseInt(hMatch[1], 10) * 60;
    const mMatch = s.match(/(\d+)\s*m/);
    if (mMatch) minutes += parseInt(mMatch[1], 10);
    if (!hMatch && !mMatch) {
        const n = parseInt(s, 10);
        if (!isNaN(n)) minutes = n;
    }
    return isNaN(minutes) ? NaN : minutes;
}

/* -------------------------
   RENDER LIST (invariato)
   ------------------------- */
function renderList(data) {
    const gridContainer = document.getElementById("gridContainer");
    gridContainer.innerHTML = "";
    gridContainer.className = "list-layout";

    // salva globalmente le ricette per i filtri
    window.allRecipes = data && Array.isArray(data) ? (window.allRecipes || []).concat([]) : (window.allRecipes || []);

    if (!data || data.length === 0) {
        gridContainer.innerHTML = `<div class="no-results">Nessuna ricetta trovata.</div>`;
        return;
    }

    data.forEach(recipe => {

        const difficultyColor =
            recipe.difficulty === "Facile" ? "#37B35C" :
            recipe.difficulty === "Media" ? "#FFD93D" :
            recipe.difficulty === "Difficile" ? "#D16643" :
            "#a8a6a6ff";

        // prefer grid image, fallback to list or generic img
        const imgSrc = recipe.imgGrid || recipe.imgList || recipe.img || "";

        const item = document.createElement("article");
        item.className = "list-item";

        item.innerHTML = `
<div class="list-img-wrap">
    <img src="${imgSrc}" alt="${escapeHtml(recipe.title)}">
</div>

<div class="list-content">
    <div class="title-row">
        <h3>${escapeHtml(recipe.title)}</h3>
        <div class="time-box">
            <div class="info-box">${escapeHtml(recipe.time || "N/A")}</div>
            <div class="info-box"><i class="fa fa-clock-o"></i></div>
        </div>
    </div>

    <div class="meta-row">
        <div class="difficulty-wrapper">
            <span class="difficulty-text"><strong>Difficoltà:</strong> ${escapeHtml(recipe.difficulty || "N/A")}</span>
            <div class="difficulty-bar-list" style="background:${difficultyColor};"></div>
        </div>
        <div class="allergens"><strong>Allergeni:</strong> ${escapeHtml((recipe.allergens || []).join(", ") || "Nessuno")}</div>
    </div>

    <div class="bottom-row">
        <p class="description">${escapeHtml(recipe.description || "")}</p>
        <div class="arrow">➜</div>
    </div>
</div>
`;

        // arrow and item click handlers
        const arrowEl = item.querySelector('.arrow');
        if (arrowEl) arrowEl.addEventListener('click', (e) => { e.stopPropagation(); openRecipe(recipe); });
        item.addEventListener('click', () => openRecipe(recipe));

        gridContainer.appendChild(item);
    });
}

function openRecipe(recipe) {
    const slug = recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    window.location.href = `recipe.html?id=${slug}`;
}
