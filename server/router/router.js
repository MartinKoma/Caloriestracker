const express = require("express");
const userController = require("../controller/userController");
const mealController = require("../controller/mealController");
const authController = require("../controller/authController");
const exerciseController = require("../controller/exerciseController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/isLoggedIn", authController.isLoggedIn);

// Protect all routes after this middleware, assign user in request.
// req.user will be available after this line
router.use(authController.protect);

/*

************************  Members allowed routes. req.user.role = ["member", "admin"] *********************

*/

// User API
router
  .route("/me")
  .get(userController.getMe)
  .patch(userController.updateMe)
  .delete(userController.deleteMe);

router.patch("/updatePassword", authController.updatePassword);

// Meal API
router
  .route("/meals")
  .get(mealController.getAllMealsFromUser)
  .post(mealController.createMyMeal);

router
  .route("/meals/:mealId")
  .get(mealController.getMyMealById)
  .patch(mealController.updateMyMeal)
  .delete(mealController.deleteMeal);

//Exercise API
router
  .route("/exercises")
  .get(exerciseController.getAllExercisesFromUser)
  .post(exerciseController.createMyExercise);

router
  .route("/exercises/:exerciseId")
  .get(exerciseController.getMyExerciseById)
  .patch(exerciseController.updateMyExercise)
  .delete(exerciseController.deleteMyExercise);

/*

************************  Admin only routes (user.role = admin) *********************

*/

router.use(authController.restrictTo("admin"));
// User routes
router
  .route("/users")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/users/:id")
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// //User's meal router
// router
//   .route("/users/:userId/meals")
//   .get(mealController.getAllMealsFromUser)
//   .post(mealController.createMeal);

// router
//   .route("/users/:userId/meals/:mealId")
//   .get(mealController.getMealById)
//   .patch(mealController.updateMeal)
//   .delete(mealController.deleteMeal);

// //Meal router
// router
//   .route("/meals")
//   .get(mealController.getAllMeals)
//   .post(mealController.createMeal);

// router
//   .route("/meals/:id")
//   .get(mealController.getMealById)
//   .patch(mealController.updateMeal)
//   .delete(mealController.deleteMeal);

module.exports = router;
