const { genres, countries } = require("../../../dataBase");
module.exports = (req, res, next) => {
  res.locals.genres = genres;
  res.locals.countries = countries;
  res.locals.myAccount = req.isAuthenticated();
  next();
};
