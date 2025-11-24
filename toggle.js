const toggleExplore = document.getElementById('toggleExplore');
const toggleGrid = document.getElementById('toggleGrid');
const experienceView = document.getElementById('experienceView');
const gridView = document.getElementById('gridView');

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
