const riotKey = config.riotKey;
window.onload = paginationNew();
window.onload = getLeaderboard("na1", 1);

//pagination
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
      `getLeaderboard(document.getElementById('server').value, ${i})`
    );
    //insert a to li
    newLi.appendChild(a);
    //insert li>a to pagination after the << button
    const pagination = document.getElementById("pagination");
    pagination.insertBefore(newLi, pagination.children[i]);
  }
}

async function getLeaderboard(server, page) {
  //change server header
  let serverHeader = "";
  let region = "";
  switch (server) {
    case "na1":
      serverHeader = "North America";
      region = "americas";
      break;
    case "br1":
      serverHeader = "Brazil";
      region = "americas";
      break;
    case "la1":
      serverHeader = "Latin America North";
      region = "americas";
      break;
    case "la2":
      serverHeader = "Latin America South";
      region = "americas";
      break;
    case "kr":
      serverHeader = "Korea";
      region = "asia";
      break;
    case "jp1":
      serverHeader = "Japan";
      region = "asia";
      break;
    case "eun1":
      serverHeader = "Europe Nordic & East";
      region = "europe";
      break;
    case "euw1":
      serverHeader = "Europe West";
      region = "europe";
      break;
    case "tr1":
      serverHeader = "Turkey";
      region = "europe";
      break;
    case "ru":
      serverHeader = "Russia";
      region = "europe";
      break;
    case "oc1":
      serverHeader = "Oceania";
      region = "sea";
      break;
  }
  document.getElementById("serverHeader").innerText = serverHeader;

  //show spinner while loading
  let loader = `
    <tr>
      <td colspan="4" class="text-center">
        <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
      </td>
    </tr>
    `;
  document.getElementById("summoners").innerHTML = loader;

  let leaderboardLink = `https://${server}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${riotKey}`;
  const response = await fetch(leaderboardLink, {
      headers: {
      'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
      },
    });
  const data = await response.json();
  console.log(data);
  const searchResult = document.querySelector("#searchResultWrap ul");
  for (x of data.entries) {
    searchResult.innerHTML += `<a href="summoners.html?&server=${server}&name=${x.summonerName}"><li class="searchResult">${x.summonerName}</li></a>`;
  }
  //sort by league points from highest to lowest
  data.entries.sort((a, b) => {
    return b.leaguePoints - a.leaguePoints;
  });
  let txt = "";
  for (let i = page * 10 - 10; i < page * 10; i++) {
    let summonerLink = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/${data.entries[i].summonerId}?api_key=${riotKey}`;
    const response2 = await fetch(summonerLink);
    const data2 = await response2.json();
    //console.log(data2);
    //create table rows
    let totalMatch = data.entries[i].wins + data.entries[i].losses;
    let winrate = (data.entries[i].wins / totalMatch) * 100;
    txt += `
    <tr class='rounded'>
        <td class="text-center rank rounded-start">${i + 1}</td>
        <td class="summonerName">
            <img 
              src="http://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${
                data2.profileIconId
              }.png" 
              width=30 
              height=30>`;
    txt += `<a href="summoners.html?&server=${server}&name=${data.entries[i].summonerName}">`;
    txt += `${data.entries[i].summonerName}
              </a>
        </td>
        <td>${Number(data.entries[i].leaguePoints).toLocaleString()}</td>
        <td class="rounded-end">
            <div class="d-flex justify-content-center">
                <span class="winrate me-3">${winrate.toFixed()}%</span>              
                <span class="winsLoss">
                    ${data.entries[i].wins}W ${data.entries[i].losses}L 
                </span>           
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
        </td>
    </tr>
    `;
  }
  //insert data into table
  document.getElementById("summoners").innerHTML = txt;
}

function searchSummoner() {
  const userInput = document.getElementById("userInput");
  const query = userInput.value.toUpperCase();
  const list = document.getElementById("searchResult");
  const summoners = list.querySelectorAll(".searchResult");

  if (query.length > 0) {
    list.style.display = "";
  } else {
    list.style.display = "none";
  }

  //search all cards for matches with search query
  //if match then show, else hide
  for (i = 0; i < summoners.length; i++) {
    let champName = summoners[i].innerText;
    if (champName.toUpperCase().indexOf(query) > -1) {
      // summoners[i].style.display = "";
      summoners[i].classList.add("visible");
      summoners[i].classList.remove("hidden");
    } else {
      // summoners[i].style.display = "none";
      summoners[i].classList.add("hidden");
      summoners[i].classList.remove("visible");
    }
  }

  //search visible
  const visible = list.querySelectorAll(".visible");
  const noResultItem = document.querySelector(".noResult");

  //if everything is hidden, show "no result"
  if (visible.length == 0) {
    noResultItem.setAttribute("style", "display:block");
    //    noResultItem.classList.add("visible");
    //    noResultItem.classList.remove("hidden");
  } else {
    noResultItem.setAttribute("style", "display:hidden");
    //    noResultItem.classList.add("hidden");
    //    noResultItem.classList.remove("visible");
  }
}
