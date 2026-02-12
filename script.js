// I store every data that will change in state
let state = {
  films: [],
  searchText: "",
  selectedEpisode: "",
  inputContainer: "default"
}

const fetchFilms = async () => {
  const url = "https://api.tvmaze.com/shows/82/episodes"
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }
  return await response.json()
}

fetchFilms().then((films) => {
  state.films = films
  render();
  makeSelection(); 
}).catch((error) => {
  console.log(error)
  document.querySelector("main").innerHTML =
    "Failed to load data. Please try again later.";
})

//SELECTION FUNCTION
function makeSelection() {
  const selectfilmContainer = document.getElementById("film-selector");

  state.films.forEach((film) => {
    const option = document.createElement("option");
    option.value = film.name;
    option.textContent = `S${film.season.toString().padStart(2, "0")}E${film.number.toString().padStart(2, "0")} - ${film.name}`;
    selectfilmContainer.appendChild(option);
  });
}

function makeFilmCard({ name, season, number, image, summary }) {
  const filmCardDiv = document.createElement("div");
  filmCardDiv.className = "film-card-div";
  let filmTitleDiv = document.createElement("div");
  filmTitleDiv.className = "film-title-div";
  let filmDescriptionDiv = document.createElement("div");
  filmDescriptionDiv.className = "film-description-div";

  let filmTitle = document.createElement("h3");
  filmTitle.textContent = `${name} - S${season.toString().padStart(2, "0")}E${number.toString().padStart(2, "0")}`;

  let filmImgDiv = document.createElement("div");
  filmImgDiv.className = "film-img-div";
  let filmImg = document.createElement("img");
  filmImg.src = image.medium;
  filmImg.alt = filmTitle;
  filmImgDiv.append(filmImg);

  let filmDescription = document.createElement("div");
  filmDescription.innerHTML = summary;

  filmTitleDiv.append(filmTitle);
  filmDescriptionDiv.append(filmImgDiv, filmDescription);
  filmCardDiv.append(filmTitleDiv, filmDescriptionDiv);

  return filmCardDiv;
}

const render = () => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  if (state.films.length == 0) {
    main.innerHTML = "Data loading... Please wait";
  }

  if (state.inputContainer === "default") {
    const filterText = state.films.filter(
      (film) =>
        film.name.toLowerCase().includes(state.searchText.toLowerCase()) ||
        film.summary.toLowerCase().includes(state.searchText.toLowerCase()),
    );

    const filterFilms = filterText.map(makeFilmCard);
    main.append(...filterFilms);

    const labeldisplay = document.getElementById("displayed-films");
    labeldisplay.textContent = `Displaying ${filterText.length}/${state.films.length}`;
  } else if (state.inputContainer === "select") {
    const filterSelected = state.films.filter(
      (film) => film.name === state.selectedEpisode,
    );

    const filterSelectedEpisode = filterSelected.map(makeFilmCard);
    main.append(...filterSelectedEpisode);

    const labeldisplay = document.getElementById("displayed-films");
    labeldisplay.textContent = `Displaying ${filterSelectedEpisode.length}/${state.films.length}`;
  }
};

render();

const searchBox = document.getElementById("search");
const handleSearch = (event) => {
  state.searchText = event.target.value;
  state.inputContainer = "default";
  render();
};

searchBox.addEventListener("input", handleSearch);

//handleSelection
const selected = document.getElementById("film-selector");
const handleSelection = (event) => {
  state.selectedEpisode = event.target.value;
  if (state.selectedEpisode === "default") {
    state.inputContainer = "default";
  } else state.inputContainer = "select";
  render();
};

selected.addEventListener("change", handleSelection);

//Line 109-111
//In here I just added an if so that when the value
//of the selected target is the "choose the episode" where in I will
//display all of the episodes and just 1 if the selector is used.
//I added a default option and a inputContainer wherein
//it switches. See its used in render();

