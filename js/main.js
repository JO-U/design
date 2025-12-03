// Legge layout dalla query string

const urlParams = new URLSearchParams(window.location.search);
const layoutVersion = urlParams.get("layout") || "list";

fetch("recipes.json")
    .then(res => res.json())
    .then(data => {
        const recipesArray = Object.values(data).flat();
        window.allRecipes = recipesArray;
        loadLayoutModule(layoutVersion, recipesArray);
    })
    .catch(err => console.error("Errore nel caricamento di recipes.json:", err));

function loadLayoutModule(layout, recipes) {
    import(`./layouts/${layout}.js`)
        .then(module => {
            if(typeof module.init === "function"){
                module.init(recipes);
            } else {
                throw new Error("init non trovato, fallback su grid");
            }
        })
        .catch(err => {
            console.error(err);
            import("./layouts/grid.js")
                .then(m => m.init(recipes))
                .catch(e => console.error("Errore anche nel fallback grid:", e));
        });

}

