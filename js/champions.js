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
      txt += `<div class="champion mx-3 mb-3 text-center" style="width: 120px">
      <a href="insiteChamp.html?${data.data[x].id}">
        <img src="${imgSrc}" alt="..." class="img-fluid">
      </a>
      <h5 class="mt-2 mb-0">${data.data[x].name}</h5>
      <p class="small">${data.data[x].title}</p>
      </div>`;
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
        txt += `<div class="champion mx-3 mb-3 text-center" style="width: 120px">
        <a href="insiteChamp.html?${data.data[x].id}">
          <img src="${imgSrc}" alt="..." class="img-fluid">
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
      champs[i].style.display = "";
    } else {
      champs[i].style.display = "none";
    }
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
