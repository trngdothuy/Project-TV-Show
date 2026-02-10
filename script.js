//You can edit ALL of the code here
import "./episodes.js"; //I imported the films from the JS so that I can access the function assigned to "allEpisodes"
//I have also added a type="model" to the script so that this import can work

let searchText = "";
// This is the same with the object property searchterm in the reference as the search text will we stored here as a string.
//I used let since it will change once the user type.

let selectedEpisode = "";
let inputContainer = "default"; //switcher for a user use selector or search. see handleSelector or render().

const allEpisodes = getAllEpisodes();

// makePageForEpisodes(allEpisodes);

// function makePageForEpisodes(episodeList) {
//   const rootElem = document.getElementById("root");
//   // rootElem.textContent = `Got ${episodeList.length} episode(s)`;
//   rootElem.append(...episodeList.map(makeFilmCard));
// }

//I have removed the function since I think it is no longer needed as we will only load
//searchtext getting the episodes and render
//This way we can do the state of searching.

//SELECTION FUNCTION
function makeSelection() {
  const selectfilmContainer = document.getElementById("film-selector");

  allEpisodes.forEach((film) => {
    const option = document.createElement("option");
    option.value = film.name;
    option.textContent = `${film.name}`;
    selectfilmContainer.appendChild(option);
  });
}

//I didn't change your makeFilmCard :)
function makeFilmCard({ name, season, number, image, summary }) {
  const filmCardDiv = document.createElement("div");
  filmCardDiv.className = "film-card-div";
  let filmTitleDiv = document.createElement("div");
  filmTitleDiv.className = "film-title-div";
  let filmDescriptionDiv = document.createElement("div");
  filmDescriptionDiv.className = "film-description-div";

  let filmTitle = document.createElement("h3");
  // console.log(filmCardDiv)
  filmTitle.textContent = `${name} - S${season.toString().padStart(2, "0")}E${number.toString().padStart(2, "0")}`;
  // console.log(filmTitle)

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

//added the render the same way with Alejandro's code
const render = () => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  //In here I just used a conditional to be able to decide what the user did, if it will
  //use the selector or the search.

  //Basically I just did two versions of the render code based on their own input
  if (inputContainer === "default") {
    const filterText = allEpisodes.filter(
      (film) =>
        film.name.includes(searchText) || film.summary.includes(searchText),
    );

    const filterFilms = filterText.map(makeFilmCard);
    main.append(...filterFilms);

    const labeldisplay = document.getElementById("displayed-films");
    labeldisplay.textContent = `Displaying ${filterText.length}/${allEpisodes.length}`;
  } else if (inputContainer === "select") {
    const filterSelected = allEpisodes.filter(
      (film) => film.name === selectedEpisode,
    );

    const filterSelectedEpisode = filterSelected.map(makeFilmCard);
    main.append(...filterSelectedEpisode);

    const labeldisplay = document.getElementById("displayed-films");
    labeldisplay.textContent = `Displaying ${filterSelectedEpisode.length}/${allEpisodes.length}`;
  }
};

render();
makeSelection(); //I separated this so it will be clean and not messy. the purpose of this is just to show the list in the beginning.

const searchBox = document.getElementById("search");

const handleSearch = (event) => {
  searchText = event.target.value;
  inputContainer = "default";
  render();
};

searchBox.addEventListener("input", handleSearch);

//handleSelection
const selected = document.getElementById("film-selector");
const handleSelection = (event) => {
  selectedEpisode = event.target.value;
  if (selectedEpisode === "default") {
    //In here I just added an if so that when the value
    //of the selected target is the "choose the episode" where in I will
    inputContainer = "default"; //display all of the episodes and just 1 if the selector is used.
  } else inputContainer = "select"; //I added a default option and a inputContainer wherein
  render(); //it switches. See its used in render();
};

selected.addEventListener("change", handleSelection);
// window.onload = setup;
//I removed this since the function setup is removed and is not necessary. I tried to do it with setup,
//but it made the logic messy, in this way it is clear and easy to understand.
