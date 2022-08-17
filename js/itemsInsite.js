const url = window.location.href.split("?");
const item = url[url.length - 1];

async function showItem() {
  let link =
    "http://ddragon.leagueoflegends.com/cdn/12.13.1/data/en_US/item.json";
  const response = await fetch(link);
  const data = await response.json();
  document.title = data.data[item].name + " | LEGEND.GG";

  console.log(data);

  //header part sa taas
  const itemHead = document.getElementById("itemHead");
  const spinner = document.querySelector("#itemHead .spinner-border");
  //hide the spinner
  spinner.setAttribute("style", "display:none");
  //create image
  const itemHeadImg = document.createElement("img");
  itemHeadImg.src = `http://ddragon.leagueoflegends.com/cdn/12.13.1/img/item/${item}.png`;
  itemHeadImg.classList.add("rounded", "border", "border-warning");
  //create h1
  const itemHeadName = document.createElement("h1");
  itemHeadName.innerText = data.data[item].name;
  itemHeadName.classList.add("px-3");
  //append new elements to div
  itemHead.appendChild(itemHeadImg);
  itemHead.appendChild(itemHeadName);

  //item stats sa left part
  const sidebarLeft = document.getElementById("sidebarLeft");
  const spinnerLeft = document.querySelector("#sidebarLeft .spinner-border");
  //hide the spinner
  spinnerLeft.setAttribute("style", "display:none");
  //create h2
  const leftGoldTitle = document.createElement("h2");
  leftGoldTitle.innerHTML = "Cost Analysis: ";
  //create p
  const leftGoldtext = document.createElement("p");
  leftGoldtext.innerHTML =
    "Base: " +
    data.data[item].gold.base +
    "<br /> " +
    "Purchasable: " +
    data.data[item].gold.purchasable +
    "<br /> " +
    "Sell: " +
    data.data[item].gold.sell +
    "<br /> " +
    "Total: " +
    data.data[item].gold.total;
  //create h2
  const leftPlainTitle = document.createElement("h2");
  leftPlainTitle.innerHTML = "Description: ";
  //create p
  const leftPlaintext = document.createElement("p");
  leftPlaintext.innerHTML = data.data[item].plaintext;
  //append elements
  sidebarLeft.appendChild(leftGoldTitle);
  sidebarLeft.appendChild(leftGoldtext);
  sidebarLeft.appendChild(leftPlainTitle);
  sidebarLeft.appendChild(leftPlaintext);

  //item desc sa right part
  const sidebarRight = document.getElementById("sidebarRight");
  const spinnerRight = document.querySelector("#sidebarRight .spinner-border");
  //hide the spinner
  spinnerRight.setAttribute("style", "display:none");
  //create h2
  const rightDescTitle = document.createElement("h2");
  rightDescTitle.innerHTML = "Item Stats:  ";
  //create p
  const rightDesc = document.createElement("p");
  rightDesc.innerHTML = data.data[item].description;
  console.log(data.data[item].description);

  //append new elements to div
  sidebarRight.appendChild(rightDescTitle);
  sidebarRight.appendChild(rightDesc);

  //upgrade sa gitna part
  //const treeMid = document.getElementById("treeWrapper");
  const spinnerMid = document.querySelector("#treeWrapper .spinner-border");
  //hide the spinner
  spinnerMid.setAttribute("style", "display:none");

  const tree = document.getElementById("tree");

  //if item has upgrade from
  if (data.data[item].hasOwnProperty("from")) {
    //create h2
    const treeTitle = document.createElement("h2");
    treeTitle.innerHTML = "Recipe:  ";
    //create base item img
    const baseItemUl = document.createElement("ul");
    const baseItemLi = document.createElement("li");
    const baseItemImg = document.createElement("img");
    const imgLink = "http://ddragon.leagueoflegends.com/cdn/12.13.1/img/item/";
    baseItemImg.src = imgLink + data.data[item].image.full;
    baseItemImg.width = 50;
    //add tooltip
    baseItemImg.setAttribute("data-bs-toggle", "tooltip");
    baseItemImg.setAttribute("data-bs-title", data.data[item].name);
    baseItemImg.setAttribute("data-bs-placement", "top");
    baseItemLi.appendChild(baseItemImg);
    const upgradeFrom = data.data[item].from;
    const upgradeFromUl = document.createElement("ul");
    for (x of upgradeFrom) {
      upgradeFromUl.innerHTML += `<li><a href="insiteitem.html?${x}">
        <img src="${imgLink + x}.png" 
        data-bs-toggle = "tooltip"
        data-bs-title = "${data.data[x].name}"
        data-bs-placement = "top"
        width=30
        ></a></li>`;
      baseItemLi.appendChild(upgradeFromUl);
      baseItemUl.appendChild(baseItemLi);
      tree.appendChild(treeTitle);
      tree.appendChild(baseItemUl);
      baseItemUl.classList.add("pb-5");
    }
  }

  //if item has an upgrade
  if (data.data[item].hasOwnProperty("into")) {
    //create h2
    const treeTitle = document.createElement("h2");
    treeTitle.innerHTML = "Upgrades To:  ";
    //create base item img
    const baseItemUl = document.createElement("ul");
    const baseItemLi = document.createElement("li");
    const baseItemImg = document.createElement("img");
    const imgLink = "http://ddragon.leagueoflegends.com/cdn/12.13.1/img/item/";
    baseItemImg.src = imgLink + data.data[item].image.full;
    baseItemImg.width = 50;
    //add tooltip
    baseItemImg.setAttribute("data-bs-toggle", "tooltip");
    baseItemImg.setAttribute("data-bs-title", data.data[item].name);
    baseItemImg.setAttribute("data-bs-placement", "top");
    baseItemLi.appendChild(baseItemImg);
    const upgradeInto = data.data[item].into;
    const upgradeItemUl = document.createElement("ul");
    for (x of upgradeInto) {
      upgradeItemUl.innerHTML += `<li><a href="insiteitem.html?${x}">
        <img src="${imgLink + x}.png" 
        data-bs-toggle = "tooltip"
        data-bs-title = "${data.data[x].name}"
        data-bs-placement = "top"
        width=30
        ></a></li>`;
    }
    baseItemLi.appendChild(upgradeItemUl);
    baseItemUl.appendChild(baseItemLi);
    tree.appendChild(treeTitle);
    tree.appendChild(baseItemUl);
  }

  //initialize tooltips
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
}
showItem();
