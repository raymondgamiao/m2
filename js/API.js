const riotKey = "RGAPI-52c665bd-2ff0-4645-96c8-64eee61e18e2";

//populate champions
async function getChampions() {
  let link =
    "http://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/champion.json";
  const response = await fetch(link);
  let data = await response.json();
  // champion list

  let txt = "<div class='d-flex flex-wrap justify-content-center mx-auto'>";
  for (let x in data.data) {
    let imgSrc = `http://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/${x}.png`;

    txt += `<div class="card m-2" style="width: 12rem;">`;
    txt += ` <img src="${imgSrc}" class="card-img-top" alt="...">`;
    txt += `<div class="card-body">`;
    txt += `<h5 class="card-title">${data.data[x].name}</h5>`;
    txt += `<p class="card-text">${data.data[x].title}</p>`;
    txt += `</div></div>`;
  }
  txt += `</div>`;
  document.getElementById("champions").innerHTML = txt;
}

//search champions
function searchChampions() {
  const inputSearch = document.querySelector('input[name="inputSearch"]');
  const query = inputSearch.value.toUpperCase();
  const list = document.getElementById("champions");
  const cardh5 = list.querySelectorAll("h5");
  const card = list.querySelectorAll("div.card");

  for (i = 0; i < cardh5.length; i++) {
    cardTitle = cardh5[i].outerText;
    if (cardTitle.toUpperCase().indexOf(query) > -1) {
      card[i].style.display = "";
    } else {
      card[i].style.display = "none";
    }
  }
}

async function getSummoners() {
  const options = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9,fil;q=0.8",
      "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
      Origin: "https://developer.riotgames.com",
    },
  };
  let link = `https://na1.api.riotgames.com/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5?api_key=${riotKey}`;
  const response = await fetch(link, options);
  let data = await response.json();
  // search function

  // summoner list

  for (x = 0; x < data.entries.length; x++) {
    //console.log(data.entries[x].summonerName);
  }
  return data;
}
//console.log(getSummoners());

getSummoners();
