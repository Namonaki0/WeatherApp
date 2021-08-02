import { apiKey } from "./key.js";
import { localStorageSave } from "./localStorage.js";

const output = document.getElementById("output");
const searchField = document.querySelector("#search");
const findBtn = document.querySelector("#find");
const key = apiKey;
let chosenCity = `London`;

// localStorage.clear();

console.log(localStorage);

//? DOCUMENT LOADS ALL LINKS
document.addEventListener("DOMContentLoaded", citySelection);

function citySelection() {
  const cityLinks = document.querySelectorAll("[data-city]");

  function cityInfo() {
    chosenCity = this.dataset.target;
    citiesMenu.classList.remove("active");
    menuIcon.style.display = "";
    fetchCity();
  }
  cityLinks.forEach((city) => {
    city.addEventListener("click", cityInfo);
  });
}

//? ENTER BUTTON SEARCH
searchField.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    findBtn.click();
  }
});

//? MENU CITY SEARCH
const findCity = document.getElementById("find");

if (findCity) {
  const searchField = document.getElementById("search");

  findCity.addEventListener("click", () => {
    let searchInput = searchField.value;
    chosenCity = searchInput;
    searchField.value = "";
    citiesMenu.classList.remove("active");
    menuIcon.style.display = "";
    fetchCity();
    searchHistory(searchInput);
    localStorageSave(searchInput);
  });
} else {
  menuIcon.style.display = "";
}

//? MENU SEARCH HISTORY
function searchHistory(city) {
  const historyCitySection = document.querySelector("#history-city-section");
  const cityLink = document.createElement("a");
  cityLink.classList.add("city");
  cityLink.setAttribute(`data-target`, `${city}`);
  cityLink.setAttribute("data-city", "");
  cityLink.setAttribute("href", "#");
  cityLink.innerText = `${city}`;
  historyCitySection.appendChild(cityLink);
  citySelection();
}

//? API FETCH
async function fetchCity() {
  const api = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${chosenCity}&appid=${key}`
  );
  const data = await api.json();

  const temp = await fetch(
    `https://api.openweathermap.org/data/2.5/find?q=${chosenCity}&units=metric&appid=${key}`
  );
  const result = await temp.json();

  output.innerHTML = `
    <h1>${data.name}</h1> 
    <h2>${result.list[0].main.temp} &deg;</h2>
    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png"></img>
    <div class="weather-description">${data.weather[0].description}</div> 
    
    <div class="temps-options">

      <div class="min-max">
        <div><span>min:</span> ${result.list[0].main.temp_min}&deg;</div> 
        <div><span>max:</span> ${result.list[0].main.temp_max}&deg;</div> 
      </div>

      <div class="pressure-humidity">
        <div><span>pressure:</span> ${result.list[0].main.pressure}&deg;</div> 
        <div><span>humidity:</span> ${result.list[0].main.humidity}&deg;</div> 
      </div>

      <div class="feels-like">
        <div><span>feels like:</span> ${result.list[0].main.feels_like}&deg;</div> 
      </div>

    </div>
    `;
}
document.addEventListener("DOMContentLoaded", fetchCity);

//? MENU BEHAVIOUR
const citiesMenu = document.querySelector(".city-menu");
const menuIcon = document.querySelector(".fa-chevron-down");
const closeMenu = document.querySelector(".fa-times");

menuIcon.addEventListener("click", () => {
  citiesMenu.classList.add("active");
  menuIcon.style.display = "none";
});

closeMenu.addEventListener("click", () => {
  citiesMenu.classList.remove("active");
  menuIcon.style.display = "";
});

//? SERVICE WORKER REGISTRATION
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then((registration) => {
      console.log("SW registered");
      console.log(registration);
    })
    .catch((error) => {
      console.log("SW Registration failed!");
      console.log(error);
    });
}
