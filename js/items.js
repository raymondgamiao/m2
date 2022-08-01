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
        txt += `<div class="m-2" style="width: 5rem;">`;
        txt += `
        <a href="insiteitem.html?${x}">
        <img src="${imgSrc}" 
        class="border border-warning rounded img-fluid" 
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
          txt += `<div class="m-2" style="width: 5rem;">`;
          txt += `
        <a href="insiteitem.html?${x}">
        <img src="${imgSrc}" 
        class="border border-warning rounded img-fluid" 
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
      items[i].parentNode.parentNode.style.display = "";
    } else {
      items[i].parentNode.parentNode.style.display = "none";
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
