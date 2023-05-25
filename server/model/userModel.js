module.exports = class UserModel {
  constructor(database) {
    this.database = database;
  }

  async getAllUsers() {
    const query = `SELECT * from user;`;
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

  async getUserById(id) {
    const query = `SELECT * from user WHERE id = ?;`;

    return await new Promise((resolve, reject) => {
      this.database.query(query, [id], (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          if (results[0].dob) {
            results[0].dob = results[0].dob.toISOString().split("T")[0];
          }

          resolve(results[0]);
        }
      });
    });
  }

  async getUserByEmail(email) {
    const query = `SELECT * from user WHERE email = ?;`;

    return await new Promise((resolve, reject) => {
      this.database.query(query, [email], (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  async createUser(email, password) {
    const query = "INSERT INTO user (email,password) VALUES (?);";

    const values = [email, password];
    return await new Promise((resolve, reject) => {
      this.database.query(query, [values], (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  async updateUser(id, cols) {
    let query = "UPDATE user SET";
    let updateCols = [];
    for (const [key, value] of Object.entries(cols)) {
      query = query + ` ${key} = ?,`;
      updateCols.push(value);
    }

    //remove the last ","
    query = query.slice(0, -1);
    query = query + " WHERE id = ?;";
    updateCols.push(id);
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

  async updatePassword(id, password) {
    let query = "UPDATE user SET password = ? WHERE id = ?";

    return await new Promise((resolve, reject) => {
      this.database.query(query, [password, id], (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  async deleteUser(id) {
    let query = "DELETE from user where id = ?";

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
