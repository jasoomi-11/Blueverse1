let movies = [];
let games = [];
let currentFocus = -1; // for keyboard navigation

async function loadData() {
  try {
    const moviesResp = await fetch('/assets/data/movies.json');
    movies = await moviesResp.json();

    const gamesResp = await fetch('/assets/data/games.json');
    games = await gamesResp.json();
  } catch (error) {
    console.error("Error loading JSON data:", error);
  }
}

function searchContent(query) {
  query = query.toLowerCase();
  const movieResults = movies.filter(item => item.title.toLowerCase().includes(query));
  const gameResults = games.filter(item => item.title.toLowerCase().includes(query));
  return [...movieResults, ...gameResults];
}

function renderResults(results) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    resultsContainer.innerHTML = '<p style="padding:10px;">No results found</p>';
    return;
  }

  results.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('search-item');
    div.innerHTML = `
      <img src="${item.thumb}" alt="${item.title}" />
      <div>
        <h4>${item.title}</h4>
        <p>${item.description}</p>
      </div>
    `;

    // Clickable card
    div.addEventListener('click', () => {
      window.location.href = `/${item.slug}`;
    });

    resultsContainer.appendChild(div);
  });
}

// Keyboard navigation
function addKeyboardNavigation(results) {
  const items = document.querySelectorAll('.search-item');
  document.getElementById('universal-search').addEventListener('keydown', function(e) {
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      currentFocus++;
      if (currentFocus >= items.length) currentFocus = 0;
      setActive(items);
    } else if (e.key === "ArrowUp") {
      currentFocus--;
      if (currentFocus < 0) currentFocus = items.length - 1;
      setActive(items);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentFocus > -1) items[currentFocus].click();
    }
  });
}

function setActive(items) {
  items.forEach(i => i.classList.remove('active'));
  if (currentFocus >= 0) items[currentFocus].classList.add('active');
}

// Event listener for search input
document.getElementById('universal-search').addEventListener('input', (e) => {
  const query = e.target.value.trim();
  currentFocus = -1;
  if (query.length > 0) {
    const results = searchContent(query);
    renderResults(results);
    addKeyboardNavigation(results);
  } else {
    document.getElementById('search-results').innerHTML = '';
  }
});

// Close results if clicked outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-container')) {
    document.getElementById('search-results').innerHTML = '';
  }
});

window.addEventListener('DOMContentLoaded', loadData);