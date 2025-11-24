let recipesData = [];

Papa.parse('recipe.csv', {
  download: true,
  header: true,
  complete: function(results) {
    recipesData = results.data;

    // Inizializza Explore
    if (typeof initExperience === "function") initExperience(recipesData);

    // Inizializza Grid
    if (typeof populateGrid === "function") populateGrid(recipesData);
  }
});