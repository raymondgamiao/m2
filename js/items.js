const riotKey = config.riotKey;

//populate items
async function getItems() {
  let link =
    "http://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/item.json";
  const response = await fetch(link);
  let data = await response.json();

  //create item cards
  let txt = "<div class='d-flex flex-wrap justify-content-start mx-auto'>";
  for (let x in data.data) {
    let imgSrc = `https://ddragon.leagueoflegends.com/cdn/12.13.1/img/item/${data.data[x].image.full}`;
    txt += `<div class="card m-2" style="width: 10rem;">`;
    txt += ` <img src="${imgSrc}" class="card-img-top" alt="...">`;
    txt += `<div class="card-body">`;
    txt += `<h5 class="card-title"><a href ="insiteitem.html?${x}">${data.data[x].name}</a></h5>`;

    //txt += `<p class="card-text">${data.data[x].description}</p>`;
    txt += `<p class="card-text">${data.data[x].plaintext}</p>`;

    //some items are not upgradeable
    //show items if upgradeable is true
    if (data.data[x].hasOwnProperty("into") == true) {
      txt += `<p class="mb-0 ">upgrades:</p>`;
      for (let i in data.data[x].into) {
        let buildInto = data.data[x].into[i];
        let buildIntoImg = data.data[buildInto].image.full;
        let buildIntoImgsrc = `https://ddragon.leagueoflegends.com/cdn/12.13.1/img/item/${buildIntoImg}`;
        txt += `<img src="${buildIntoImgsrc}" class="card-img-top" alt="..." style="height: 20px; width: 20px"> `;
      }
    }
    txt += `</div></div>`;
  }
  txt += `</div>`;
  //put items cards into div
  document.getElementById("items").innerHTML += txt;
}

//search items
function searchItems() {
  const inputSearch = document.querySelector('input[name="inputSearch"]');
  const query = inputSearch.value.toUpperCase();
  const list = document.getElementById("items");
  const cardh5 = list.querySelectorAll(".card-title");
  const card = list.querySelectorAll("div.card");

  //search all cards for matches with search query
  //if match then show, else hide
  for (i = 0; i < cardh5.length; i++) {
    cardTitle = cardh5[i].innerText;
    if (cardTitle.toUpperCase().indexOf(query) > -1) {
      card[i].style.display = "";
    } else {
      card[i].style.display = "none";
    }
  }
}
