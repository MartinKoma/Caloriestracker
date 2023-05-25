const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

// Database connection
const db = mysql.createConnection({
  host: process.env.DBHOSTNAME,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

const createDatabase = function () {
  const query = "CREATE DATABASE IF NOT EXISTS webapp;";

  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Database created!");
    }
  });
};

const connectToDB = function () {
  const query = "USE webapp;";
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Use database webapp!");
    }
  });
};

const createUserTable = function () {
  const query = `CREATE TABLE IF NOT EXISTS user (
          id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
          role ENUM('admin', 'member') DEFAULT 'member', 
          username varchar(255) NOT NULL,
          firstName varchar(255),
          lastName varchar(255),
          email varchar(255) NOT NULL,
          password varchar(255) NOT NULL,
          dob DATE,
          sex varchar(10),
          height INT,
          weight INT,
          bodyfat INT,
          bmi INT,
          verified BOOL NOT NULL
      )
      ;`;

  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("User table created successfully");
    }
  });
};

const createMealTable = function () {
  const query = `CREATE TABLE IF NOT EXISTS meal (
          id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
          userId INT NOT NULL, 
          type ENUM('breakfast', 'lunch', 'dinner', 'snack'),
          name varchar(255),
          weight DOUBLE(4,1),
          date DATE NOT NULL,
          calories INT NOT NULL,
          protein DOUBLE(5,2),
          carbs DOUBLE(5,2),
          fat DOUBLE(5,2),
          FOREIGN KEY (userId) REFERENCES user(id)
      )
      ;`;

  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Meal table created successfully");
    }
  });
};

const createExerciseTable = function () {
  const query = `CREATE TABLE IF NOT EXISTS exercise (
          id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
          userId INT NOT NULL,
          date DATE NOT NULL,
          caloriesBurned INT,
          duration DOUBLE(5,2),
          type ENUM('Aerobic', 'Aqua-Fitness', 'Archery','Badminton','Beachvolleyball','Billiard','Bodybuilding','Bownling','Socer','Golf','Handball','Climbing','Joggin(5km/h)','Joggin(8km/h)','Joggin(12km/h)','Biking(15km/h)','Biking(25km/h)','Rowing','Swim(moderat)','Swim(intensiv)','Skiing','Snowboarding','Dancing','Tennis(Single)','Tennis(Double)','Tabletennis','Volleyball','Hike(0-5kg.Bagpack)','Hike(5-10kg.Bagpack)')  
      )
      ;`;

  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Exercise table created successfully");
    }
  });
};

createDatabase();
connectToDB();
createUserTable();
createMealTable();
createExerciseTable();

db.end();
