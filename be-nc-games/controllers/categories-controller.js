const { selectAllCategories } = require("../models/categories-model");

exports.getCategories = (req, res) => {
  selectAllCategories().then((categories) => {
    res.status(200).send({ categories: categories });
  });
};
