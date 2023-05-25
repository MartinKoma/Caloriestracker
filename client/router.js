const path = require("path");
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/html/index.html"));
});

router.get("/user", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/html/user.html"));
});
module.exports = router;
