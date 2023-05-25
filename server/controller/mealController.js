const { Meal } = require("../model/Model");

/*

************************  Members allowed APIs *********************

*/

exports.getAllMealsFromUser = async (req, res) => {
  try {
    const id = req.user.id;
    const meals = await Meal.getAllMealsFromUserId(id);
    res.status(200).json({
      status: "success",
      message: "Get all meals from user",
      length: meals.length,
      meals,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getMyMealById = async (req, res) => {
  try {
    const mealId = req.params.mealId;
    const userId = req.user.id;
    const meal = await Meal.getMyMealById(userId, mealId);

    if (!meal) {
      return res.status(404).json({
        status: "fail",
        message: "Meal not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Get meal by Id",
      meal: meal,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createMyMeal = async (req, res) => {
  try {
    let cols = req.body;
    let userId = req.user.id;
    cols.userId = userId;

    await Meal.createMeal(cols);

    res.status(200).json({
      status: "success",
      message: "Meal created!",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateMyMeal = async (req, res) => {
  try {
    const mealId = req.params.mealId * 1;
    const userId = req.user.id;
    const cols = req.body;

    if (cols.userId) {
      res.status(400).json({
        status: "fail",
        message: "",
      });
    }
    await Meal.updateMyMeal(userId, mealId, cols);
    const updatedMeal = await Meal.getMyMealById(userId, mealId);

    if (!updatedMeal) {
      return res.status(404).json({
        status: "fail",
        message: "Meal not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Meal updated",
      meal: updatedMeal,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteMyMeal = async (req, res) => {
  try {
    const mealId = req.params.mealId;
    const userId = req.user.id;
    const meal = await Meal.getMyMealById(userId, mealId);

    if (!meal) {
      res.status(404).json({
        status: "fail",
        message: "Meal not found",
      });
    }

    await Meal.deleteMyMeal(userId, mealId);

    res.status(200).json({
      status: "success",
      message: "Meal deleted",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

/*

************************  Admin only APIs *********************

*/

exports.getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.getAllMeals();
    res.status(200).json({
      status: "success",
      message: "Get all meals",
      length: meals.length,
      meals,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createMeal = async (req, res) => {
  try {
    let cols = req.body;
    let userId = req.params.id;
    cols.userId = userId;

    await Meal.createMeal(cols);

    res.status(200).json({
      status: "success",
      message: "Meal created!",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getMealById = async (req, res) => {
  try {
    const id = req.params.mealId;
    const meal = await Meal.getMealById(id);

    res.status(200).json({
      status: "success",
      message: "Get meal by Id",
      meal: meal,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateMeal = async (req, res) => {
  try {
    const id = req.params.mealId;
    const cols = req.body;

    await Meal.updateMeal(id, cols);
    const updatedMeal = await Meal.getMealById(id);

    res.status(200).json({
      status: "success",
      message: "Meal updated",
      meal: updatedMeal[0],
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteMeal = async (req, res) => {
  try {
    const id = req.params.mealId;
    await Meal.deleteMeal(id);

    res.status(200).json({
      status: "success",
      message: "Meal deleted",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
