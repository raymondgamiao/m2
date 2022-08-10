const riotKey = config.riotKey;

//populate champions
async function getChampions() {
  let link =
    "http://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/champion.json";
  const response = await fetch(link);
  let data = await response.json();
  let txt = "";
  const activeFilter = document.getElementById("activeFilter");
  const filters = activeFilter.querySelectorAll(".filter");

  for (let x in data.data) {
    let imgSrc = `http://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/${x}.png`;
    if (filters.length == 0) {
      txt += `<div class="champion img-div mx-3 mb-3 text-center" style="width: 120px">
      <a href="insiteChamp.html?${data.data[x].id}">
        <img src="${imgSrc}" alt="..." class="img-fluid img-thumbnail">
      </a>
      <h5 class="mt-2 mb-0">${data.data[x].name}</h5>
      
      </div>`;
      //<p class="small">${data.data[x].title}</p>
    } else {
      const filterArr = [];
      for (i = 0; i < filters.length; i++) {
        filterArr.push(filters[i].innerText.toUpperCase());
      }
      const tagArr = [];
      for (i = 0; i < data.data[x].tags.length; i++) {
        tagArr.push(data.data[x].tags[i].toUpperCase());
      }
      const found = filterArr.every((r) => tagArr.includes(r));
      if (found) {
        txt += `<div class="champion  img-div mx-3 mb-3 text-center" style="width: 120px">
        <a href="insiteChamp.html?${data.data[x].id}">
          <img src="${imgSrc}" alt="..." class="img-fluid img-thumbnail">
        </a>
        <h5 class="mt-2 mb-0">${data.data[x].name}</h5>
        <p class="small">${data.data[x].title}</p>
        </div>`;
      }
    }
  }

  //put cards inside div
  document.getElementById("champions").innerHTML = txt;
}

//search champions
function searchChampions() {
  const inputSearch = document.querySelector('input[name="inputSearch"]');
  const query = inputSearch.value.toUpperCase();
  const list = document.getElementById("champions");
  const champs = list.querySelectorAll(".champion");

  //search all cards for matches with search query
  //if match then show, else hide
  for (i = 0; i < champs.length; i++) {
    let champName = champs[i].innerText;
    if (champName.toUpperCase().indexOf(query) > -1) {
      //champs[i].style.display = "";
      champs[i].classList.add("visible");
      champs[i].classList.remove("hidden");
    } else {
      //champs[i].style.display = "none";
      champs[i].classList.add("hidden");
      champs[i].classList.remove("visible");
    }
  }

  //create no result element
  let noResult = document.createElement("h3");
  noResult.innerText = "No result";
  noResult.classList.add("noResult", "hidden");
  list.append(noResult);

  //search visible
  const visible = list.querySelectorAll(".visible");
  const noResultItem = list.querySelector(".noResult");

  //if everything is hidden, show "no result"
  if (visible.length == 0) {
    noResultItem.classList.add("visible");
    noResultItem.classList.remove("hidden");
  } else {
    noResultItem.classList.add("hidden");
    noResultItem.classList.remove("visible");
  }
}

function addFilter(filter) {
  const activeFilter = document.getElementById("activeFilter");
  const filters = activeFilter.querySelectorAll(".filter");
  //check if nodelist has value
  const doesExist = (obj, value) => {
    for (let key in obj) {
      if (obj[key].innerText == value) {
        return true;
      }
    }
    return false;
  };
  let exists = doesExist(filters, filter);

  if (!exists) {
    const newFilter = document.createElement("div");
    newFilter.classList.add(
      "filter",
      "bg-light",
      "rounded-pill",
      "text-dark",
      "px-3",
      "py-2",
      "me-2"
    );
    newFilter.innerText = filter;
    const closeBtn = document.createElement("i");
    closeBtn.classList.add("closeBtn", "ms-2", "fa-solid", "fa-xmark");
    closeBtn.setAttribute("onclick", `removeFilter('${filter}')`);
    newFilter.appendChild(closeBtn);
    activeFilter.appendChild(newFilter);
  } else {
    console.log("no, filter added na ");
  }

  //hide mga di pasok sa filter
  getChampions();
}

function removeFilter(filter) {
  const activeFilter = document.getElementById("activeFilter");
  const filters = activeFilter.querySelectorAll(".filter");
  for (x of filters) {
    if (x.innerText == filter) {
      x.remove();
      getChampions();
    }
  }
}

let calcScrollValue = () => {
  let scrollProgress = document.getElementById("progress");
  let progressValue = document.getElementById("progress-value");
  let pos = document.documentElement.scrollTop;
  let calcHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrollValue = Math.round((pos * 100) / calcHeight);
  if (pos > 100) {
    scrollProgress.style.display = "grid";
  } else {
    scrollProgress.style.display = "none";
  }
  scrollProgress.addEventListener("click", () => {
    document.documentElement.scrollTop = 0;
  });
  scrollProgress.style.background = `conic-gradient(#03cc65 ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
};
window.onscroll = calcScrollValue;

getChampions();
calcScrollValue();
