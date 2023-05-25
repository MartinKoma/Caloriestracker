document.querySelector("#show-Signup").addEventListener("click", function () {
  document.querySelector(".signup").classList.add("active");
});

document
  .querySelector(".signup .close-btn")
  .addEventListener("click", function () {
    document.querySelector(".signup").classList.remove("active");
  });

const signUpButton = document.getElementById("sign-up-button");

signUpButton.addEventListener("click", async () => {
  const email = document.getElementById("signUp-email").value;
  const password = document.getElementById("signUp-password").value;
  const repPassword = document.getElementById("Repeat_Password").value;
  const DateOfBirth = document.getElementById("DateOfBirth").value;
  const sex = document.querySelector('input[name="sex"]:checked').value;
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;

  if (password !== repPassword) {
    console.log("Password und confirm password does not match");
  }

  console.log(email, password, repPassword, DateOfBirth, sex, height, weight);

  let payload = {
    email,
    password,
    dob: DateOfBirth,
    sex,
    height,
    weight,
  };
  const res = await fetch("http://localhost:3000/api/v1/signup", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Access-Control-Allow-Origin": "http://localhost",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  sessionStorage.setItem("jwt", data.token);
});
