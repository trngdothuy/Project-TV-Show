const labelDisplay = document.getElementById("displayed-films-label");
const searchBox = document.getElementById("search");
const selectedFilm = document.getElementById("film-selector");
const selectedShow = document.getElementById("show-selector");
const main = document.querySelector("main");

let state = {
  showsList: [],
  films: [],
  searchText: "",
  selectedEpisode: "default",
  inputContainer: "default",
  selectedShow: "82",
  mode: "show",
};

const fetchShows = async () => {
  const response = await fetch('https://api.tvmaze.com/shows');
  if(!response.ok) {
    throw new Error("Error Fetching Shows"); 
  }
  // const shows = await response.json();
  // console.log("shows:", + shows);
  return await response.json();
}

fetchShows()
  .then((showArray) => {
    state.showsList = showArray;
    render();
    addShowSelection();
  }) 
  .catch((error) => {
    console.log(error);
    document.querySelector("main").innerHTML = "Failed to load data. Please try again later";
  });

// make show selector
function addShowSelection() {
  selectedShow.innerHTML = '<option value="default">Choose a Show</option>';

  sortShowsAlphabetically(state.showsList).forEach((show) => {
    const option = document.createElement("option");
    option.value = String(show.id);
    option.textContent = show.name;
    selectedShow.appendChild(option);
  });
}

const fetchFilms = async () => {
  const url = `https://api.tvmaze.com/shows/${state.selectedShow}/episodes`;
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
    addFilmSelection();
  })
  .catch((error) => {
    console.log(error);
    document.querySelector("main").innerHTML =
      "Failed to load data. Please try again later.";
  });

// make film selector
function addFilmSelection() {
  state.films.forEach((film) => {
    const option = document.createElement("option");
    option.value = film.name;
    option.textContent = `S${film.season.toString().padStart(2, "0")}E${film.number.toString().padStart(2, "0")} - ${film.name}`;
    selectedFilm.appendChild(option);
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

function makeShowCard({ name, image, summary, genres, status, rating, runtime }) {
  const showCardDiv = document.createElement("div");
  showCardDiv.className = "show-card-div";
  let showTitleDiv = document.createElement("div");
  showTitleDiv.className = "show-title-div";
  let showDescriptionDiv = document.createElement("div");
  showDescriptionDiv.className = "show-description-div";

  let showTitle = document.createElement("h1");
  showTitle.textContent = `${name}`;

  let showImg = document.createElement("img");
  showImg.src = image.medium;
  showImg.alt = name;
  showImg.style.marginBottom = "2rem";

  let showDescription = document.createElement("div");
  showDescription.className="show-description"
  showDescription.innerHTML = summary;

  let showRatingDiv = document.createElement("div");
  showRatingDiv.className="show-rating-div"
  let showRate = document.createElement("p")
  showRate.innerHTML = `<b>Rated:</b> ${rating.average}`;
  let showGenre = document.createElement("p")
  showGenre.innerHTML = `<b>Genres:</b> ${genres.join(", ")}`;
  let showStatus = document.createElement("p")
  showStatus.innerHTML = `<b>Status:</b> ${status}`;
  let showRuntime = document.createElement("p")
  showRuntime.innerHTML = `<b>Runtime: </b>${runtime}`;

  showTitleDiv.append(showTitle);
  showRatingDiv.append(showRate, showGenre, showStatus, showRuntime);
  showDescriptionDiv.append(showImg, showDescription, showRatingDiv);
  showCardDiv.append(showTitleDiv, showDescriptionDiv);

  return showCardDiv;
}

function renderShow() {
  selectedFilm.style.display = "none"
  labelDisplay.textContent = `Displaying ${state.showsList.length}/${state.showsList.length} show(s)`;

  if (state.inputContainer === "default") {
  const filterText = state.showsList.filter(
      (show) =>
        show.name.toLowerCase().includes(state.searchText.toLowerCase()) ||
        show.summary.toLowerCase().includes(state.searchText.toLowerCase()) || show.genres.includes(state.searchText.toLowerCase()),
    );

  const filterShow = filterText.map(makeShowCard);
    main.append(...filterShow);

  labelDisplay.textContent = `Displaying ${filterText.length}/${state.showsList.length} episode(s)`;
  } 
  // use show selector
  else if (state.inputContainer === "select") {
      const filterSelected = state.showsList.filter(
        (show) => show.name === state.selectedEpisode,
      );

      const filterSelectedEpisode = filterSelected.map(makeFilmCard);
      main.append(...filterSelectedEpisode);

      labelDisplay.textContent = `Displaying ${filterSelectedEpisode.length}/${state.films.length}`;
    }
}

const render = () => {
  main.innerHTML = "";

  if (state.mode === "show") {
    renderShow()
  } else {
    if (state.selectedShow === "none") {
      labelDisplay.textContent = "Displaying 0/0";
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

      labelDisplay.textContent = `Displaying ${filterText.length}/${state.films.length} episode(s)`;
    } else if (state.inputContainer === "select") {
      const filterSelected = state.films.filter(
        (film) => film.name === state.selectedEpisode,
      );

      const filterSelectedEpisode = filterSelected.map(makeFilmCard);
      main.append(...filterSelectedEpisode);

      labelDisplay.textContent = `Displaying ${filterSelectedEpisode.length}/${state.films.length}`;
    }
  };
}  

render();

const handleSearch = (event) => {
  state.searchText = event.target.value;
  state.inputContainer = "default";
  render();
};
searchBox.addEventListener("input", handleSearch);

// handleSelection
const handleSelection = (event) => {
  state.selectedEpisode = event.target.value;
  if (state.selectedEpisode === "default") {
    state.inputContainer = "default";
  } else state.inputContainer = "select";
  render();
};
selectedFilm.addEventListener("change", handleSelection);

// sorting shows
function sortShowsAlphabetically(shows) {
  return [...shows].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}

// reseting the selector
function resetEpisodeSelector() {
  selectedFilm.innerHTML = '<option value="default">Choose an episode</option>';
}

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
    state.films = await fetchFilms;
    resetEpisodeSelector();
    addFilmSelection();
    render();
  } catch (error) {
    console.log(error);
  }
  return;
  }

  try {
    state.films = await fetchFilms();
    resetEpisodeSelector();
    addFilmSelection();
    render();
  } catch (error) {
    console.log(error);
    document.querySelector("main").innerHTML =
      "Failed to load data. Please try again later.";
  }
};

selectedShow.addEventListener("change", handleShowSelection);

addShowSelection();
