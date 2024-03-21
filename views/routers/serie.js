const express = require("express");
const Router = express.Router();
const { reviewValidator } = require("../../public/scripts/ErrorApp");
const {
  showSimple,
  addCommentForm,
  addComment,
  showComments,
} = require("../../controllers/serie");
Router.route("/:id/addComment")
  .get(addCommentForm)
  .post(reviewValidator, addComment);
Router.get("/:id", showSimple);
Router.get("/:id/comments", showComments);

// Router.post("/:id/addComment", reviewValidator, addComment);
// Router.get("/:id/comments", showComments);
module.exports = Router;
