module.exports = class MealModel {
  constructor(database) {
    this.database = database;
  }

  /*

************************  Members allowed  *********************

*/

  async getMyMealById(userId, mealId) {
    const query = `SELECT * from meal WHERE userId = ? AND id = ?;`;
    return await new Promise((resolve, reject) => {
      this.database.query(query, [userId, mealId], (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  async getAllMealsFromUserId(id) {
    const query = `SELECT * from meal WHERE userId = ?;`;
    return await new Promise((resolve, reject) => {
      this.database.query(query, [id], (err, results, fields) => {
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

  async createMeal(cols) {
    let query = "INSERT INTO meal (";
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

  async updateMyMeal(userId, mealId, cols) {
    let query = "UPDATE meal SET";
    let updateCols = [];
    for (const [key, value] of Object.entries(cols)) {
      query = query + ` ${key} = ?,`;
      updateCols.push(value);
    }

    //remove the last ","
    query = query.slice(0, -1);
    query = query + " WHERE userId = ? AND id = ?;";
    updateCols.push(userId);
    updateCols.push(mealId);

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

  async deleteMyMeal(userId, mealId) {
    let query = "DELETE from meal where userId = ? AND id = ?";

    return await new Promise((resolve, reject) => {
      this.database.query(query, [userId, mealId], (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  /*

************************  Admin only routes *********************

*/
  async getMealById(id) {
    const query = `SELECT * from meal WHERE id = ?;`;
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

  async getAllMeals() {
    const query = `SELECT * from meal;`;
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

  async updateMeal(mealId, cols) {
    let query = "UPDATE meal SET";
    let updateCols = [];
    for (const [key, value] of Object.entries(cols)) {
      query = query + ` ${key} = ?,`;
      updateCols.push(value);
    }

    //remove the last ","
    query = query.slice(0, -1);
    query = query + " WHERE id = ?;";
    updateCols.push(mealId);
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

  async deleteMeal(id) {
    let query = "DELETE from meal where id = ?";

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
