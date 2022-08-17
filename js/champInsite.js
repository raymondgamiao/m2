const url = window.location.href.split("?");
const champ = url[url.length - 1];

async function showChamp() {
  let link = `http://ddragon.leagueoflegends.com/cdn/12.14.1/data/en_US/champion/${champ}.json`;
  const response = await fetch(link);
  const data = await response.json();
  console.log(data);

  document.title = champ + " | LEGEND.GG";

  //replace placeholders
  //hero section
  document.getElementById("champTitle").innerText = data.data[champ].title;
  document.getElementById("champName").innerText = data.data[champ].name;
  const imgLink = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ}_0.jpg`;
  document
    .getElementById("cover")
    .setAttribute("style", `background-image: url(${imgLink})`);
  document
    .getElementById("home")
    .setAttribute("style", `background-image: url(${imgLink})`);
  //stats
  document.getElementById("diff").innerText = data.data[champ].info.difficulty;
  document.getElementById("attack").innerText = data.data[champ].info.attack;
  document.getElementById("def").innerText = data.data[champ].info.defense;
  document.getElementById("magic").innerText = data.data[champ].info.magic;
  document.getElementById("hp").innerText = data.data[champ].stats.hp;
  document.getElementById("lore").innerText = data.data[champ].lore;
  //skils
  const passiveImgLink = `http://ddragon.leagueoflegends.com/cdn/12.14.1/img/passive/${data.data[champ].passive.image.full}`;
  document.getElementById("passiveImg").src = passiveImgLink;
  document.getElementById("passive").innerText = data.data[champ].passive.name;
  document.getElementById("passiveDesc").innerText =
    data.data[champ].passive.description;

  const qImgLink = `http://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/${data.data[champ].spells[0].image.full}`;
  document.getElementById("qImg").src = qImgLink;
  document.getElementById("q").innerText = data.data[champ].spells[0].name;
  document.getElementById("qDesc").innerText =
    data.data[champ].spells[0].description;

  const wImgLink = `http://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/${data.data[champ].spells[1].image.full}`;
  document.getElementById("wImg").src = wImgLink;
  document.getElementById("w").innerText = data.data[champ].spells[1].name;
  document.getElementById("wDesc").innerText =
    data.data[champ].spells[1].description;

  const eImgLink = `http://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/${data.data[champ].spells[2].image.full}`;
  document.getElementById("eImg").src = eImgLink;
  document.getElementById("e").innerText = data.data[champ].spells[2].name;
  document.getElementById("eDesc").innerText =
    data.data[champ].spells[2].description;

  const rImgLink = `http://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/${data.data[champ].spells[3].image.full}`;
  document.getElementById("rImg").src = rImgLink;
  document.getElementById("r").innerText = data.data[champ].spells[3].name;
  document.getElementById("rDesc").innerText =
    data.data[champ].spells[3].description;

  //skins
  const slideWrapper = document.getElementById("skinsInner");

  const skinImgLink =
    "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/";
  for (x of data.data[champ].skins) {
    let slide = document.createElement("div");
    slide.classList.add("carousel-item");
    if (x.num == 0) {
      slide.classList.add("active");
    }
    slide.setAttribute("data-bs-interval", "10000");
    let slideImg = document.createElement("img");
    slideImg.src = skinImgLink + champ + "_" + x.num + ".jpg";
    slideImg.classList.add("d-block", "w-100");
    let slideCaptionWrap = document.createElement("div");
    slideCaptionWrap.classList.add(
      "carousel-caption",
      "d-none",
      "d-md-block",
      "text-white-50"
    );
    let slideCaption = document.createElement("h5");
    slideCaption.classList.add("carousel-title");
    slideCaption.innerText = x.name;

    slideWrapper.appendChild(slide);
    slide.appendChild(slideImg);
    slide.appendChild(slideCaptionWrap);
    slideCaptionWrap.appendChild(slideCaption);
  }
  //initialize tooltips
  /*    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    ); */
}
showChamp();
