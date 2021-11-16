const db = require("../db");

const selectAllCategories = () => {
  return db.query(`SELECT * FROM categories`).then(({ rows }) => {
    return rows;
  });
};

module.exports = { selectAllCategories };
