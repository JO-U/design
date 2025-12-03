export function init(recipes) {
    loadCSS("css/carousel.css");

    const container = document.getElementById("gridContainer");
    container.innerHTML = "";
    container.className = "carousel-page";

    //ricette per mealType
    const groups = {};
    recipes.forEach(r => {
        const type = r.mealType || "Altro";
        if (!groups[type]) groups[type] = [];
        groups[type].push(r);
    });

    //carosello per ogni portata
    Object.entries(groups).forEach(([meal, items]) => {
        container.appendChild(createCarousel(meal, items));
    });
}

function createCarousel(mealName, items) {
    const wrapper = document.createElement("section");
    wrapper.className = "carousel-section";

    wrapper.innerHTML = `

        <div class="carousel-track-wrapper">
            <div class="carousel-track"></div>
        </div>
        <div class="carousel-header">
            <span class="arrow-left carousel-btn"><i class="fa fa-chevron-left"></i></span>
            <h2 class="carousel-title">${mealName}</h2>
            <span class="arrow-right carousel-btn"><i class="fa fa-chevron-right"></i></span>
        </div>
    `;

    const track = wrapper.querySelector(".carousel-track");
    let index = 1; // card centrale

    //  CARDS
    items.forEach(r => track.appendChild(createCard(r)));

    // AGGIORNA CLASSI 
    function updateClasses() {
        const cards = track.querySelectorAll(".food-item");
        cards.forEach((c, i) => {
            c.classList.remove("active", "side");
            if (i === index) c.classList.add("active");
            else c.classList.add("side");
        });

        const offset = index * -260 + 260; // centra card
        track.style.transform = `translateX(${offset}px)`;
    }

    updateClasses();

    const prev = wrapper.querySelector(".arrow-left");
    const next = wrapper.querySelector(".arrow-right");

    prev.addEventListener("click", () => {
        if (index > 0) {
            index--;
            updateClasses();
        }
    });

    next.addEventListener("click", () => {
        if (index < items.length - 1) {
            index++;
            updateClasses();
        }
    });

    return wrapper;
}


function createCard(recipe) {
    const difficultyColor =
        recipe.difficulty === "Facile" ? "#37B35C" :
        recipe.difficulty === "Media" ? "#FFD93D" :
        recipe.difficulty === "Difficile" ? "#D16643" :
        "#a8a6a6ff";

    const div = document.createElement("div");
    div.className = "food-item";

    const img = recipe.imgGrid || recipe.imgList || recipe.img || "";

    div.innerHTML = `
        <div class="topInfo">
          <div class="difficulty-bar" style="background:${difficultyColor}"></div>
          <div class="top-right-info">
            <div class="info-box">${recipe.time || "N/A"}</div>
            <div class="info-box"><i class="fa fa-clock-o"></i></div>
           </div>
        </div>

        <img src="${img}" alt="${recipe.title}">

        <div class="bottom-row">
            <h3>${recipe.title}</h3>
            <div class="arrow">➜</div>
        </div>
    `;

    div.querySelector(".arrow").addEventListener("click", () => openRecipe(recipe));
    div.addEventListener("click", () => openRecipe(recipe));

    return div;
}

function openRecipe(recipe) {
    const slug = recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    window.location.href = `recipe.html?id=${slug}`;
}

function loadCSS(path) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = path;
    document.head.appendChild(link);
}
