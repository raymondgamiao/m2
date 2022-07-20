const riotKey = config.riotKey;

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
  //create leaderboard list

  //show range
  const end = document.getElementById("range").value;

  let txt = "";
  //sort by league points from highest to lowest
  data.entries.sort((a, b) => {
    return b.leaguePoints - a.leaguePoints;
  });
  for (let i = 0; i < end; i++) {
    const response = await fetch(
      `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${data.entries[i].summonerName}?api_key=${riotKey}`
    );
    const data2 = await response.json();
    // console.log(data2);
    txt += "<tr>";
    txt += `<td>${i + 1}</td>`;
    txt += `<td><img src="http://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${data2.profileIconId}.png" width=30 height=30>`;
    txt += `<a href="summoners.html?server=${server}&puuid=${data2.puuid}">`;
    txt += `${data.entries[i].summonerName}</td>`;
    txt += `<td>${data.entries[i].leaguePoints}</td>`;
    txt += `<td>${data.entries[i].wins}</td>`;
    txt += `<td>${data.entries[i].losses}</td>`;
    txt += "</tr>";
  }

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
  //AMERICAS routing value serves NA, BR, LAN and LAS
  // ASIA routing value serves KR and JP.
  //EUROPE routing value serves EUNE, EUW, TR, and RU
  //SEA routing value serves OCE.
  let region;
  switch (server) {
    case "na1":
    case "br1":
    case "la1":
    case "la2":
      region = "americas";
      break;
    case "kr":
    case "jp1":
      region = "asia";
      break;
    case "eun1":
    case "euw1":
    case "tr1":
    case "ru":
      region = "europe";
      break;
    case "oc1":
      region = "sea";
      break;
  }
  const response2 = await fetch(
    `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${riotKey}`
  );
  const data2 = await response2.json();

  let txt = "";
  txt += `<img src="http://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${data.profileIconId}.png" />`;
  txt += `<h3>${summonerName}</h3>`;
  txt += `<small>Level: ${data.summonerLevel}<br>`;
  txt += `LP: ${leaguePoints} wins:${wins} losses: ${losses}<br />`;
  txt += `matches:<br /></small>`;

  for (let x in data2) {
    txt += data2[x] + "<br />";
  }

  document.getElementById("summonerDetails").innerHTML = txt;
}
