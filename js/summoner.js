const riotKey = config.riotKey;
const url = window.location.href.split("?");
const query = url[1];
const params = query.split("&");
const server = params[1].split("=")[1];
const summonerName = params[2].split("=")[1];
let region = "";
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

async function profile() {
  //summoner v4  by summ name to get puuid
  let link1 = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${riotKey}`;
  const response1 = await fetch(link1);
  const data1 = await response1.json();
  console.log(data1);

  //league v4 by summ ID to get rank
  let link2 = `https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${data1.id}?api_key=${riotKey}`;
  const response2 = await fetch(link2);
  const data2 = await response2.json();
  //console.log(data1.puuid);
  //pfp
  document.getElementById(
    "pfp"
  ).src = `https://ddragon.leagueoflegends.com/cdn/12.13.1/img/profileicon/${data1.profileIconId}.png`;
  //summoner name
  document.getElementById("summName").innerText = data1.name;
  //tier icon if if later na
  document.getElementById(
    "rankIcon"
  ).src = `media/img/base-icons/${data2[0].tier.toLowerCase()}.png`;
  let spinner = document.getElementsByClassName("spinner-border");

  //summ stats
  let summStats = "";
  summStats += `<p class="m-0">${data2[0].tier} | ${data2[0].leaguePoints} LP</p>`;
  summStats += `<small>${data2[0].wins} wins | ${data2[0].losses} losses</small>`;
  document.getElementById("summStats").innerHTML = summStats;
  bestChamps(data1.id);
  matchHistory(data1.puuid);
}
profile();

async function bestChamps(summonerId) {
  //Get all champion mastery entries sorted by number of champion points descending,
  let link = `https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}?api_key=${riotKey}`;
  const response = await fetch(link);
  const data = await response.json();
  //sort by champion points
  data.sort((a, b) => {
    return b.championPoints - a.championPoints;
  });

  //get all champions
  let link2 =
    "http://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/champion.json";
  const response2 = await fetch(link2);
  const data2 = await response2.json();

  let result = data2.data;
  let txt = "<h3 class='text-center'>Best Champions</h3>";
  //get top 10 entries
  let img = "";
  let imgBanner = ""; //top hero's name for the banner
  for (i = 0; i < 10; i++) {
    for (const champs in result) {
      if (data[i].championId == result[champs].key) {
        let img = result[champs].name;
        let imgSplit = "";
        if (img.indexOf(" ") >= 0) {
          imgSplit = img.split(" ");
          imgSrc = imgSplit[0] + imgSplit[1];
        } else if (img.indexOf("'") >= 0) {
          imgSplit = img.split("'");
          imgSrc = imgSplit[0] + imgSplit[1];
        } else {
          imgSrc = img;
        }
        console.log(imgSrc);

        txt += `<img 
        src="http://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/${imgSrc}.png" 
        width='30'
        height='30'
        />`;
        txt += `<span class="champName">` + result[champs].name + "</span> - ";
        txt += "Level: " + data[i].championLevel;
        txt += " pts: " + data[i].championPoints;
        txt += "<br />";
        if (i == 0) {
          imgBanner = result[champs].name;
        }
      }
    }
  }
  document.getElementById("bestChamps").innerHTML = txt;

  document.getElementById("profile").setAttribute(
    "style",
    `background-image: 
    linear-gradient(to right top, 
      #d16ba5ff, 
      #c777b9ee, 
      #ba83cadd, 
      #aa8fd8dd, 
      #9a9ae1cc, 
      #8aa7eccc, 
      #79b3f4bb, 
      #69bff8bb, 
      #52cffeaa, 
      #41dfffaa, 
      #46eefaaa, 
      #5ffbf1aa     
      ), url("https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${imgBanner}_0.jpg")`
  );

  document.getElementById("bestChamps").innerHTML = txt;
}

