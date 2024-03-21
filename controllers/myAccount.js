const { asyncWrap, ErrorApp } = require("../public/scripts/ErrorApp");
const { User, Review, Movie } = require("../dataBase");

let serials = [];

module.exports.myAccountRenderGet = asyncWrap(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const [owner] = await User.find({ _id: req.user._id });
    if (owner) {
      let favourites;
      if (typeof serials[0] == "undefined") {
        const data = await owner.populate("favMovies");
        favourites = data.favMovies;
      } else {
        favourites = serials;
        serials = [];
      }

      res.render("myAccount", {
        comments: "",
        // success: req.flash("success"),
        setSection: false,
        favourites,
        serial: "",
        err: "",
      });
    } else {
      throw new ErrorApp("unauthorised enter", 400);
    }
  } else {
    throw new ErrorApp("unauthorised enter", 400);
  }
});

module.exports.serialSearcherPanel = asyncWrap(async (req, res) => {
  const data = req.data;
  const { title } = req.body;
  data.forEach((serial) =>
    serial.name.toLowerCase().includes(title) ? serials.push(serial) : ""
  );
  if (typeof serials[0] == "undefined") {
    serials = await getData(title);
  }
  if (typeof serials[0] !== "undefined") {
    res.redirect("myAccount");
  } else {
    throw new ErrorApp("serial not found", 500, "myAccount");
  }
});

module.exports.myAccountSettings = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("myAccount", {
      comments: "",
      // success: req.flash("success"),
      setSection: true,

      favourites: "",
      serial: "",
      err: "",
    });
  } else {
    throw new ErrorApp("unauthorized enter", 500);
  }
};
module.exports.logOut = (req, res) => {
  serials = [];
  req.logOut((err) => {
    if (err) return next(err);
    console.log("log out successfully");
    req.flash("success", "You have successfull logged out ");
    res.redirect("/home");
  });
};
module.exports.removeAccount = asyncWrap(async (req, res) => {
  if (req.isAuthenticated()) {
    await User.findOneAndDelete({
      _id: req.user._id,
    });
    req.flash("success", `Your account has been deleted succesfully`);
    serials = [];
    res.redirect("/home");
  } else {
    throw new ErrorApp("unauthorized enter", 500);
  }
});
module.exports.updateAccountForm = asyncWrap(async (req, res) => {
  if (req.isAuthenticated()) {
    const [user] = await User.find({ _id: req.user._id });

    res.render("forms", {
      user,
      path: "update",
      err: "",
      // success: req.flash("success"),
    });
  } else {
    throw new ErrorApp("unauthorized enter", 500);
  }
});

module.exports.updateAccount = asyncWrap(async (req, res) => {
  const { username, password, mail } = req.body;
  const [updated] = await User.find({ _id: req.user._id });
  if (updated) {
    updated.name = username ? username : updated.name;
    password
      ? updated.setPassword(password, () => {
          updated.save();
        })
      : "";
    updated.mail = mail ? mail : updated.mail;
    await updated.save();

    req.logOut((err) => {
      if (err) return next(err);
      req.flash(
        "success",
        "Your account was succesfully updated. You can log in using your new data"
      );
      res.redirect("/home");
    });
  } else {
    throw new ErrorApp("unauthorized enter", 500);
  }
});

module.exports.commentsShower = asyncWrap(async (req, res) => {
  if (req.isAuthenticated()) {
    const movies = [];
    const [{ comments }] = await User.find({
      _id: req.user._id,
    }).populate("comments");

    async function createMovies(id) {
      return await Movie.findById(id);
    }
    for (let i = 0; i < comments.length; i++) {
      const movie = await createMovies(comments[i].serial);
      movies[i] = movie;
    }

    res.render("myAccount", {
      movies,
      comments,
      // success: req.flash("success"),
      setSection: false,
      favourites: "",
      serial: "",
      err: "",
    });
  } else {
    throw new ErrorApp("unauthorized enter", 500);
  }
});

module.exports.commnetsUpdateForm = asyncWrap(async (req, res) => {
  const { id } = req.params;
  if (req.isAuthenticated()) {
    const comment = await Review.findById(id);
    res.render("forms", {
      comment,
      path: "updateComment",
      err: "",
      // success: req.flash("success"),
    });
  } else {
    throw new ErrorApp("unauthorized enter", 401);
  }
});

module.exports.commentsUpdate = asyncWrap(async (req, res) => {
  const { id } = req.params;
  const { note, body } = req.body;
  const comment = await Review.findById(id);

  comment.note = note ? note : comment.note;
  comment.body = body ? body : comment.body;
  await comment.save();
  req.flash("success", "comment successfully updated!");
  res.redirect("/myAccount/comments");
});

module.exports.commentsDelete = asyncWrap(async (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params;
    const user = await User.findOneAndUpdate(
      { comments: { $in: id } },
      { $pull: { comments: id } }
    );
    await Review.findByIdAndDelete(id);
    await user.save();
    res.redirect("/myAccount/comments");
  } else {
    throw new ErrorApp("unauthorized enter");
  }
});
module.exports.addToFavourite = asyncWrap(async (req, res) => {
  if (req.isAuthenticated()) {
    const data = req.data;
    const [serial] = data.filter((simple) => {
      return simple._id == req.params.id;
    });

    const [userData] = await User.find({ _id: req.user._id });

    if (serial) {
      const isFav = userData.favMovies.includes(serial._id);
      // res.render()
      res.render("myAccount", {
        comments: "",
        // success: req.flash("success"),
        setSection: false,
        favourites: "",
        serial,
        err: "",
        isFav,
      });
    } else {
      //  here is problem with this that Movies ides are changeable after working of my middleware. Solution for this at this moment is redirecting:
      res.redirect("/myAccount");
    }
  } else {
    throw new ErrorApp("unauthorized enter", 401);
  }
});

module.exports.deleteFromFavourite = asyncWrap(async (req, res) => {
  if (req.isAuthenticated()) {
    const [owner] = await User.find({ _id: req.user._id });
    if (owner) {
      const index = owner.favMovies.findIndex((fav) => fav == req.params.id);
      index >= 0 ? owner.favMovies.splice(index, 1) : "";
      await owner.save();
      req.flash("success", "serial successfully removed from favourites");
      res.redirect("/myAccount");
    }
  } else {
    throw new ErrorApp("unauthorised enter", 401);
  }
});
