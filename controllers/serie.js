const { User, Movie, Review } = require("../dataBase");
const {
  asyncWrap,
  ErrorApp,
  reviewValidator,
} = require("../public/scripts/ErrorApp");

module.exports.showSimple = asyncWrap(async (req, res) => {
  const data = req.data;
  const [serial] = data.filter((element) => {
    return element._id == req.params.id;
  });
  if (serial) {
    const genresofserial = serial.genres;
    // console.log(`genres: `, genres);
    let serials = [];
    genresofserial.forEach((genre) => {
      data.forEach((element) => {
        if (element.genres.includes(genre) && element.name !== serial.name) {
          serials.push(element);
        }
      });
    });
    let isFav = false;
    if (req.isAuthenticated()) {
      const [userData] = await User.find({ _id: req.user._id });
      isFav = userData.favMovies.includes(serial._id);
    }
    res.render("simple", {
      serial,
      serials,

      isFav,
    });
  } else {
    throw new ErrorApp();
  }
});

module.exports.addCommentForm = asyncWrap(async (req, res) => {
  if (req.isAuthenticated()) {
    res.render("forms", {
      comment: "",
      path: "addComment",
      id: req.params.id,
      err: "",
      // success: req.flash("success"),
    });
  } else {
    throw new ErrorApp("unauthorized enter", 500);
  }
});
module.exports.addComment = asyncWrap(async (req, res) => {
  if (req.isAuthenticated()) {
    // const {id,owner}
    const { id } = req.params;

    const { note, body } = req.body;
    const serial = await Movie.findById(id);
    // const creator = await User.findById(owner);
    const [creator] = await User.find({ _id: req.user._id });

    const newReview = new Review({ user: creator, note, body, serial });
    creator.comments.push(newReview);
    serial.reviews.push(newReview);
    await creator.save();
    await serial.save();
    await newReview.save();

    req.flash("success", "Your comment was added");
    res.redirect("/myAccount");
  } else {
    throw new ErrorApp("Something went wrong", 500, "index");
  }
});

module.exports.showComments = asyncWrap(async (req, res) => {
  const { id } = req.params;
  const serial = await Movie.findById(id);
  if (serial) {
    const comments = await Review.find({ serial: id });
    if (comments.length) {
      const users = await Review.find({ serial: id }).populate("user");
      res.render("reviews-side", {
        users,
        comments,
        serial,
      });
    } else {
      req.flash(
        "error",
        `Error: There is no comments for this serial. Be the first One and put one in! :) status: 500 `
      );
      res.render("index", {
        // success: req.flash("success"),
        err: req.flash("error"),
      });
    }
  } else {
    throw new ErrorApp("Serial not found", 500);
  }
});
