import isLoggedIn from "./isLoggedIn.js";
window.addEventListener("load", async () => {
  const auth = await isLoggedIn();
  if (!auth) {
    window.location.href = "http://localhost";
  }
  renderProfile();
});

// Profile handler
const userButton = document.getElementById("user-button");

userButton.addEventListener("click", async (event) => {
  await renderProfile();
});

const renderProfile = async () => {
  const user = await getMe();
  let str = `
  <h1>Personal Info</h1>
  <h2>Full Name</h2>
  ${user.firstName} ${user.lastName}
  <h2>E-Mail</h2>
  ${user.email}
  <h2>Birthday</h2>
  ${user.dob}
  <h2>Sex</h2>
  ${user.sex}
  <h2>Height</h2>
  ${user.height}
  <h2>weight</h2>
  ${user.weight}
  <div class="clear"> </div>
  <div class="change-password-container"> 
  <button class="btn" id="change-password">Change Password</button>
  </div>
  
  `;
  const profileElement = document.querySelector(".profile");
  profileElement.innerHTML = "";
  profileElement.insertAdjacentHTML("afterbegin", str);

  const changePWButton = document.getElementById("change-password");
  changePWButton.addEventListener("click", () => {
    renderChangePassword();
  });
};

const renderChangePassword = () => {
  let str = `
    <h2>Current Password</h2>
    <input id="current-password" type="text" class="input" value="" />
    <h2>New Password</h2>
    <input id="new-password" type="text" class="input" value="" />
    <button class="btn" id="submit-change-password">Change Password</button>
    <button class="btn" id="cancel-change-password">Cancel</button>
  `;
  const changePasswordContainer = document.querySelector(
    ".change-password-container"
  );
  changePasswordContainer.innerHTML = "";
  changePasswordContainer.insertAdjacentHTML("afterbegin", str);

  const submitChangePassword = document.getElementById(
    "submit-change-password"
  );

  submitChangePassword.addEventListener("click", async () => {
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const payload = {
      currentPassword,
      newPassword,
    };

    const res = await changePassword(payload);
    if (res.status == "fail") {
      console.log(res);
    } else {
      sessionStorage.setItem("jwt", res.token);
      window.location.href = "http://localhost/user";
    }
  });

  const cancelChangePassword = document.getElementById(
    "cancel-change-password"
  );

  cancelChangePassword.addEventListener("click", () => {
    const str = `
    <button class="btn" id="change-password">Change Password</button>`;
    const changePasswordContainer = document.querySelector(
      ".change-password-container"
    );
    changePasswordContainer.innerHTML = "";
    changePasswordContainer.insertAdjacentHTML("afterbegin", str);
    const changePWButton = document.getElementById("change-password");
    changePWButton.addEventListener("click", () => {
      renderChangePassword();
    });
  });
};

const changePassword = async (payload) => {
  const credentials = sessionStorage.getItem("jwt");
  if (credentials) {
    const res = await fetch("http://localhost:3000/api/v1/updatePassword", {
      method: "PATCH",
      credentials: "include",
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${credentials}`,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "http://localhost",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  }
};

const getMe = async () => {
  const credentials = sessionStorage.getItem("jwt");
  if (credentials) {
    const res = await fetch("http://localhost:3000/api/v1/me", {
      method: "GET",
      credentials: "include",
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${credentials}`,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "http://localhost",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });

    const data = await res.json();
    return data.user;
  }
};

// Meals Handler
const mealButton = document.getElementById("meal-button");

mealButton.addEventListener("click", async (event) => {
  await renderMeals();
});

