module.exports = class ExerciseModel {
  constructor(database) {
    this.database = database;
  }

  /*

************************  Members allowed  *********************

*/
  async getMyExerciseById(userId, exerciseId) {
    const query = `SELECT * from exercise WHERE userId = ? AND id = ?;`;
    return await new Promise((resolve, reject) => {
      this.database.query(
        query,
        [userId, exerciseId],
        (err, results, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  }

  async getAllExercisesFromUserId(id) {
    const query = `SELECT * from exercise WHERE userId = ?;`;
    return await new Promise((resolve, reject) => {
      this.database.query(query, id, (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          for (let result of results) {
            result.date = result.date.toISOString().split("T")[0];
          }
          resolve(results);
        }
      });
    });
  }

  async createExercise(cols) {
    let query = "INSERT INTO exercise (";
    let data = [];
    for (const [key, value] of Object.entries(cols)) {
      query = query + ` ${key},`;
      data.push(value);
    }
    //remove the last ","
    query = query.slice(0, -1);
    query = query + ") VALUES (?);";

    return await new Promise((resolve, reject) => {
      this.database.query(query, [data], (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  async deleteMyExercise(userId, exerciseId) {
    let query = "DELETE from exercise where userId = ? AND id = ?";

    return await new Promise((resolve, reject) => {
      this.database.query(
        query,
        [userId, exerciseId],
        (err, results, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  async updateMyExercise(userId, exerciseId, cols) {
    let query = "UPDATE exercise SET";
    let updateCols = [];
    for (const [key, value] of Object.entries(cols)) {
      query = query + ` ${key} = ?,`;
      updateCols.push(value);
    }

    //remove the last ","
    query = query.slice(0, -1);
    query = query + " WHERE userId = ? AND id = ?;";
    updateCols.push(userId);
    updateCols.push(exerciseId);

    return await new Promise((resolve, reject) => {
      const log = this.database.query(
        query,
        updateCols,
        (err, results, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );

      console.log(log);
    });
  }

  /*

************************  Admin only routes *********************

*/

  async getExerciseById(id) {
    const query = `SELECT * from exercise WHERE id = ?;`;
    return await new Promise((resolve, reject) => {
      this.database.query(query, [id], (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  async getAllExercise() {
    const query = `SELECT * from exercise;`;
    return await new Promise((resolve, reject) => {
      this.database.query(query, (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  async updateExercise(exerciseId, cols) {
    let query = "UPDATE exercise SET";
    let updateCols = [];
    for (const [key, value] of Object.entries(cols)) {
      query = query + ` ${key} = ?,`;
      updateCols.push(value);
    }

    //remove the last ","
    query = query.slice(0, -1);
    query = query + " WHERE id = ?;";
    updateCols.push(exerciseId);
    // console.log(query);
    // console.log(updateCols);
    return await new Promise((resolve, reject) => {
      this.database.query(query, updateCols, (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  async deleteExercise(id) {
    let query = "DELETE from exercise where id = ?";

    return await new Promise((resolve, reject) => {
      this.database.query(query, [id], (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
};
