const express = require("express");
const Router = express.Router();
const showTopSeries = require("../../controllers/topSeries");
Router.get("/", showTopSeries);

module.exports = Router;
