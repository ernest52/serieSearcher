module.exports = (req, res) => {
  res.render("index", {
    // success: req.flash("success"),
    err: req.flash("error"),
  });
};
