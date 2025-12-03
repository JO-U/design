export function init(recipes) {
    loadCSS("css/list.css");
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

function renderList(data) {
    const gridContainer = document.getElementById("gridContainer");
    gridContainer.innerHTML = "";
    gridContainer.className = "list-layout";

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
