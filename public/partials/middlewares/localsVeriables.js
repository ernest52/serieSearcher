const { genres, countries, User } = require("../../../dataBase");
const { asyncWrap } = require("../../scripts/ErrorApp");

module.exports = asyncWrap(async (req, res, next) => {
  res.locals.genres = genres;
  res.locals.countries = countries;
  res.locals.myAccount = req.isAuthenticated();
  res.locals.isFav = false;
  next();
});
