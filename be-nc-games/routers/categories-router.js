const express = require("express");
const { app } = require("../app");
const categoriesRouter = express.Router();
const { getCategories } = require("../controllers/categories-controller");

categoriesRouter.route("").get(getCategories);

module.exports = { categoriesRouter };
