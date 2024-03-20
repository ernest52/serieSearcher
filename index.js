const express = require("express");
const { Movie, User, Review, genres, countries } = require("./dataBase");
const functions = require("./public/scripts/functions.js");
const port = 3000;
const path = require("path");
const { default: mongoose } = require("mongoose");
const methodOverride = require("method-override");
const server = express();
const ejsMate = require("ejs-mate");
const { appendFileSync } = require("fs");
const userRouter = require("./views/routers/user.js");
const {
  ErrorApp,
  errHandler,
  asyncWrap,
  registerFormValidator,
  reviewValidator,
  userFormValidator,
  searcherValidator,
} = require("./public/scripts/ErrorApp.js");

const getData = require("./views/seeds/Movies__seeds.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const localsVeriables = require("./public/partials/middlewares/localsVeriables.js");
// let success = false;
const checkingData = functions.checkingData;
server.use(
  session({
    name: "serieSearcherSession",
    secret: "alongsecret aside",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //for a week
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
server.use(passport.initialize());
server.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
server.use(flash());
server.engine("ejs", ejsMate);
server.set("view engine", "ejs");
server.set("views", path.join(__dirname + "/views"));
server.use(express.static("public"));
server.use(methodOverride("_method"));
server.use(express.urlencoded({ extended: true }));

server.use(checkingData);
server.use(localsVeriables);
server.use("/user", userRouter);

// -----------
//home
//-----------
server.get("/", (req, res) => {
  res.redirect("/home");
});

server.get("/home", (req, res) => {
  // const data = req.data;

  res.render("index", {
    // success: req.flash("success"),
    err: req.flash("error"),
  });
  // success = success ? false : success;
});
// ----------------
// user
// ----------------

// server.get("/user", (req, res) => {
//   const path = req.path;
//   res.render("forms", {
//     path,
//     err: req.flash("error"),
//     // success: req.flash("success"),
//   });
// });
// server.get(
//   "/user/favourite/:id",
//   asyncWrap(async (req, res, next) => {
//     const { id } = req.params;
//     // res.send(`name: ${name}, password: ${userpassword} serial id: ${id}`);
//     const [owner] = await User.find({ _id: req.user._id });
//     const data = req.data;
//     const [serial] = data.filter((element) => {
//       return element._id == id;
//     });
//     if (owner && serial) {
//       if (typeof owner.favMovies == "undefined") {
//         owner.favMovies = [];
//         // owner.favMovies[0] = serial._id; <-- that is 1 vrsion when favMovies stored strings now there is stored objectId  so we store whole serial to populate it when needed:
//         owner.favMovies[0] = serial;

//         await owner.save();
//       } else if (!owner.favMovies.includes(serial._id)) {
//         owner.favMovies.push(serial);

//         console.log(`serial with id ${serial._id} added to array favMovies`);
//         await owner.save();
//       } else {
//         console.log(
//           `serial with id ${serial._id} is already in array favMovies`
//         );
//       }
//       res.redirect("/myAccount");
//     } else {
//       throw new ErrorApp();
//     }
//   })
// );
// server.get(
//   "/user/:name",
//   asyncWrap(async (req, res, next) => {
//     if (req.isAuthenticated()) {
//       const [userData] = await User.find({ _id: req.user._id });
//       if (userData) {
//         res.render(`index`, {
//           fullName: userData.username,
//           userData,
//           // success: req.flash("success"),
//           err: "",
//         });
//       } else {
//         throw new ErrorApp(
//           "such user doesn't exist try to log in once again",
//           400,
//           "forms"
//         );
//       }
//     } else {
//       throw new ErrorApp("such page doesn't exist", 500);
//     }
//   })
// );
// server.post(
//   "/user",
//   userFormValidator,
//   passport.authenticate("local", {
//     failureFlash: true,
//     failureRedirect: "/user",
//   }),
//   asyncWrap(async (req, res, next) => {
//     const [userExist] = await User.find({ _id: req.user._id });

//     if (userExist) {
//       req.flash("success", "Succesfully logged in");

//       res.redirect(`/user/${userExist.username}`);
//     } else {
//       throw new ErrorApp("your userdata are incorrect", 401, "forms");
//     }
//   })
// );
// -----------------------
// myAccount
//-----------------------
let serials = [];
server.get(
  "/myAccount",
  asyncWrap(async (req, res, next) => {
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
  })
);
server.post(
  "/myAccount",
  searcherValidator,
  asyncWrap(async (req, res) => {
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
  })
);
server.get("/myAccount/settings", (req, res) => {
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
  }
});
server.post("/myAccount/logout", (req, res) => {
  serials = [];
  req.logOut((err) => {
    if (err) return next(err);
    console.log("log out successfully");
    req.flash("success", "You have successfull logged out ");
    res.redirect("/home");
  });
});
server.get(
  "/myAccount/remove",
  asyncWrap(async (req, res) => {
    if (req.isAuthenticated()) {
      const removed = await User.findOneAndDelete({
        _id: req.user._id,
      });
      req.flash("success", `Your account has been deleted succesfully`);
      serials = [];
      res.redirect("/home");
    } else {
      throw new ErrorApp("unauthorizes enter", 500);
    }
  })
);
server.get(
  "/myAccount/update",
  asyncWrap(async (req, res) => {
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
  })
);
server.patch(
  "/myAccount/update",
  asyncWrap(async (req, res) => {
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
  })
);
server.get(
  "/myAccount/comments",
  asyncWrap(async (req, res) => {
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
  })
);
server.get(
  "/myAccount/comments/:id/update",
  asyncWrap(async (req, res) => {
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
  })
);
server.post(
  "/myAccount/comments/:id/update",
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const { note, body } = req.body;
    const comment = await Review.findById(id);

    comment.note = note ? note : comment.note;
    comment.body = body ? body : comment.body;
    await comment.save();
    req.flash("success", "comment successfully updated!");
    res.redirect("/myAccount/comments");
  })
);
server.delete(
  "/myAccount/comments/:id/delete",
  asyncWrap(async (req, res) => {
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
  })
);

server.get(
  "/myAccount/favourites/:id",
  asyncWrap(async (req, res) => {
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
  })
);

server.get(
  "/myAccount/favourites/delete/:id",
  asyncWrap(async (req, res) => {
    if (req.isAuthenticated()) {
      const [owner] = await User.find({ _id: req.user._id });
      if (owner) {
        const index = owner.favMovies.findIndex((fav) => fav == req.params.id);
        index >= 0 ? owner.favMovies.splice(index, 1) : "";
        await owner.save();
        res.redirect("/myAccount");
      }
    } else {
      throw new ErrorApp("unauthorised enter", 401);
    }
  })
);
//
// -------------------
//register
//--------------------

server.get("/register", (req, res) => {
  const path = req.path;

  res.render("forms", {
    path,
    err: "",
    // success: req.flash("success"),
  });
});
server.post(
  "/register",
  registerFormValidator,
  asyncWrap(async (req, res) => {
    const { password, username, mail } = req.body;
    const newUser = new User({
      username,
      mail,
    });
    await User.register(newUser, password);
    await newUser.save();
    req.flash("success", "user succesfully Added");
    res.redirect("/home");
  })
);
//---------------
// serie
//---------------
server.get(
  "/serie/:id",
  asyncWrap(async (req, res) => {
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
  })
);
server.get(
  "/serie/:id/addComment",
  asyncWrap(async (req, res) => {
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
  })
);
server.post(
  "/serie/:id/addComment",
  reviewValidator,
  asyncWrap(async (req, res) => {
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
  })
);
server.get(
  "/serie/:id/comments",
  asyncWrap(async (req, res) => {
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
  })
);

// ----------------
//others
//------------------
server.get("/topSeries", (req, res) => {
  let data = req.data;
  // data.sort();
  data = data.sort((a, b) => b.score - a.score);

  const subpage = "Top Series";

  res.render("subpage", { data, subpage });
});
server.get(
  "/:sub/:g",
  asyncWrap(async (req, res) => {
    const endpoint = req.params.sub;
    // console.log(`endpoint: ${endpoint}`);
    if (endpoint == "country" || endpoint == "genre") {
      let isElement;
      let search = endpoint == "country" ? "country" : "genres";
      if (endpoint == "country") {
        isElement = countries.includes(req.params.g);
      } else {
        isElement = genres.includes(req.params.g);
      }

      if (isElement) {
        const subpage = req.params.g;
        const data = await Movie.find({ [search]: subpage });
        res.render("subpage", {
          data,
          subpage,
        });
      } else {
        throw new ErrorApp("page not found", 404);
      }
    } else {
      throw new ErrorApp("page not found", 404);
    }
  })
);
server.all("*", (req, res, next) => {
  throw new ErrorApp("page not found", 404);
});

server.use(errHandler);
server.listen(port, () => {
  console.log("server works on port: ", port);
});
