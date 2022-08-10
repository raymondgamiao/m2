const riotKey = config.riotKey;

//populate items
async function getItems() {
  let link =
    "http://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/item.json";
  const response = await fetch(link);
  let data = await response.json();

  let txt = "";
  const activeFilter = document.getElementById("activeFilter");
  const filters = activeFilter.querySelectorAll(".filter");

  /*  function doesExist(obj, value) {
    for (let key in obj) {
      if (obj[key].innerText == value) {
        return true;
      }
    }
    return false;
  } */

  //add filter

  for (let x in data.data) {
    let imgSrc = `https://ddragon.leagueoflegends.com/cdn/12.13.1/img/item/${data.data[x].image.full}`;
    if (data.data[x].gold.purchasable) {
      if (filters.length == 0) {
        txt += `<div class="m-2 img-div" style="width: 5rem;">`;
        txt += `
        <a href="insiteitem.html?${x}">
        <img src="${imgSrc}" 
        class=" rounded img-thumbnail " 
        alt="..."
        data-bs-toggle = "tooltip"
        data-bs-title = "${data.data[x].name}"
        data-bs-placement = "top"
        ></a>`;

        txt += `</div>`;
      } else {
        /*         let exists = false;
        if (data.data[x].hasOwnProperty("tags")) {
          for (i of data.data[x].tags) {
            exists = doesExist(filters, i.toUpperCase());
          }
        } */
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
          txt += `<div class="m-2 img-div" style="width: 5rem;">`;
          txt += `
        <a href="insiteitem.html?${x}">
        <img src="${imgSrc}" 
        class=" rounded img-fluid img-thumbnail " 
        alt="..."
        data-bs-toggle = "tooltip"
        data-bs-title = "${data.data[x].name}"
        data-bs-placement = "top"
        ></a>`;
          console.log(data.data[x].tags);
          txt += `</div>`;
        }
      }
    }
  }

  //put items cards into div
  document.getElementById("items").innerHTML = txt;

  //initialize tooltips
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
}

//search items
function searchItems() {
  const inputSearch = document.querySelector('input[name="inputSearch"]');
  const query = inputSearch.value.toUpperCase();
  const list = document.getElementById("items");
  // const cardh5 = list.querySelectorAll(".card-title");
  // const card = list.querySelectorAll("div.card");
  const items = list.querySelectorAll("[data-bs-title]");

  //search all cards for matches with search query
  //if match then show, else hide
  for (i = 0; i < items.length; i++) {
    itemName = items[i].getAttribute("data-bs-title");
    if (itemName.toUpperCase().indexOf(query) > -1) {
      // items[i].parentNode.parentNode.style.display = "";
      items[i].parentNode.parentNode.classList.add("visible");
      items[i].parentNode.parentNode.classList.remove("hidden");
    } else {
      // items[i].parentNode.parentNode.style.display = "none";
      items[i].parentNode.parentNode.classList.add("hidden");
      items[i].parentNode.parentNode.classList.remove("visible");
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
  getItems();
}

function removeFilter(filter) {
  const activeFilter = document.getElementById("activeFilter");
  const filters = activeFilter.querySelectorAll(".filter");
  for (x of filters) {
    if (x.innerText == filter) {
      x.remove();
      getItems();
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
calcScrollValue();
