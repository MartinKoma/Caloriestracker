const mysql = require("mysql");
const dotenv = require("dotenv");
const UserModel = require("./userModel");
const MealModel = require("./mealModel");
const ExerciseModel = require("./exerciseModel");
dotenv.config();

// Database connection
const db = mysql.createConnection({
  host: process.env.DBHOSTNAME,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

const User = new UserModel(db);
const Meal = new MealModel(db);
const Exercise = new ExerciseModel(db);

module.exports = {
  User,
  Meal,
  Exercise,
};
