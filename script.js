let state = {
  showslist: [],
  films: [],
  searchText: "",
  selectedEpisode: "default",
  inputContainer: "default",
  selectedShow: "82",
};


const fetchShows = async () => {
  const showlink = "https://api.tvmaze.com/shows";
    const response = await fetch(showlink);
    if(!response.ok) {
      throw new Error("Error Fetching Shows"); 
    }
    // const shows = await response.json();
    // console.log("shows:", + shows);
    return await response.json();
}

fetchShows()
  .then((showArray) => {
    state.showslist = showArray;
    render();
    makeshowSelectionAdded();
  }) 
  .catch((error) => {
    console.log(error);
    document.querySelector("main").innerHTML = "Failed to load data. Please try again later";
  });

  function makeshowSelectionAdded() {
  const selectshowContainer = document.getElementById("show-selector");
  selectshowContainer.innerHTML = '<option value="default">Choose a Show</option>';

  sortShowsAlphabetically(state.showslist).forEach((show) => {
    const option = document.createElement("option");
    option.value = String(show.id);
    option.textContent = show.name;
    selectshowContainer.appendChild(option);
  });
}



const fetchFilms = async () => {
  const url = "https://api.tvmaze.com/shows/82/episodes";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  return await response.json();
};

fetchFilms()
  .then((films) => {
    state.films = films;
    render();
    makeSelection();
  })
  .catch((error) => {
    console.log(error);
    document.querySelector("main").innerHTML =
      "Failed to load data. Please try again later.";
  });

//SELECTION FUNCTION FILM
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

  if (state.selectedShow === "default") {
  const labeldisplay = document.getElementById("displayed-films");
  labeldisplay.textContent = "Displaying 0/0";

  if (!state.isInitialLoad) {
    main.innerHTML = "";
  }

  return;
}


  if (state.inputContainer === "default") {
    const filterText = state.films.filter(
      (film) =>
        film.name.toLowerCase().includes(state.searchText.toLowerCase()) ||
        (film.summary).toLowerCase().includes(state.searchText.toLowerCase()),
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


//getting the films by ID per show
const fetchFilmsByShow = async (showId) => {
  const url = `https://api.tvmaze.com/shows/${showId}/episodes`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  return await response.json();
};

//sorting shows
function sortShowsAlphabetically(shows) {
  return [...shows].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}

//reseting the selector
function resetEpisodeSelector() {
  const selectfilmContainer = document.getElementById("film-selector");
  selectfilmContainer.innerHTML = '<option value="default">Choose an episode</option>';
}

const showSelected = document.getElementById("show-selector");
const handleShowSelection = async (event) => {
  const showId = event.target.value;
  state.selectedShow = showId;
  state.selectedEpisode = "default";
  state.searchText = "";
  state.inputContainer = "default";
  document.getElementById("search").value = "";

  if (showId === "default") {
  state.selectedShow = "82";    //showing the same episodes from the very first time the page loads.

  try {
    state.films = await fetchFilmsByShow("82");
    resetEpisodeSelector();
    makeSelection();
    render();
  } catch (error) {
    console.log(error);
  }

  return;
}


  try {
    state.films = await fetchFilmsByShow(showId);
    resetEpisodeSelector();
    makeSelection();
    render();
  } catch (error) {
    console.log(error);
    document.querySelector("main").innerHTML =
      "Failed to load data. Please try again later.";
  }
};

showSelected.addEventListener("change", handleShowSelection);


makeshowSelectionAdded();