const renderMeals = async () => {
  const meals = await getMeals();
  // TODO HTML hier schreiben
  let str = `
  <p class="grid-item">Name</p>
  <p class="grid-item">Calories</p>
  <p class="grid-item">Type</p>
  <p class="grid-item">Weight(g)</p>
  <p class="grid-item">Protein</p>
  <p class="grid-item">Carb</p>
  <p class="grid-item">Fat</p>
  <p class="grid-item">Date</p>
  <p class="grid-item"></p>`;

  for (let meal of meals) {
    str =
      str +
      `
    <p class="grid-item">${meal.name} </p>
    <p class="grid-item">${meal.calories} </p>
    <p class="grid-item">${meal.type} </p>
    <p class="grid-item">${meal.weight} </p>
    <p class="grid-item">${meal.protein} </p>
    <p class="grid-item">${meal.carbs} </p>
    <p class="grid-item">${meal.fat} </p>
    <p class="grid-item">${meal.date} </p>

    <div class="grid-item"> 
    <button data-mealId="${meal.id}" class="btn meal-delete-button" id="meal-delete-${meal.id}">Remove</button>

    </div>
   
  `;
  }

  const mealsContainer = document.querySelector(".meals-container");
  mealsContainer.innerHTML = "";
  mealsContainer.insertAdjacentHTML("beforeend", str);

  for (let meal of meals) {
    const deleteMealButton = document.getElementById(`meal-delete-${meal.id}`);

    deleteMealButton.addEventListener("click", async () => {
      const mealId = deleteMealButton.getAttribute("data-mealId");
      await deleteMeal(mealId);
      await renderMeals();
    });
  }
};

const addMealButton = document.getElementById("add-meal");

addMealButton.addEventListener("click", async () => {
  const name = document.getElementById("meal-name").value;
  const calories = document.getElementById("meal-calories").value;
  const weight = document.getElementById("meal-weight").value;
  const protein = document.getElementById("meal-protein").value;
  const carbs = document.getElementById("meal-carb").value;
  const fat = document.getElementById("meal-fat").value;
  const type = document.getElementById("meal-types").value;
  const date = new Date().toISOString();

  if (!name) {
    console.log("Please provide meal name");
    return;
  }
  const payload = {
    name,
    calories: calories !== "" ? calories : 0,
    weight: weight !== "" ? weight : 0,
    protein: protein !== "" ? protein : 0,
    carbs: carbs !== "" ? carbs : 0,
    fat: fat !== "" ? fat : 0,
    type,
    date,
  };
  const data = await createMeal(payload);
  renderMeals();
});

const createMeal = async (payload) => {
  const credentials = sessionStorage.getItem("jwt");

  if (credentials) {
    const res = await fetch("http://localhost:3000/api/v1/meals", {
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${credentials}`,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "http://localhost",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(payload),
    });

    const data = res.json();
    return data;
  }
};
const getMeals = async () => {
  const credentials = sessionStorage.getItem("jwt");
  if (credentials) {
    const res = await fetch("http://localhost:3000/api/v1/meals", {
      method: "GET",
      credentials: "include",
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${credentials}`,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "http://localhost",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });

    const data = await res.json();
    return data.meals;
  }
};

const deleteMeal = async (id) => {
  const credentials = sessionStorage.getItem("jwt");
  if (credentials) {
    const res = await fetch(`http://localhost:3000/api/v1/meals/${id}`, {
      method: "DELETE",
      credentials: "include",
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${credentials}`,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "http://localhost",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });

    const data = await res.json();
    return data;
  }
};
// Exercise Handler
const exerciseButton = document.getElementById("exercise-button");

exerciseButton.addEventListener("click", async (event) => {
  await renderExercises();
});

const renderExercises = async () => {
  const exercises = await getExercises();
  const user = await getMe();
  const ex = exercises;
  // TODO HTML hier schreiben
  let str = `
  
    <p class="grid-item">Type</p>
    <p class="grid-item">Burned Calories</p>
    <p class="grid-item">Duration</p>
    <p class="grid-item">Date</p>
    <p class="grid-item"></p>
  `;
  for (let excercise of exercises) {
    str =
      str +
      `
      <p class="grid-item">${excercise.type}</p>
      <p class="grid-item">${excercise.caloriesBurned}</p>
      <p class="grid-item">${excercise.duration}</p>
      <p class="grid-item">${excercise.date}</p>

      <div class="grid-item">
        <button data-excerciseId="${excercise.id}" class="btn meal-delete-button" id="ex-delete-${excercise.id}">Remove</button>
    
      </div>
    
    `;
  }

  const exerciseElement = document.querySelector(".exercises-container");
  exerciseElement.innerHTML = "";
  exerciseElement.insertAdjacentHTML("beforeend", str);

  for (let excercise of exercises) {
    const deleteExcersiseButton = document.getElementById(
      `ex-delete-${excercise.id}`
    );
    deleteExcersiseButton.addEventListener("click", async () => {
      await deleteExcersise(excercise.id);
      await renderExercises();
    });
    //console.log(deleteExcersiseButton.id);
  }
};
const deleteExcersise = async (id) => {
  const credentials = sessionStorage.getItem("jwt");
  if (credentials) {
    const res = await fetch(`http://localhost:3000/api/v1/exercises/${id}`, {
      method: "DELETE",
      credentials: "include",
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${credentials}`,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "http://localhost",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });

    const data = await res.json();
    return data;
  }
};

const getExercises = async () => {
  const credentials = sessionStorage.getItem("jwt");
  if (credentials) {
    const res = await fetch("http://localhost:3000/api/v1/exercises", {
      method: "GET",
      credentials: "include",
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${credentials}`,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "http://localhost",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });

    const data = await res.json();
    return data.exercises;
  }
};

