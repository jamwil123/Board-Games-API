const express = require("express");
const apiRouter = express.Router();
const { categoriesRouter } = require("../routers/categories-router");
const { reviewsRouter } = require("../routers/reviews-router");
const { commentsRouter } = require("../routers/comments-router");
const { getDescription } = require("../controllers/description-controller");
const { usersRouter } = require("./user-router");

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.route("/").get(getDescription);

module.exports = { apiRouter };
