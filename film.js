let nameH1;
let prodEl;
let directEl;
let dateEl;
let crawlEl;
let charactersEl;
let planetsEl;
let charactersUl;
let planetsUl;
let id;
const sp = new URLSearchParams(window.location.search);
const baseUrl = `https://swapi2.azurewebsites.net/api`;

// Runs on page load
addEventListener('DOMContentLoaded', () => {
  id = sp.get('id');
  nameH1 = document.querySelector('h1#name');
  prodEl = document.querySelector('span#prod');
  directEl = document.querySelector('span#direct');
  dateEl = document.querySelector('span#date');
  crawlEl = document.getElementById('crawl');
  charactersEl = document.querySelector('characters');
  planetsEl = document.querySelector('planets');
  charactersUl = document.querySelector('#characters>ul');
  planetsUl = document.querySelector('#planets>ul');

  getFilm();
});

function getLocal(key) {
  return JSON.parse(window.localStorage.getItem(key));
}
function setLocal(key, planets, characters) {
  let curr = getLocal(key);
  let filmObj = { id, planets, characters };
  curr !== null ? window.localStorage.setItem(key, JSON.stringify([...curr, filmObj])) : window.localStorage.setItem(key, JSON.stringify([filmObj]));
}
function searchObjectById(arr, targetId) {
  for (const obj of arr) {
    if (obj.id === targetId) {
      return obj;
    }
  }
  return null; // Object not found
}

async function getFilm() {
  let filmObj;
  try {
    let localFilms = getLocal('films');
    let thisFilm = localFilms ? searchObjectById(localFilms, id) : null;

    if (thisFilm) {
      filmObj = thisFilm;

    } else {
      filmObj = await fetchFilm(id);
      let characters = await fetchCharacters(id);
      let planets = await fetchPlanets(id);
      filmObj.characters = characters;
      filmObj.planets = planets;
      setLocal('films', planets, characters);
    }
    console.log(filmObj);
  }
  catch (ex) {
    console.error(`Error reading character ${id} data.`, ex.message);
  }
  renderFilm(filmObj);
}

async function fetchCharacters() {
  const charactersUrl = `${baseUrl}/films/${id}/characters`;
  return await fetch(charactersUrl)
    .then(res => res.json())
}
async function fetchPlanets() {
  const planetsUrl = `${baseUrl}/films/${id}/planets`;
  return await fetch(planetsUrl)
    .then(res => res.json())
}
async function fetchFilm() {
  const url = `${baseUrl}/films/${id}`;
  return await fetch(url)
    .then(res => res.json())
}

const renderFilm = film => {
  document.title = `SWAPI - ${film?.title}`;  // Just to make the browser tab say their name
  nameH1.textContent = `Episode ${film?.episode_id}: ${film?.title}`;
  prodEl.textContent = film?.producer;
  directEl.textContent = film?.director;
  dateEl.textContent = film?.release_date;
  crawlEl.textContent = film?.opening_crawl;
  const charactersLis = film?.characters?.map(character => `<li><a href="/character.html?id=${character.id}">${character.name}</li>`)
  charactersUl.innerHTML = charactersLis.join("");
  const planetsLis = film?.planets?.map(planet => `<li><a href="/planet.html?id=${planet.id}">${planet.name}</li>`)
  planetsUl.innerHTML = planetsLis.join("");
}
