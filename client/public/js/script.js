//Get data from backend with REST API

// Fetch
// rest apicall
// const user = fetch.get();
// us
const body = document.body;

const user = {
  id: 1,
  name: "test1",
};

button(add);

const test = document.querySelector("name").value;
//test = sdfs;

const meal = http.fetch("localhost/api/v1/meals", {
  method: "POST",
  body: {
    name: test,
    calories: 100,
  },
});

http.fetch(getAllMeals);

const nameElement = document.createElement("div");
nameElement.innerText = user.name;

const ageElement = document.createElement("div");
ageElement.innerText = user.age;

const caloriesElement = document.createElement("div");
caloriesElement.innerText = user.calories;

body.append(nameElement, ageElement, caloriesElement);