async function matchHistory(puuid) {
  //Get a list of match ids by puuid
  let link = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${riotKey}`;
  const response = await fetch(link);
  const matchList = await response.json();

  for (x of matchList) {
    //Get a list of match ids by puuid
    let link2 = `https://${region}.api.riotgames.com/lol/match/v5/matches/${x}/?api_key=${riotKey}`;
    const response2 = await fetch(link2);
    const matchData = await response2.json();

    //remove loading gif
    document
      .getElementById("loadingGif")
      .setAttribute("style", "display: none");
    //match history wrapper
    const matchHistory = document.getElementById("matchHistory");
    //per match wrapper
    const wrapper = document.createElement("div");
    wrapper.classList.add(
      "d-flex",
      "flex-row",
      "justify-content-evenly",
      "align-items-center",
      "mb-3",
      "p-3",
      "rounded"
    );
    matchHistory.appendChild(wrapper);

    //player icon
    const playerIcon = document.createElement("img");
    playerIcon.width = 100;
    playerIcon.height = 100;

    //match info
    const matchInfo = document.createElement("div");
    matchInfo.classList.add("d-flex", "flex-column");
    const gameMode = document.createElement("span");
    gameMode.innerText = matchData.info.gameMode;
    const gameCreation = document.createElement("span");
    gameCreation.innerText = new Date(
      matchData.info.gameCreation
    ).toLocaleDateString("en-US");
    matchInfo.appendChild(gameMode);
    matchInfo.appendChild(gameCreation);

    //append elements into div
    wrapper.appendChild(playerIcon);
    wrapper.appendChild(matchInfo);

    //win or lose
    const winLoseWrapper = document.createElement("span");
    const winLose = document.createElement("span");

    for (let x in matchData.info.participants) {
      //get match details of player
      let player = matchData.info.participants[x];

      if (
        player.summonerName == document.getElementById("summName").innerText
      ) {
        let img = matchData.info.participants[x].championName;
        playerIcon.src = `http://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/${img
          .split(" ")
          .join("")}.png`;
        let team = player.teamId;
        //victory or defeat
        for (const x of matchData.info.teams) {
          if (x.teamId == team) {
            if (x.win) {
              winLose.innerText = "VICTORY";
              wrapper.classList.add({'color: blue'});
            } else {
              wrapper.classList.add("bg-danger");
              winLose.innerText = "DEFEAT";
            }
          }
        }
        winLoseWrapper.appendChild(winLose);
        wrapper.appendChild(winLoseWrapper);
        // txt += "<br /> " + player.summonerName;
        // txt += "<br />" + player.championName;
        //kda
        const kda = document.createElement("div");
        kda.innerText += player.kills + "/";
        kda.innerText += player.deaths + "/";
        kda.innerText += player.assists + "/";
        winLoseWrapper.appendChild(kda);

        //items
        const itemsWrapper = document.createElement("div");
        const itemsTop = document.createElement("div");
        itemsTop.classList.add("text-start");
        const itemsBottom = document.createElement("div");
        itemsBottom.classList.add("text-start");
        itemsWrapper.appendChild(itemsTop);
        itemsWrapper.appendChild(itemsBottom);
        wrapper.appendChild(itemsWrapper);
        let link = `http://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/item.json`;
        const response = await fetch(link);
        const data = await response.json();

        let itemLink =
          "http://ddragon.leagueoflegends.com/cdn/12.13.1/img/item/";
        //individual items
        if (player.item0 !== 0) {
          const img = document.createElement("img");
          img.src = itemLink + player.item0 + ".png";
          img.height = 20;
          img.width = 20;
          img.setAttribute("data-bs-toggle", "tooltip");
          img.setAttribute("data-bs-title", data.data[player.item0].name);
          img.setAttribute("data-bs-placement", "top");
          const a = document.createElement("a");
          a.href = "insiteitem.html?" + player.item0;
          a.appendChild(img);
          itemsTop.appendChild(a);
        }
        if (player.item1 !== 0) {
          const img = document.createElement("img");
          img.src = itemLink + player.item1 + ".png";
          img.height = 20;
          img.width = 20;
          img.setAttribute("data-bs-toggle", "tooltip");
          img.setAttribute("data-bs-title", data.data[player.item1].name);
          img.setAttribute("data-bs-placement", "top");
          const a = document.createElement("a");
          a.href = "insiteitem.html?" + player.item1;
          a.appendChild(img);
          itemsTop.appendChild(a);
        }
        if (player.item2 !== 0) {
          const img = document.createElement("img");
          img.src = itemLink + player.item2 + ".png";
          img.height = 20;
          img.width = 20;
          img.setAttribute("data-bs-toggle", "tooltip");
          img.setAttribute("data-bs-title", data.data[player.item2].name);
          img.setAttribute("data-bs-placement", "top");
          const a = document.createElement("a");
          a.href = "insiteitem.html?" + player.item2;
          a.appendChild(img);
          itemsTop.appendChild(a);
        }
        if (player.item3 !== 0) {
          const img = document.createElement("img");
          img.src = itemLink + player.item3 + ".png";
          img.height = 20;
          img.width = 20;
          img.setAttribute("data-bs-toggle", "tooltip");
          img.setAttribute("data-bs-title", data.data[player.item3].name);
          img.setAttribute("data-bs-placement", "top");
          const a = document.createElement("a");
          a.href = "insiteitem.html?" + player.item3;
          a.appendChild(img);
          itemsTop.appendChild(a);
        }
        if (player.item4 !== 0) {
          const img = document.createElement("img");
          img.src = itemLink + player.item4 + ".png";
          img.height = 20;
          img.width = 20;
          img.setAttribute("data-bs-toggle", "tooltip");
          img.setAttribute("data-bs-title", data.data[player.item4].name);
          img.setAttribute("data-bs-placement", "top");
          const a = document.createElement("a");
          a.href = "insiteitem.html?" + player.item4;
          a.appendChild(img);
          itemsBottom.appendChild(a);
        }
        if (player.item5 !== 0) {
          const img = document.createElement("img");
          img.src = itemLink + player.item5 + ".png";
          img.height = 20;
          img.width = 20;
          img.setAttribute("data-bs-toggle", "tooltip");
          img.setAttribute("data-bs-title", data.data[player.item5].name);
          img.setAttribute("data-bs-placement", "top");
          const a = document.createElement("a");
          a.href = "insiteitem.html?" + player.item5;
          a.appendChild(img);
          itemsBottom.appendChild(a);
        }
        if (player.item6 !== 0) {
          const img = document.createElement("img");
          img.src = itemLink + player.item6 + ".png";
          img.height = 20;
          img.width = 20;
          img.setAttribute("data-bs-toggle", "tooltip");
          img.setAttribute("data-bs-title", data.data[player.item6].name);
          img.setAttribute("data-bs-placement", "top");
          const a = document.createElement("a");
          a.href = "insiteitem.html?" + player.item6;
          a.appendChild(img);
          itemsBottom.appendChild(a);
        }
      }
    }

    //team 1
    const team1 = document.createElement("div");
    team1.classList.add("team1", "d-flex", "flex-column", "text-start");

    if (matchData.info.teams[0].win == true) {
      team1.append("win");
    } else {
      team1.append("lose");
    }
    for (let x in matchData.info.participants) {
      const players = document.createElement("span");
      if (matchData.info.participants[x].teamId == 100) {
        let img = matchData.info.participants[x].championName;
        const playersImg = document.createElement("img");
        playersImg.src = `http://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/${img
          .split(" ")
          .join("")}.png`;
        playersImg.width = 20;
        playersImg.height = 20;
        const playersName = document.createElement("a");
        playersName.innerHTML = matchData.info.participants[x].summonerName;
        players.appendChild(playersImg);
        players.appendChild(playersName);
      }
      team1.appendChild(players);
    }
    wrapper.appendChild(team1);

    //team 2
    const team2 = document.createElement("div");
    team2.classList.add("team2", "d-flex", "flex-column", "text-start");

    if (matchData.info.teams[1].win) {
      team2.append("win");
    } else {
      team2.append("lose");
    }
    for (let x in matchData.info.participants) {
      const players = document.createElement("span");
      if (matchData.info.participants[x].teamId == 200) {
        let img = matchData.info.participants[x].championName;
        const playersImg = document.createElement("img");
        playersImg.src = `http://ddragon.leagueoflegends.com/cdn/12.13.1/img/champion/${img
          .split(" ")
          .join("")}.png`;
        playersImg.width = 20;
        playersImg.height = 20;
        const playersName = document.createElement("a");
        playersName.innerHTML = matchData.info.participants[x].summonerName;
        players.appendChild(playersImg);
        players.appendChild(playersName);
      }
      team2.appendChild(players);
    }
    wrapper.appendChild(team2);
  }
  //initialize tooltips
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
}
