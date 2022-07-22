const riotKey = config.riotKey;

//populate champions
async function getChampions() {
  let link =
    "http://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/champion.json";
  const response = await fetch(link);
  let data = await response.json();

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

//leaderboard pagination
function paginationNew() {
  for (i = 1; i <= 5; i++) {
    //create li
    const newLi = document.createElement("li");
    if (i == 1) {
      newLi.classList.add("active");
    }
    newLi.classList.add("page-item");
    //create a
    const a = document.createElement("a");
    const textNode = document.createTextNode(i);
    a.appendChild(textNode);
    a.classList.add("page-link");
    a.href = "#";
    a.setAttribute(
      "onclick",
      `getLeaderboard(getLeaderboard( document.getElementById(server).value, ${i})`
    );
    //insert a to li
    newLi.appendChild(a);
    //insert li>a to pagination
    const pagination = document.getElementById("pagination");
    pagination.insertBefore(newLi, pagination.children[i]);
  }
}
paginationNew();
//search Leaderboards

//populate champions
async function getLeaderboard(server, page) {
  //change server header
  let serverHeader = "";
  switch (server) {
    case "na1":
      serverHeader = "North America";
      break;
    case "br1":
      serverHeader = "Brazil";
      break;
    case "la1":
      serverHeader = "Latin America North";
      break;
    case "la2":
      serverHeader = "Latin America South";
      break;
    case "kr":
      serverHeader = "Korea";
      break;
    case "jp1":
      serverHeader = "Japan";
      break;
    case "eun1":
      serverHeader = "Europe Nordic & East";
      break;
    case "euw1":
      serverHeader = "Europe West";
      break;
    case "tr1":
      serverHeader = "Turkey";
      break;
    case "ru":
      serverHeader = "Russia";
      break;
    case "oc1":
      serverHeader = "Oceania";
      break;
  }
  document.getElementById("serverHeader").innerText = serverHeader;

  //get leaderboard list
  let leaderboardLink = `https://${server}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${riotKey}`;
  const response = await fetch(leaderboardLink);
  const data = await response.json();
  console.log(data);
  //sort by league points from highest to lowest
  data.entries.sort((a, b) => {
    return b.leaguePoints - a.leaguePoints;
  });
  let txt = "";
  for (let i = page * 10 - 10; i < page * 10; i++) {
    let summonerLink = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/${data.entries[i].summonerId}?api_key=${riotKey}`;
    //let summonerLink = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${data.entries[i].summonerName}?api_key=${riotKey}`;
    const response2 = await fetch(summonerLink);
    const data2 = await response2.json();
    console.log(data2);
    //create table rows
    txt += "<tr>";
    txt += `<td class="text-center rank">${i + 1}</td>`;
    txt += `<td class="summonerName"><img src="http://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${data2.profileIconId}.png" width=30 height=30>`;
    txt += `<a href="summoners.html?server=${server}&puuid=${data2.puuid}">`;
    txt += `${data.entries[i].summonerName}</td>`;
    txt += `<td>${Number(data.entries[i].leaguePoints).toLocaleString()}</td>`;
    let totalMatch = data.entries[i].wins + data.entries[i].losses;
    let winrate = (data.entries[i].wins / totalMatch) * 100;
    txt += `<td>
      <div class="d-flex justify-content-center">
        <span class="winrate me-3">${winrate.toFixed()}%</span><small><muted>
        ${data.entries[i].wins}W ${data.entries[i].losses}L 
        </muted><small>
      </div>
      <div class="progress mx-md-5">
        <div class="progress-bar" 
          role="progressbar" 
          style="width: ${winrate}%;" 
          aria-valuenow="${winrate}" 
          aria-valuemin="0" 
          aria-valuemax="100"
        ></div>
      </div>
      </td>`;
    // txt += `<td>${data.entries[i].losses}</td>`;
    txt += "</tr>";
  }
  //insert data into table
  document.getElementById("summoners").innerHTML = txt;

  //change active page
  let activePage = document.querySelector("li.active");
  let newPage = document.querySelectorAll("li.page-item");
  activePage.classList.remove("active");
  newPage[page].classList.add("active");
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
