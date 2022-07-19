const riotKey = "RGAPI-6e871128-9830-41e2-b6c6-a834f6c13e56";

//populate champions
async function getChampions() {
  let link =
    "http://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/champion.json";
  const response = await fetch(link);
  let data = await response.json();

  //create champion cards
  let txt = "<div class='d-flex flex-wrap justify-content-start mx-auto'>";
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

  //put cards inside div
  document.getElementById("champions").innerHTML = txt;
}

//search champions
function searchChampions() {
  const inputSearch = document.querySelector('input[name="inputSearch"]');
  const query = inputSearch.value.toUpperCase();
  const list = document.getElementById("champions");
  const cardh5 = list.querySelectorAll("h5");
  const card = list.querySelectorAll("div.card");

  //search all cards for matches with search query
  //if match then show, else hide
  for (i = 0; i < cardh5.length; i++) {
    cardTitle = cardh5[i].outerText;
    if (cardTitle.toUpperCase().indexOf(query) > -1) {
      card[i].style.display = "";
    } else {
      card[i].style.display = "none";
    }
  }
}

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
    txt += `<div class="card m-2" style="width: 15rem;">`;
    txt += ` <img src="${imgSrc}" class="card-img-top" alt="...">`;
    txt += `<div class="card-body">`;
    txt += `<h5 class="card-title">${data.data[x].name}</h5>`;
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
  const cardh5 = list.querySelectorAll("h5");
  const card = list.querySelectorAll("div.card");

  //search all cards for matches with search query
  //if match then show, else hide
  for (i = 0; i < cardh5.length; i++) {
    cardTitle = cardh5[i].outerText;
    if (cardTitle.toUpperCase().indexOf(query) > -1) {
      card[i].style.display = "";
    } else {
      card[i].style.display = "none";
    }
  }
}

//search Leaderboards

//populate champions
async function getLeaderboard(server) {
  const response = await fetch(
    `https://${server}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${riotKey}`
  );
  const data = await response.json();
  console.log(data);
  //create leaderboard list

  //show range
  const end = document.getElementById("range").value;

  let txt = "<ul class='list-unstyled'>";
  //sort by league points from highest to lowest
  data.entries.sort((a, b) => {
    return b.leaguePoints - a.leaguePoints;
  });
  if (end == "0") {
    for (let i = 0; i < data.entries.length; i++) {
      txt += `
      <li onclick="getSummonerData('${server}',
      '${data.entries[i].summonerName}',
      '${data.entries[i].leaguePoints}',
      '${data.entries[i].wins}',
      '${data.entries[i].losses}',
      )">`;
      txt += `${data.entries[i].summonerName}, ${data.entries[i].leaguePoints}</li>`;
    }
  } else {
    for (let i = 0; i < end; i++) {
      txt += `
      <li onclick="getSummonerData('${server}',
      '${data.entries[i].summonerName}',
      '${data.entries[i].leaguePoints}',
      '${data.entries[i].wins}',
      '${data.entries[i].losses}',
      )">`;
      txt += `${data.entries[i].summonerName}, ${data.entries[i].leaguePoints}</li>`;
    }
  }

  txt += "</ul>";

  //put list inside div
  document.getElementById("summoners").innerHTML = txt;
}

async function getSummonerData(
  server,
  summonerName,
  leaguePoints,
  wins,
  losses
) {
  const response = await fetch(
    `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${riotKey}`
  );
  const data = await response.json();
  const puuid = data.puuid;

  const response2 = await fetch(
    `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${riotKey}`
  );
  const data2 = await response2.json();

  let txt = "";
  txt += `<img src="http://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/588.png" />`;
  txt += `<h3>${summonerName}</h3>`;
  txt += `<small>${data.summonerLevel}</small>`;
  txt += `LP: ${leaguePoints} w:${wins} l: ${losses}<br />`;
  txt += `matches:<br />`;
  txt += data2;

  document.getElementById("summonerDetails").innerHTML = txt;
  //console.log(data2);
}
