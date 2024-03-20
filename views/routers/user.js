const express = require("express");
const passport = require("passport");
const Router = express.Router();
const { User } = require("../../dataBase");
const {
  asyncWrap,
  ErrorApp,
  userFormValidator,
} = require("../../public/scripts/ErrorApp");
const {
  LogInForm,
  LogInPost,
  addFav,
  LogInGet,
} = require("../../controllers/user");
Router.route("/")
  .get(LogInForm)
  .post(
    userFormValidator,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/user",
    }),
    LogInPost
  );
// Router.get("/", LogInGet);
Router.get("/favourite/:id", addFav);
Router.get("/:name", LogInGet);
// Router.post(
//   "/",
//   userFormValidator,
//   passport.authenticate("local", {
//     failureFlash: true,
//     failureRedirect: "/user",
//   }),
//   LogInPost
// );

module.exports = Router;
