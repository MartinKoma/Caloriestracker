const path = require("path");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./router/router");

const app = express();

app.use(morgan("dev"));

app.use(express.json()); //parse data from body
//Test
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost",
    sameSite: "none",
  })
);

//API Routes
// Get all users
app.options("*");
app.use("/api/v1", router);

module.exports = app;
