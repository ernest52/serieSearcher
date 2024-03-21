const express = require("express");
const Router = express.Router();
const homePage = require("../../controllers/home");
Router.get("/", (req, res) => {
  res.redirect("/home");
});

Router.get("/home", homePage);

module.exports = Router;