// edit profile Handler
`

`;

const editButton = document.getElementById("edit-button");

editButton.addEventListener("click", async (event) => {
  await renderEdit();
});

const renderEdit = async () => {
  const user = await getMe();
  console.log(user);
  // TODO HTML hier schreiben\
  let sex;

  if (user.sex === "male") {
    sex = `<input
        type="radio"
        id="female"
        name="sex"
        class="input"
        value="female"
      />
      <label for="female">Female</label>
      <input
        type="radio"
        id="male"
        name="sex"
        class="input"
        value="male"
        checked
      />
      <label for="male">Male</label>
      `;
  } else {
    sex = `<input
        type="radio"
        name="sex"
        id="female"
        class="input"
        value="female"
        checked
      />
      <label for="female">Female</label>
      <input
        type="radio"
        name="sex"
        id="male"
        class="input"
        value="male"
      />
      <label for="male">Male</label>
  `;
  }
  let str = `
      <h1>Personal Info</h1>
      <h2>First Name</h2>
      <input id="edit-firstname" type="text" class="input" value="${user.firstName}" />
      <h2>Last Name</h2>
      <input id="edit-lastname" type="text" class="input" value="${user.lastName}" />
      <h2>E-Mail</h2>
      <input id="edit-email" type="text" class="input" value="${user.email}" />
      <h2>Birthday</h2>
      <input id="edit-dob" type="date" class="input" value="${user.dob}" />
      <h2>Sex</h2>
       ${sex}
      <h2>Height</h2>
      <input id="edit-height" type="numeric" class="input" value="${user.height}" />
      <h2>Weight</h2>
      <input id="edit-weight" type="numeric" class="input" value="${user.weight}" />
      <div class="clear"></div>
      <button class="btn" id="submit-edit-user">Update</button>
     
  `;

  const exerciseElement = document.querySelector(".edit-profile");
  exerciseElement.innerHTML = "";
  exerciseElement.insertAdjacentHTML("afterbegin", str);
  const submitEditUser = document.getElementById("submit-edit-user");
  submitEditUser.addEventListener("click", async (event) => {
    await updateUser();
  });
};

// Submit edit

const updateUser = async () => {
  const credentials = sessionStorage.getItem("jwt");
  if (credentials) {
    let sex;
    if (document.getElementById("male").checked) {
      sex = "male";
    } else if (document.getElementById("female").checked) {
      sex = "female";
    }

    let payload = {
      firstName: document.getElementById("edit-firstname").value,
      lastName: document.getElementById("edit-lastname").value,
      email: document.getElementById("edit-email").value,
      sex: sex,
      dob: document.getElementById("edit-dob").value,
      height: document.getElementById("edit-height").value,
      weight: document.getElementById("edit-weight").value,
    };

    const res = await fetch("http://localhost:3000/api/v1/me", {
      method: "PATCH",
      credentials: "include",
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${credentials}`,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "http://localhost",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  }
};

// Meal Handler

const logoutButton = document.getElementById("show-login");

logoutButton.addEventListener("click", async () => {
  await logout();
  window.location.href = "http://localhost";
});
const logout = async () => {
  const res = await fetch("http://localhost:3000/api/v1/logout", {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "*/*",
      "Access-Control-Allow-Origin": "http://localhost",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  sessionStorage.clear();
};

//Excersise handler

const ExcersiseAdd = document.getElementById("add-ex-button");

ExcersiseAdd.addEventListener("click", async () => {
  var extype = document.getElementById("excercise-types").value;
  extype = extype.split(",");

  //const exname = document.getElementById("exName").value;
  const calories = document.getElementById("exCalories").value;
  const duration = document.getElementById("exDuration").value;
  const date = new Date().toISOString();

  const type = extype[0];
  if (!duration) {
    console.log("Please provide duration");
    return;
  }

  let caloriesBurned;
  if (calories == "" || calories == 0) {
    const user = await getMe();
    caloriesBurned = extype[1] * user.weight * duration;

    const payload = {
      caloriesBurned,
      duration,
      type,
      date,
    };

    const data = await createExcercise(payload);
    renderExercises();
  } else {
    caloriesBurned = calories;
    const payload = {
      caloriesBurned,
      type,
      duration,
      date,
    };
    const data = await createExcercise(payload);
    renderExercises();
  }
});

const createExcercise = async (payload) => {
  const credentials = sessionStorage.getItem("jwt");

  if (credentials) {
    const res = await fetch("http://localhost:3000/api/v1/exercises", {
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${credentials}`,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "http://localhost",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(payload),
    });

    const data = res.json();

    return data;
  }
};
const statButton = document.getElementById("chart-button");

