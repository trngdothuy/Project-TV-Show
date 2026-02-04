//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.append(...episodeList.map(makeFilmCard))
}

function makeFilmCard({name, season, number, image, summary}) {
  const filmCardDiv = document.createElement("div")
  filmCardDiv.className = "film-card-div"
  let filmTitleDiv = document.createElement("div")
  filmTitleDiv.className = "film-title-div"
  let filmDescriptionDiv = document.createElement("div")
  filmDescriptionDiv.className = "film-description-div"

  let filmTitle = document.createElement("h3")
  // console.log(filmCardDiv)
  filmTitle.textContent = `${name} - S${season.toString().padStart(2,"0")}E${number.toString().padStart(2, "0")};`  
  // console.log(filmTitle)

  let filmImg = document.createElement("img")
  filmImg.src = image.medium
  filmImg.alt = filmTitle
  let filmDescription = document.createElement("div")
  filmDescription.innerHTML = summary

  filmTitleDiv.append(filmTitle)
  filmDescriptionDiv.append(filmImg, filmDescription)
  filmCardDiv.append(filmTitleDiv, filmDescriptionDiv)
  // console.log(filmCardDiv)

  return filmCardDiv
}

window.onload = setup;
