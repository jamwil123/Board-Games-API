const express = require("express");
const { app } = require("../app");
const reviewsRouter = express.Router();
const {
  getReviews,
  patchReviews,
  getAllReviews,
  getCommentsByReviews,
} = require("../controllers/reviews-controller");
const { postNewComment } = require("../controllers/comments-controller");

reviewsRouter.route("/").get(getAllReviews);

reviewsRouter.route(`/:review_id`).get(getReviews).patch(patchReviews);

reviewsRouter
  .route(`/:review_id/comments`)
  .get(getCommentsByReviews)
  .post(postNewComment);

module.exports = { reviewsRouter };
