const riotKey = config.riotKey;
const url = window.location.href.split("?");
const query = url[url.length - 1];
const params = query.split("&");
const server = params[1].split("=")[1];
const summonerName = params[2].split("=")[1];
const summonerId = params[3].split("=")[1];
const puuid = params[4].split("=")[1];

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
  //summoner v4  by summ ID to get puuid

  //https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/MU%20APA?api_key=RGAPI-8a8f861a-2101-42bf-b3f7-9e7a199e41ce
  let link1 = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${riotKey}`;
  const response1 = await fetch(link1);
  const data1 = await response1.json();

  //league v4 by summ ID to get rank
  let link2 = `https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${riotKey}`;
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
  summStats += `<h4>${data2[0].tier} | ${data2[0].leaguePoints} LP</h4>`;
  summStats += `<h5>${data2[0].wins} wins | ${data2[0].losses} losses</h5>`;
  document.getElementById("summStats").innerHTML = summStats;
}
profile();

async function bestChamps() {
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
  let txt = "<h3>Best Champions</h3>";
  //get top 10 entries
  for (i = 0; i < 10; i++) {
    for (const champs in result) {
      if (data[i].championId == result[champs].key) {
        txt += result[champs].name + " - ";
        txt += "Level: " + data[i].championLevel;
        txt += " pts: " + data[i].championPoints;
        txt += "<br />";
      }
    }
  }
  document.getElementById("bestChamps").innerHTML = txt;
}
bestChamps();

async function matchHistory() {
  //Get a list of match ids by puuid
  let link = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=5&api_key=${riotKey}`;
  const response = await fetch(link);
  const matchList = await response.json();

  let txt = "<h3>Match History</h3>";
  for (x of matchList) {
    //Get a list of match ids by puuid
    let link2 = `https://${region}.api.riotgames.com/lol/match/v5/matches/${x}/?api_key=${riotKey}`;
    const response2 = await fetch(link2);
    const matchData = await response2.json();

    txt += matchData.info.gameMode + ", ";
    txt += new Date(matchData.info.gameCreation).toLocaleDateString("en-US"); //date
    for (let x in matchData.info.participants) {
      //get match details of player
      let player = matchData.info.participants[x];
      if (
        player.summonerName == document.getElementById("summName").innerText
      ) {
        let team = player.teamId;
        for (const x of matchData.info.teams) {
          if (x.teamId == team) {
            if (x.win) {
              txt += " player won";
            } else {
              txt += " player lost";
            }
          }
        }

        txt += "<br /> " + player.summonerName;
        txt += "<br />" + player.championName;
        txt += "<br />kda: ";
        txt += player.kills + "/";
        txt += player.deaths + "/";
        txt += player.assists + "<br />";
        let itemLink =
          "http://ddragon.leagueoflegends.com/cdn/12.13.1/img/item/";
        if (player.item0 !== 0) {
          txt += `<img src="${itemLink + player.item0}.png" />`;
        }
        if (player.item1 !== 0) {
          txt += `<img src="${itemLink + player.item1}.png" />`;
        }
        if (player.item2 !== 0) {
          txt += `<img src="${itemLink + player.item2}.png" />`;
        }
        if (player.item3 !== 0) {
          txt += `<img src="${itemLink + player.item3}.png" />`;
        }
        if (player.item4 !== 0) {
          txt += `<img src="${itemLink + player.item4}.png" />`;
        }
        if (player.item5 !== 0) {
          txt += `<img src="${itemLink + player.item5}.png" />`;
        }
        if (player.item6 !== 0) {
          txt += `<img src="${itemLink + player.item6}.png" />`;
        }

        txt += "<br /><br />";
      }
    }
    //if team 1
    txt += " team 1: ";
    console.log(matchData.info);
    if (matchData.info.teams[0].win) {
      txt += "win";
    } else {
      txt += "lose";
    }
    for (let x in matchData.info.participants) {
      if (matchData.info.participants[x].teamId == 100) {
        txt += "<br />" + matchData.info.participants[x].championName;
        txt += " " + matchData.info.participants[x].summonerName;
      }
    }
    txt += "<br/><br/>";
    //if team 2
    txt += " team 2:";

    if (matchData.info.teams[1].win) {
      txt += "win";
    } else {
      txt += "lose";
    }

    for (let x in matchData.info.participants) {
      if (matchData.info.participants[x].teamId == 200) {
        txt += "<br />" + matchData.info.participants[x].championName;
        txt += " " + matchData.info.participants[x].summonerName;
      }
    }
    txt += "<br/><br/><br/>";
  }

  document.getElementById("matchHistory").innerHTML = txt;
  //get Get a match by match id
  /*  let link2 =
    "http://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/champion.json";
  const response2 = await fetch(link2);
  const data2 = await response2.json();
 */
}

//https://americas.api.riotgames.com/lol/match/v5/matches/NA1_4381415328?api_key=RGAPI-8a8f861a-2101-42bf-b3f7-9e7a199e41ce
matchHistory();
