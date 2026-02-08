//You can edit ALL of the code here
import "./episodes.js"; //I imported the films from the JS so that I can access the function assigned to "allEpisodes"
//I have also added a type="model" to the script so that this import can work

let searchText = ""; // This is the same with the object property searchterm in the reference as the search text will we stored here as a string.
//I used let since it will change once the user type.
const allEpisodes = getAllEpisodes();

// makePageForEpisodes(allEpisodes);

// function makePageForEpisodes(episodeList) {
//   const rootElem = document.getElementById("root");
//   // rootElem.textContent = `Got ${episodeList.length} episode(s)`;
//   rootElem.append(...episodeList.map(makeFilmCard));
// }

//I have removed the function since I think it is no longer needed as we will only load
//searchtext
//getting the episodes
//and render
//This way we can do the state of searching.

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
  // console.log(filmCardDiv)

  return filmCardDiv;
}

//added the render the same way with Alejandro's code
const render = () => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  const filterText = allEpisodes.filter(
    (film) =>
      film.name.includes(searchText) || film.summary.includes(searchText),
  );

  //In line 59-61, what i did is to be able to search in the title (name) and the summary all together
  //because I tried to do it one at a time it did not work and has more and messy codes so it's better to search it all at once.
  // I just use a conditional OR. but it is still the same way Alejandro did in the reference.

  const filterFilms = filterText.map(makeFilmCard);
  main.append(...filterFilms);
};

render();

const searchBox = document.getElementById("search");

const handleSearch = (event) => {
  searchText = event.target.value;

  render();
};

searchBox.addEventListener("input", handleSearch);

// window.onload = setup;
//I removed this since the function setup is removed and is not necessary. I tried to do it with setup,
//but it made the logic messy, in this way it is clear and easy to understand.
