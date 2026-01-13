import { retryOperation } from "./seachApi";
const containerCards = document.querySelector(".container-cards");
const seachBarForm = document.querySelector(".searchBar");
const input = document.querySelector("#searchInput");
const spanNotFounded = document.querySelector(".alertNotFoundHidden");

const BASE_URL = "https://dragonball-api.com/api/characters?limit=10";
let currentPage = null;
let NotIsSearching = true;
let allCharacters = [];

function createElementCard(tag, attr = {}, children = []) {
  const { text, ...props } = attr;

  const element = document.createElement(tag);

  Object.entries(props).forEach((item) => {
    element.setAttribute(...item);
  });

  if (text) element.innerText = text;

  if (children) element.append(...children);
  return element;
}

async function renderCharacters(characters) {
  for (const character of characters) {
    const descriptions = [
      ["info", "base KI:"],
      ["label", character.ki],
      ["info", "Total KI:"],
      ["label", character.maxKi],
      ["info", "Afilliation"],
      ["label", character.affiliation],
    ].map(([className, text]) =>
      createElementCard("div", { class: className, text })
    );
    const labelSubtitle = createElementCard("div", {
      class: "label-subtitle",
      text: `${character.race} - ${character.gender}`,
    });
    const h1 = createElementCard("h1", {
      class: "title",
      text: character.name,
    });
    const cardTitle = createElementCard("div", { class: "card-title" }, [
      h1,
      labelSubtitle,
    ]);
    const cardInfo = createElementCard("div", { class: "card-info" }, [
      cardTitle,
      ...descriptions,
    ]);
    const img = createElementCard("img", {
      src: character.image,
      alt: "Imagem do personagem",
      class: "image",
    });

    const cardIamge = createElementCard(
      "div",
      {
        class: "card-image",
      },
      [img]
    );
    const card = createElementCard("div", { class: "card" }, [
      cardIamge,
      cardInfo,
    ]);

    containerCards.appendChild(card);
  }
}

async function fetchData(url) {
  const response = await fetch(url);
  return await response.json();
}

async function loadNextPage() {
  const url = currentPage?.links?.next || BASE_URL;
  const data = await retryOperation(() => fetchData(url), 4);
  currentPage = data;
  allCharacters = [...allCharacters, ...data.items];
  renderCharacters(data.items);
}

async function setupSearch() {
  input.addEventListener("input", (e) => {
    spanNotFounded.setAttribute("class", "alertNotFoundHidden");
    if (e.target.value === "") {
      containerCards.innerHTML = "";
      renderCharacters(allCharacters);
      NotIsSearching = true;
    }
  });
  seachBarForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const result = await searchCharacters(input.value);

    if (result.length > 0) {
      containerCards.innerHTML = "";
      renderCharacters(result);
      NotIsSearching = false;
    }

    if (result.length === 0) {
      spanNotFounded.setAttribute("class", "alertNotFoundDisplayed");
    }
  });
}

async function searchCharacters(character, url = BASE_URL) {
  const fetchItems = await retryOperation(() => fetchData(url), 4);

  let find = fetchItems.items.filter((u) =>
    u.name.toLowerCase().includes(character.toLowerCase())
  );

  if (find.length > 0) {
    return find;
  }

  if (fetchItems.links.next) {
    return searchCharacters(character, (url = fetchItems.links.next));
  }
  return [];
}

function setupInfiniteScroll() {
  window.addEventListener("scroll", async () => {
    if (NotIsSearching) {
      const atualposition = window.scrollY + window.innerHeight;

      const alturaTotal = document.documentElement.scrollHeight;

      if (atualposition >= alturaTotal && currentPage?.links?.next) {
        await loadNextPage();
      }
    }
  });
}
setupSearch();
loadNextPage();
setupInfiniteScroll();
