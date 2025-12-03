
export function init(recipes) {
    loadCSS("css/sidebar.css");
    loadCSS("css/list.css");
    loadCSS("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css");

    if (!document.getElementById('sidebar-filter-rect-styles')) {
        const css = document.createElement('style');
        css.id = 'sidebar-filter-rect-styles';
        css.textContent = `
            .filter-group { padding:10px;  margin:5%;
            border-bottom:1px solid #ccc; }
            .filter-header { display:flex; gap:8px; align-items:center; padding-bottom:3% }
            .filter-options {padding-bottom:8px }
            .sub-options { display:none; padding-left:10px; margin-top:6px }
            .sub-options.open { display:block }
            .filter-label { display:flex; align-items:center; gap:8px; cursor:pointer; padding:6px }
            .filter-label.main-option { font-weight:600 }
             .sidebar-slider { padding-top:10px; }
        .slider-wrap { display:flex; align-items:center; gap:6px; position:relative; }
        .slider-wrap input[type="range"] { flex:1; -webkit-appearance:none; width:100%; height:6px; background:#ddd; border-radius:3px; outline:none; }
        .slider-wrap input[type="range"]::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; background:#333; border-radius:50%; cursor:pointer; border:2px solid #666; margin-top:-5px; }
        .slider-wrap input[type="range"]::-moz-range-thumb { width:16px; height:16px; background:#333; border-radius:50%; cursor:pointer; border:2px solid #666; }
        .slider-ticks { display:flex; justify-content:space-between; margin-top:4px; font-size:0.75rem; color:#333; }
        .slider-tick { position: relative; flex:1; height:6px; }
        .slider-tick::before { content:''; position:absolute; left:50%; transform:translateX(-50%); top:0; width:2px; height:6px; background:#333; }
        `;
        document.head.appendChild(css);
    }

    const container = document.getElementById("gridContainer");
    container.className = "sidebar-wrapper";
    container.innerHTML = "";

    container.innerHTML = `
    <div class="full-wrapper">
        <nav class="sidebar" id="sidebar">
            <button class="toggle-btn" id="toggleSidebarBtn" aria-label="Toggle sidebar">
                <i class="fa fa-chevron-left"></i>
            </button>

            <div class="sidebar-top p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
	            <path fill="#333" d="M4.67 2c-.624 0-1.175.438-1.29 1.068C3.232 3.886 3 5.342 3 6.5c0 1.231.636 2.313 1.595 2.936c.271.177.405.405.405.6v.41q0 .027-.003.054c-.027.26-.151 1.429-.268 2.631C4.614 14.316 4.5 15.581 4.5 16a2 2 0 1 0 4 0c0-.42-.114-1.684-.229-2.869a302 302 0 0 0-.268-2.63L8 10.446v-.41c0-.196.134-.424.405-.6A3.5 3.5 0 0 0 10 6.5c0-1.158-.232-2.614-.38-3.432A1.305 1.305 0 0 0 8.33 2c-.34 0-.65.127-.884.336A1.5 1.5 0 0 0 6.5 2c-.359 0-.688.126-.946.336A1.32 1.32 0 0 0 4.671 2M6 3.5a.5.5 0 0 1 1 0v3a.5.5 0 0 0 1 0V3.33A.33.33 0 0 1 8.33 3c.157 0 .28.108.306.247C8.783 4.06 9 5.439 9 6.5a2.5 2.5 0 0 1-1.14 2.098c-.439.285-.86.786-.86 1.438v.41q0 .08.008.16c.028.258.151 1.424.268 2.622c.118 1.215.224 2.415.224 2.772a1 1 0 1 1-2 0c0-.357.106-1.557.224-2.772c.117-1.198.24-2.364.268-2.622q.008-.08.008-.16v-.41c0-.652-.421-1.153-.86-1.438A2.5 2.5 0 0 1 4 6.5c0-1.06.217-2.44.364-3.253A.305.305 0 0 1 4.671 3A.33.33 0 0 1 5 3.33V6.5a.5.5 0 0 0 1 0zm5 3A4.5 4.5 0 0 1 15.5 2a.5.5 0 0 1 .5.5v6.978l.02.224a626 626 0 0 1 .228 2.696c.124 1.507.252 3.161.252 3.602a2 2 0 1 1-4 0c0-.44.128-2.095.252-3.602c.062-.761.125-1.497.172-2.042l.03-.356H12.5A1.5 1.5 0 0 1 11 8.5zm2.998 3.044l-.021.245l-.057.653c-.047.544-.11 1.278-.172 2.038c-.126 1.537-.248 3.132-.248 3.52a1 1 0 1 0 2 0c0-.388-.122-1.983-.248-3.52a565 565 0 0 0-.229-2.691l-.021-.244v-.001L15 9.5V3.035A3.5 3.5 0 0 0 12 6.5v2a.5.5 0 0 0 .5.5h1a.5.5 0 0 1 .498.544" />
                </svg>
            
            </div>
            <div class="rectangle"></div>
            <div class="filters-container" id="filtersContainer"></div>

            <div class="sidebar-slider p-3">
                <div class="slider-label">
                    <span class="hide-on-collapse">Tempo (min)</span>
                </div>
                <div class="slider-wrap">
                    <i class="fa fa-turtle"></i>
                    <input id="timeRange" type="range" min="5" max="180" step="5" value="180" />
                    <i class="fa fa-bolt" title="veloce"></i>
                </div>
                <div class="slider-value"><span id="timeValue">180</span> <small>min</small></div>
            </div>

            <div class="sidebar-bottom p-3">
                <button id="resetAllBtn" class="reset-btn"><i class="fa fa-rotate-left"></i><span class="hide-on-collapse"> Reset</span></button>
            </div>
        </nav>

        <main class="main-content">
            <div id="listContainer" class="list-container"></div>
        </main>
    </div>
    `;

    const filtersContainer = document.getElementById("filtersContainer");
    const listContainer = document.getElementById("listContainer");
    const sidebarEl = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleSidebarBtn");
    const timeRange = document.getElementById("timeRange");
    const timeValue = document.getElementById("timeValue");
    const resetAllBtn = document.getElementById("resetAllBtn");

    const activeFilters = {
        meal: new Set(),
        subMeals: {}, 
        difficulty: new Set(),
        allergens: new Set(),
        maxTime: parseInt(timeRange.value, 10)
    };

    // --- Filtri ---
    const mealOptionsMap = {};
    recipes.forEach(r => {
        const rawMeal = (r.mealType || "").toString();
        const mealParts = rawMeal.split(/\s*\/\s*/).map(s => s.trim()).filter(Boolean);
        const sub = (r.subcategory || "").toString().trim();
        mealParts.forEach(part => {
            if (!mealOptionsMap[part]) mealOptionsMap[part] = new Set();
            if (sub) mealOptionsMap[part].add(sub);
        });
    });
    const mealOptionsObj = {};
    Object.entries(mealOptionsMap).forEach(([k, set]) => mealOptionsObj[k] = Array.from(set).sort());

    addFilterGroup(filtersContainer, {
        key: "meal",
        title: "Pasto",
        icon: "fa-utensils",
        options: mealOptionsObj
    });

    addFilterGroup(filtersContainer, {
        key: "difficulty",
        title: "Difficoltà",
        icon: "fa-puzzle-piece",
        options: ["facile", "media", "difficile"]
    });

    addFilterGroup(filtersContainer, {
        key: "allergens",
        title: "Allergeni",
        icon: "fa-triangle-exclamation",
        options: ["Glutine", "Lattosio", "Uova", "Frutta secca", "Pesce"]
    });

    renderList(recipes);

    // --- Eventi ---
    toggleBtn.addEventListener("click", () => {
        sidebarEl.classList.toggle("collapsed");
    });

    timeRange.addEventListener("input", () => {
        const v = parseInt(timeRange.value, 10);
        activeFilters.maxTime = v;
        timeValue.textContent = v;
        applyFilters();
    });

    resetAllBtn.addEventListener("click", () => {
        clearAllFilters();
        applyFilters();
    });

    // ===============================
    // FUNZIONI
    // ===============================

    function addFilterGroup(container, { key, title, icon, options }) {
        const group = document.createElement("div");
        group.className = "filter-group";
        group.innerHTML = `
            <div class="filter-header">
                <i class="fa ${icon} filter-icon" aria-hidden="true"></i>
                <span class="filter-title hide-on-collapse">${title}</span>
            </div>
            <div class="filter-options"></div>
        `;

        const optionsEl = group.querySelector(".filter-options");

        if (typeof options === "object" && !Array.isArray(options)) {
            // Pasto con sottocategorie
            Object.entries(options).forEach(([mainOption, subOptions]) => {
                const mainId = `f-${key}-${mainOption}`.replace(/\s+/g, "");
                const mainLabel = document.createElement("label");
                mainLabel.className = "filter-label main-option";
                mainLabel.innerHTML = `
                    <input type="checkbox" id="${mainId}" data-key="${key}" value="${mainOption}">
                    <span class="checkboxS"></span>
                    <span class="hide-on-collapse ">${mainOption}</span>
                    <i class="fa fa-chevron-down toggle-sub"></i>
                `;

                const subContainer = document.createElement("div");
                subContainer.className = "sub-options";

                subOptions.forEach(sub => {
                    const subId = `f-${key}-${mainOption}-${sub}`.replace(/\s+/g, "");
                    const subLabel = document.createElement("label");
                    subLabel.className = "filter-label sub-option";
                    subLabel.innerHTML = `
                        <input type="checkbox" id="${subId}" data-key="${key}" data-parent="${mainOption}" value="${sub}">
                        <span class="checkboxP"></span>
                        <span class="hide-on-collapse">${sub}</span>
                    `;
                    subLabel.querySelector("input").addEventListener("change", handleFilterChange);
                    subContainer.appendChild(subLabel);
                });

                // checkbox handler
                const mainCheckbox = mainLabel.querySelector("input");
                mainCheckbox.addEventListener("change", (e) => {
                    const checked = e.target.checked;
                    if (checked) {
                        // empty =  'all subcats'
                        if (!activeFilters.subMeals[mainOption]) activeFilters.subMeals[mainOption] = new Set();
                        activeFilters.meal.add(mainOption);
                        subContainer.classList.add('open');
                    } else {
                        // clear selected subcategories
                        subContainer.classList.remove('open');
                        subContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                        delete activeFilters.subMeals[mainOption];
                        activeFilters.meal.delete(mainOption);
                    }
                    applyFilters();
                });

                mainLabel.querySelector(".toggle-sub").addEventListener("click", (e) => {
                    e.stopPropagation();
                    //  open sub dropdown when main checkbox is checked
                    if (!mainLabel.querySelector('input').checked) return;
                    subContainer.classList.toggle("open");
                });

                optionsEl.appendChild(mainLabel);
                optionsEl.appendChild(subContainer);
            });
        } else if (Array.isArray(options)) {
            //checkbox
            options.forEach(opt => {
                const id = `f-${key}-${opt}`.replace(/\s+/g, "");
                const label = document.createElement("label");
                label.className = "filter-label";
                label.innerHTML = `
                    <input type="checkbox" id="${id}" data-key="${key}" value="${opt}">
                    <span class="hide-on-collapse">${opt}</span>
                `;
                label.querySelector("input").addEventListener("change", handleFilterChange);
                optionsEl.appendChild(label);
            });
        }

        container.appendChild(group);

        function handleFilterChange(e) {
            const inp = e.target;
            const val = inp.value;

            if (inp.dataset.parent) {
                const parentKey = inp.dataset.parent;
                const mainCheckbox = document.getElementById(`f-${inp.dataset.key}-${parentKey}`.replace(/\s+/g, ""));
                if (mainCheckbox && !mainCheckbox.checked) {
                    mainCheckbox.checked = true;
                    activeFilters.meal.add(parentKey);
                }
                if (!activeFilters.subMeals[parentKey]) activeFilters.subMeals[parentKey] = new Set();
                if (inp.checked) activeFilters.subMeals[parentKey].add(val);
                else activeFilters.subMeals[parentKey].delete(val);
            } else {
                if (inp.checked) activeFilters.meal.add(val);
                else activeFilters.meal.delete(val);
            }

            applyFilters();
        }
    }

    function clearAllFilters() {
        activeFilters.meal.clear();
        activeFilters.subMeals = {};
        activeFilters.difficulty.clear();
        activeFilters.allergens.clear();
        activeFilters.maxTime = parseInt(timeRange.max, 10);

        filtersContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        timeRange.value = timeRange.max;
        timeValue.textContent = timeRange.max;
    }

    function applyFilters() {
        const meals = Array.from(activeFilters.meal).map(s => s.toLowerCase());
        const diffs = Array.from(activeFilters.difficulty).map(s => s.toLowerCase());
        const allergens = Array.from(activeFilters.allergens).map(s => s.toLowerCase());
        const maxTime = activeFilters.maxTime;
        const subMeals = activeFilters.subMeals || {};

        const filtered = recipes.filter(r => {
            const t = parseTimeToMinutes(r.time);

            // multiple meal types (e.g. "Primo / Zuppa")
            const recipeMealParts = (r.mealType || "").toString().split(/\s*\/\s*/).map(s => s.trim()).filter(Boolean).map(s => s.toLowerCase());
            const mealOk = meals.length === 0 || recipeMealParts.some(p => meals.includes(p));

            let subOk = true;
            if (meals.length > 0) {
                for (const part of recipeMealParts) {
                    const parentKey = Object.keys(subMeals).find(k => k.toLowerCase() === part);
                    if (parentKey && subMeals[parentKey] && subMeals[parentKey].size > 0) {
                        const recipeSub = (r.subcategory || "").toString();
                        if (!subMeals[parentKey].has(recipeSub)) { subOk = false; break; }
                    }
                }
            }

            const diffOk = diffs.length === 0 || diffs.includes((r.difficulty || "").toLowerCase());
            const recipeAllergens = (r.allergens || []).map(a => a.toLowerCase());
            const allergenOk = allergens.length === 0 || !allergens.some(a => recipeAllergens.includes(a));
            const timeOk = !isNaN(t) ? (t <= maxTime) : true;

            return mealOk && subOk && diffOk && allergenOk && timeOk;
        });

        renderList(filtered);
    }

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
        return minutes || NaN;
    }

    function renderList(data) {
        listContainer.innerHTML = "";

        if (!data || data.length === 0) {
            listContainer.innerHTML = `<div class="no-results">Nessuna ricetta trovata.</div>`;
            return;
        }

        data.forEach(recipe => {
            const diff = (recipe.difficulty || "N/A").toLowerCase();
            const difficultyColor =
                diff === "facile" ? "#37B35C" :
                diff === "media" ? "#FFD93D" :
                diff === "difficile" ? "#D16643":
                "#a8a6a6ff";

            const item = document.createElement("article");
            item.className = "list-item";

            const imgSrc = recipe.imgList || recipe.imgGrid || recipe.img || "";

            item.innerHTML = `
            <div class="list-img-wrap">
                <img src="${imgSrc}" alt="${escapeHtml(recipe.title)}">
            </div>

            <div class="list-content">
                <div class="title-row">
                    <h3>${escapeHtml(recipe.title)}</h3>
                    <div class="time-box">
                        <div class="info-box">${recipe.time || "N/A"}</div>
                        <div class="info-box"><i class="fa-regular fa-clock"></i></div>
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
                    <div class="arrow" style="font-size=48px">➜</div>
                </div>
            </div>
            `;

            item.querySelector(".arrow").addEventListener("click", (e) => { e.stopPropagation(); openRecipePage(recipe); });
            item.addEventListener("click", () => openRecipePage(recipe));

            listContainer.appendChild(item);
        });
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// ----------------------
// Helper: carica CSS
// ----------------------
function loadCSS(path) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = path;
    document.head.appendChild(link);
}
