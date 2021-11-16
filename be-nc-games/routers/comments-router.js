const express = require("express");
const { app } = require("../app");
const commentsRouter = express.Router();
const { deleteComment, patchComment } = require("../controllers/comments-controller");

commentsRouter.route("/:comment_id").delete(deleteComment).patch(patchComment);

module.exports = { commentsRouter };
