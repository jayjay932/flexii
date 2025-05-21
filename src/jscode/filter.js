
  function toggleFilterOptions() {
  document.querySelector('.filter-options').classList.toggle('hidden');
}
function sortListings(value) {
  const url = new URL(window.location.href);
  url.searchParams.set('sort', value);
  window.location.href = url.toString();
}


function filterByCategory(category) {
  // Exemple à adapter selon ton back ou JS filtering
  alert(`Filtering by category: ${category}`);
}


