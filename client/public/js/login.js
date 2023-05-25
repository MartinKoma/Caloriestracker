document.querySelector("#show-login").addEventListener("click", function () {
  document.querySelector(".popup").classList.add("active");
});

document
  .querySelector(".popup .close-btn")
  .addEventListener("click", function () {
    document.querySelector(".popup").classList.remove("active");
  });

const signInButton = document.getElementById("sign-in-button");

signInButton.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let payload = {
    email,
    password,
  };

  const res = await fetch("http://localhost:3000/api/v1/login", {
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
  //if success, redirect to profile

  if (data.status === "success") {
    window.location.href = "http://localhost/user";
  } else {
    // if fail, show fail message
    const loginStatus = document.getElementById("login-status");
    const loginStatusElement = document.createElement("div");
    loginStatusElement.innerText = data.message;
    loginStatus.appendChild(loginStatusElement);
  }
});
