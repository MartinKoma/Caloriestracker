const { Exercise } = require("../model/Model");

/*

************************  Members allowed APIs *********************

*/

exports.getAllExercisesFromUser = async (req, res) => {
  try {
    const id = req.user.id;
    const exercises = await Exercise.getAllExercisesFromUserId(id);
    res.status(200).json({
      status: "success",
      message: "Get all exercises from user",
      length: exercises.length,
      exercises,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getMyExerciseById = async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;
    const userId = req.user.id;
    const exercise = await Exercise.getMyExerciseById(userId, exerciseId);

    if (!exercise) {
      return res.status(404).json({
        status: "fail",
        message: "Exercise not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Get exercise by Id",
      exercise: exercise,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createMyExercise = async (req, res) => {
  try {
    let cols = req.body;
    let userId = req.user.id;
    cols.userId = userId;
    await Exercise.createExercise(cols);

    res.status(200).json({
      status: "success",
      message: "Exercise created!",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateMyExercise = async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId * 1;
    const userId = req.user.id;
    const cols = req.body;

    if (cols.userId) {
      return res.status(400).json({
        status: "fail",
        message: "",
      });
    }
    await Exercise.updateMyExercise(userId, exerciseId, cols);
    const updatedExercise = await Exercise.getMyExerciseById(
      userId,
      exerciseId
    );

    if (!updatedExercise) {
      return res.status(404).json({
        status: "fail",
        message: "Exercise not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Exercise updated",
      Exercise: updatedExercise,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteMyExercise = async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;
    const userId = req.user.id;
    const exercise = await Exercise.getMyExerciseById(userId, exerciseId);

    if (!exercise) {
      return res.status(404).json({
        status: "fail",
        message: "Exercise not found",
      });
    }

    await Exercise.deleteMyExercise(userId, exerciseId);

    return res.status(200).json({
      status: "success",
      message: "Exercise deleted",
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

/*

************************  Admin only APIs *********************

*/

exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.getAllExercise();
    res.status(200).json({
      status: "success",
      message: "Get all Exercises",
      length: exercises.length,
      exercises: exercises,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createExercise = async (req, res) => {
  try {
    let cols = req.body;
    let userId = req.params.id;
    cols.userId = userId;

    await Exercise.createExercise(cols);

    res.status(200).json({
      status: "success",
      message: "Exercise created!",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getExerciseById = async (req, res) => {
  try {
    const id = req.params.exercisesId;
    const exercises = await Exercise.getExerciseById(id);

    res.status(200).json({
      status: "success",
      message: "Get Exercise by Id",
      exercise: exercises,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const id = req.params.exercisesId;
    const cols = req.body;

    await Exercise.updateExercise(id, cols);
    const updatedExercise = await Exercise.getExerciseById(id);

    res.status(200).json({
      status: "success",
      message: "Exercise updated",
      exercise: updatedExercise[0],
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const id = req.params.exerciseId;
    await Exercise.deleteExercise(id);

    res.status(200).json({
      status: "success",
      message: "Exercise deleted",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
