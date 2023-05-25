const path = require("path");
const express = require("express");
const router = require("./router");

const app = express();

app.use(express.static(__dirname + "/public/"));

app.use("/", router);

app.get("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Page not found",
  });
});

const port = 80;
app.listen(port, () => {
  console.log("Listening to port", port);
});
