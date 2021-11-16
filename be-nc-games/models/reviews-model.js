const db = require("../db");
const reviews = require("../db/data/test-data/reviews");

exports.selectOneReview = (params) => {
  let queryStr = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`;
  return db.query(queryStr, [params.review_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Entry not found" });
    }
    return rows;
  });
};

exports.insertIntoReviews = (params, body) => {
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
      [body.inc_votes, params.review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Entry not found" });
      }
      return rows;
    });
};

exports.fetchAllReviews = (
  orderValue = "created_at",
  ascOrDesc = "desc",
  category
) => { 
    if (![
      "title",
      "designer",
      "owner",
      "review_img_url",
      "review_body",
      "category",
      "created_at",
      "votes",
    ].includes(orderValue)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  if (!["asc", "desc", "ASC", "DESC"].includes(ascOrDesc)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryStr = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id`;
  const queryValues = [];

  if (category) {
    queryValues.push(category);
    queryStr += ` WHERE category = $1`;
  }
  queryStr += ` GROUP BY reviews.review_id
    ORDER BY ${orderValue} ${ascOrDesc};`;
  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 400, msg: "Invalid column query" });
    }
    return rows;
  });
};

exports.fetchCommentsByReviews = (params) => {
  const queryStr = `SELECT * FROM comments
    WHERE comments.review_id = $1;`;

  return db.query(queryStr, [params]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Entry not found" });
    }
    return rows;
  });
};
