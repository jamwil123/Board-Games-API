const db = require("../db");

exports.enterNewComment = (review_id, username, body) => {
  strQuery = `SELECT * FROM users
    WHERE username = $1;`;
  return db.query(strQuery, [username]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 400, msg: "User name not found" });
    } else if (typeof body != "string") {
      return Promise.reject({ status: 400, msg: "Invalid data type" });
    } else {
      let strQuery = `INSERT INTO comments 
(author, body, review_id)
VALUES ($1, $2, $3)
 RETURNING *;`;
      return db
        .query(strQuery, [username, body, review_id])
        .then(({ rows }) => {
          return rows;
        });
    }
  });
};

exports.removeComment = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return db
          .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
          .then((body) => {
            return db.query(`SELECT * FROM comments`).then(({ rows }) => {
              return rows;
            });
          });
      } else {
        return Promise.reject({ status: 404, msg: "User ID not found" });
      }
    });
};

exports.alterComments = (param, inc_votes) => {
  console.log(param, inc_votes)
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [inc_votes, param]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Entry not found" });
      }
      return rows;
    });
};
