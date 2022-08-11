let query = "Champion";
let server = "na1";
const riotKey = config.riotKey;

async function populate() {
  let link = "";
  if (query == "Summoner") {
    link = `https://${server}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${riotKey}`;
  } else if (query == "Item") {
    link =
      "http://ddragon.leagueoflegends.com/cdn/12.15.1/data/en_US/item.json";
  } else {
    link =
      "http://ddragon.leagueoflegends.com/cdn/12.15.1/data/en_US/champion.json";
  }

  const response = await fetch(link);
  const data = await response.json();

  const searchResult = document.querySelector("#infoSearch ul");
  let txt = "";

  if (query == "Summoner") {
    for (x of data.entries) {
      txt += `<a href="summoners.html?&server=${server}&name=${x.summonerName}"><li class="searchResult">${x.summonerName}</li></a>`;
    }
  } else if (query == "Item") {
    var keyNames = Object.keys(data.data);
    let count = 0;
    for (x in data.data) {
      txt += `<a href="insiteItem.html?${keyNames[count]}"><li class="searchResult">${data.data[x].name}</li></a>`;
      count++;
    }
  } else {
    var keyNames = Object.keys(data.data);

    let count = 0;
    for (x in data.data) {
      txt += `<a href="insiteChamp.html?${keyNames[count]}"><li class="searchResult">${data.data[x].name}</li></a>`;
      count++;
    }
  }
  searchResult.innerHTML = txt;
}
populate();
//code ni matt sa dropdown
$(".default_option").click(function () {
  $(".dropdown ul").addClass("active");
});

$(".dropdown ul li").click(function () {
  var text = $(this).text();
  query = text;
  $(".default_option").text(text);
  $(".dropdown ul").removeClass("active");
  populate();
});

//set active server
$(".searchRegion button").on("click", function () {
  $(".searchRegion button").removeClass("selected");
  $(this).addClass("selected");
  server = this.value;
  populate();
});

function search() {
  const userInput = document.getElementById("userInput");
  const query = userInput.value.toUpperCase();
  const list = document.getElementById("infoSearch");
  const result = list.querySelectorAll(".searchResult");

  if (query.length > 0) {
    list.style.display = "";
  } else {
    list.style.display = "none";
  }

  //search all cards for matches with search query
  //if match then show, else hide
  for (i = 0; i < result.length; i++) {
    let champName = result[i].innerText;
    if (champName.toUpperCase().indexOf(query) > -1) {
      // summoners[i].style.display = "";
      result[i].classList.add("visible");
      result[i].classList.remove("hidden");
    } else {
      // summoners[i].style.display = "none";
      result[i].classList.add("hidden");
      result[i].classList.remove("visible");
    }
  }

  //create no result element
  /*   let noResult = document.createElement("li");
  noResult.innerText = "No result";
  noResult.classList.add("noResult", "hidden");
  list.append(noResult);
 */
  //search visible
  const visible = list.querySelectorAll(".visible");
  const noResultItem = document.querySelector(".noResult");
  console.log(noResultItem);

  //if everything is hidden, show "no result"
  if (visible.length == 0) {
    noResultItem.classList.add("visible");
    noResultItem.classList.remove("hidden");
  } else {
    noResultItem.classList.add("hidden");
    noResultItem.classList.remove("visible");
  }
}
