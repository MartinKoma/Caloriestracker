import isLoggedIn from "./isLoggedIn.js";

window.addEventListener("load", async (event) => {
  const auth = await isLoggedIn();
  if (auth) {
    window.location.href = "http://localhost/user";
  }
});
const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".navbar__menu");
menu.addEventListener("click", function () {
  menu.classList.toggle("is-active");
  menuLinks.classList.toggle("active");
});