statButton.addEventListener("click", async (event) => {
  await renderStat();
});

const renderStat = async () => {
  const user = await getMe();
  const meals = await getMeals();
  const exercises = await getExercises();

  var calorieDeficit =0;
  var calorieExercise =0;
  var calorieMeal =0;

  //get time period last 7 days
  var date = new Date();
  var countCalories = 0;
  const data1 = [0, 0, 0, 0, 0, 0, 0, 0];
  const dataExercise = [0, 0, 0, 0, 0, 0, 0, 0];
  var array;
  const labels = [];
  for (var i = 0; i < 8; i++) {
    var c = 7 - i;
    var last = new Date(date.getTime() - c * 24 * 60 * 60 * 1000);
    var day = last.getDate();
    var month = "0" + (last.getMonth() + 1);

    labels[i] = `${day}` + "." + `${month}`;
    //console.log(labels[i])
    //get calorie values per day
    for (let meal of meals) {
      array = meal.date.split("-");
      //console.log(array[1]+"="+ month)
      //console.log(array[2]+"="+ day)
      //console.log(data1[i])
      if (array[2] == day && array[1] == month) {
        // console.log("meal calories"+meal.calories)
        data1[i] = data1[i] + meal.calories;
        //console.log(data1[i])
        calorieMeal=calorieMeal+meal.calories;
      }
    }
    for (let exercise of exercises){
      array = exercise.date.split("-");
      //console.log("month"+array[1]+"="+month);
      //console.log("day"+array[2]+"="+day);
      //console.log("ex calories"+exercise.caloriesBurned);
      if(array[2] == day && array[1] == month){
        dataExercise[i] = dataExercise[i]+exercise.caloriesBurned;
        calorieExercise = calorieExercise+exercise.caloriesBurned;
      }
    }
  }
  
  calorieDeficit = calorieMeal-calorieExercise;

  const BMI = user.weight / (Math.pow(user.height, 2) / 10000);
  let str = `
  <h1>Stats</h1>
  <h2>BMI</h2>
  ${BMI}
  <div class="rightStuff">
  <h2>Calories this Weak</h2>
  ${calorieDeficit}
  </div>
  <div class="chart">
    <canvas id="myChart" ></canvas>
  </div>
  `;

  const statsElement = document.querySelector(".stats");
  statsElement.innerHTML = "";
  statsElement.insertAdjacentHTML("afterbegin", str);

  const ctx = document.getElementById("myChart").getContext("2d");

  //Gradiant fill
  let gradient = ctx.createLinearGradient(0, 0, 0, 400);
  //gradient.addColorStop(0,'rgb(58,123,213,1');
  //gradient.addColorStop(1,'rgba(0,210,255,0.3');
  gradient.addColorStop(0, "rgb(135,131,247,1");
  gradient.addColorStop(1, "rgba(193,192,244,0.3");

  const data = {
    labels,
    datasets: [
      {
        data: data1,
        label: "Calories",
        fill: true,
        backgroundColor: gradient,
        //pointbackgroundColor: "fff",
        //tension:1,[211,326,165,350,420,370]
      },
      {
        labels,
        data: dataExercise,
        label: "burned calories",
        borderColor: "rgb(107, 193, 250)",
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      hitRadius: 20,
      hoverRadius: 9,
      responsive: true,
      scales: {
        y: {
          ticks: {
            callback: function (value) {
              return value + " Calories";
            },
          },
        },
      },
    },
  };

  const myChart = new Chart(ctx, config);
};


