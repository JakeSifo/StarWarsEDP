let nameH1;
let prodEl;
let directEl;
let dateEl;
let crawlEl;
let charactersEl;
let planetsEl;
let charactersUl;
let planetsUl;
const sp = new URLSearchParams(window.location.search);

const baseUrl = `https://swapi2.azurewebsites.net/api`;

// Runs on page load
addEventListener('DOMContentLoaded', () => {
  const film = sp.get('id');
  nameH1 = document.querySelector('h1#name');
  prodEl = document.querySelector('span#prod');
  directEl = document.querySelector('span#direct');
  dateEl = document.querySelector('span#date');
  crawlEl = document.getElementById('crawl');
  charactersEl = document.querySelector('characters');
  planetsEl = document.querySelector('planets');
  charactersUl = document.querySelector('#characters>ul');
  planetsUl = document.querySelector('#planets>ul');

  getFilm(film);
});

async function getFilm(id) {
  let filmObj;
  try {
    filmObj = await fetchFilm(id);
    filmObj.characterObj = await fetchCharacters(id);
    filmObj.planetsObj = await fetchPlanets(id);
    // console.log(filmObj);
  }
  catch (ex) {
    console.error(`Error reading character ${id} data.`, ex.message);
  }
  renderFilm(filmObj);

}
async function fetchCharacters(id) {
  let charactersUrl = `${baseUrl}/films/${id}/characters`;
  return await fetch(charactersUrl)
    .then(res => res.json())
}

async function fetchPlanets(id) {
  let planetsUrl = `${baseUrl}/films/${id}/planets`;
  return await fetch(planetsUrl)
    .then(res => res.json())
}

async function fetchFilm(id) {
  const url = `${baseUrl}/films/${id}`;
  const filmObj = await fetch(url)
    .then(res => res.json())
  return filmObj;
}

const renderFilm = film => {
  document.title = `SWAPI - ${film?.title}`;  // Just to make the browser tab say their name
  nameH1.textContent = `Episode ${film?.episode_id}: ${film?.title}`;
  prodEl.textContent = film?.producer;
  directEl.textContent = film?.director;
  dateEl.textContent = film?.release_date;
  crawlEl.textContent = film?.opening_crawl;
  const charactersLis = film?.characterObj?.map(character => `<li><a href="/character.html?id=${character.id}">${character.name}</li>`)
  charactersUl.innerHTML = charactersLis.join("");
  const planetsLis = film?.planetsObj?.map(planet => `<li><a href="/planet.html?id=${planet.id}">${planet.name}</li>`)
  planetsUl.innerHTML = planetsLis.join("");
}
