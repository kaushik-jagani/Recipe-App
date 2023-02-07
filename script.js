const mealsEl = document.getElementById("meals");
const favoriteContainer =document.getElementById("favoriteContainer");

const searchTerm =document.getElementById("search-term");
const searchBtn=document.getElementById("search");

const mealPopup =document.getElementById("meal-popup");

const popupCloseBtn =document.getElementById("close-popup");

const mealInfoEl =document.getElementById("meal-info");

const imgInfo =document.getElementById("imgInfo");


//function call
getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );

  const respData = await resp.json();
  const randomMeal = respData.meals[0];
  console.log(randomMeal);

  addMeal(randomMeal, true);
}

async function getMealById(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );

  const respData = await resp.json();
  const meal = respData.meals[0];
  return meal;
}

async function getMealBySearch(term) {
    const resp = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
    );

  const respData = await resp.json();
    const meals = respData.meals;

    return meals;
}

function addMeal(mealData, random = false) {
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = `
    <div class="meal-header">
          ${
            random
              ? `<span class="random"> 
          Randome recipie </span>`
              : ``
          }
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" id="imgInfo">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn"><i class="fas fa-heart"></i></button>
        </div>
    
    `;

  const btn = meal.querySelector(".meal-body .fav-btn");

  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
        removeMealsFromLS(mealData.idMeal);
        btn.classList.remove("active");
    } else {
        addMealsToLS(mealData.idMeal);
        btn.classList.add("active");
    }
    // btn.classList.toggle("active");
  });

    mealsEl.appendChild(meal);

    const details =document.querySelector(".meal-header");
    
    details.addEventListener("click", () => {
            showMealInfo(mealData);
    });
}

//local storage ma faviorite  item stor kari
var array = [];
let setofArray =new Set(array);
function addMealsToLS(mealId) {
    const mealIds = getMealsFromLS();

    array.push(mealIds);
    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}



//remove meals from local storage

function removeMealsFromLS(mealId) {
  const mealIds = getMealsFromLS();

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

function getMealsFromLS() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));
  
    
    return mealIds === null ? [] : mealIds;
  
}



async function fetchFavMeals() {
    favoriteContainer.innerHTML="";
    

  const mealIds = getMealsFromLS();

//   const meals = [];
  for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);
        // meals.push(meal);
        addMealFav(meal);
  }
  
}

 function addMealFav(mealData) {
  const favMeal = document.createElement("li");



  favMeal.innerHTML = `
  <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
  <span>${mealData.strMeal}</span>

  <button class="clear"><i class="fas fa-window-close"></i></button>
    `;

    const btn= favMeal.querySelector('.clear');

    btn.addEventListener("click",() => {
        removeMealsFromLS(mealData.idMeal);
        fetchFavMeals();
    });
    
    favMeal.addEventListener("click", () => {
        showMealInfo(mealData);
    })

    favoriteContainer.appendChild(favMeal);
}


searchBtn.addEventListener("click",async () => {
    // clean container
    mealsEl.innerHTML = "";

    const search = searchTerm.value;
    const meals = await getMealBySearch(search);
    // console.log(search);

    if (meals) {
        meals.forEach((meal) => {
            addMeal(meal);
        });
    }
});

//meal-info create and dispaly

function showMealInfo(mealData){
    mealInfoEl.innerHTML="";

    const ingredients = [];
    for(let i=1; i<=20; i++){
        if(mealData["strIngredient" + i]){
            ingredients.push(
                `${mealData["strIngredient" + i ]} - ${mealData["strMeasure" + i]}`
            );
        }else{
            break;
        }
    }
    const mealEl =document.createElement("div");

    mealEl.innerHTML = `
          
        <h1>${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" width="400px" height="400px">

        <p>${mealData.strInstructions}</p>
        
        <h3 class="ingList"><--   List of Ingredients  --></h3>
        <ul>
            ${ingredients.map((ing) =>
                `<li>${ing}</li>`
            ).join("")}
        </ul>
    `

    mealInfoEl.appendChild(mealEl);

    //show the popup with deetails
    mealPopup.classList.remove('hidden');
}

popupCloseBtn.addEventListener("click",() => {
    mealPopup.classList.add("hidden");

})