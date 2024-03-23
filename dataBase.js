const mongoose = require("mongoose");
const { Schema } = mongoose;
const dB = "movieBooking";
const passportLocalMongoose = require("passport-local-mongoose");
if (process.env.NODE__ENV !== "production") {
  require("dotenv").config();
}
const db_URL = process.env.DB_URL || `mongodb://127.0.0.1:27017/${dB}`;

mongoose
  .connect(db_URL)
  .then(() => {
    console.log("Connected with DB:", dB);
  })
  .catch((err) => {
    console.log("Error with connection: ", err);
  });
const genres = [
  "Comedy",
  "Horror",
  "Drama",
  "Action",
  "History",
  "Mystery",
  "Supernatural",
  "Science-Fiction",
  `Adventure`,
].sort();
const countries = ["Japan", "United States", "Canada"].sort();
const keys = [
  `score`,
  `name`,
  `genres`,
  `language`,
  `status`,
  `premiered`,
  `ended`,
  `country`,
  `image`,
  `summary`,
];

const movieSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  genres: {
    type: [String],
    required: true,
    lowercase: true,
    trim: true,
    enum: genres,
  },
  language: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    // enum: ["Running", "Ended", "In Development", "To Be Determined"],
  },
  premiered: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  ended: {
    type: String,
    lowercase: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    medium: {
      type: String,
      lowercase: true,
      trim: true,
    },
    original: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  summary: {
    type: String,
    required: true,
    trim: true,
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});
const Movie = mongoose.model("Movie", movieSchema);

// const Movie=mongoose.model("Movie",movieSchema);

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    minLength: [5, "name must have minimum 5 letters"],
    maxLength: [50, "name must have maximal 20 letters"],
    required: true,
  },
  // password: {
  //   type: String,
  //   trim: true,
  //   minLength: [8, "password must have minimum 8 letters"],
  //   maxLength: [20, "password must have maximal 20 letters"],
  //   required: true,
  // },
  mail: {
    type: String,
    trim: true,
    required: true,
  },
  favMovies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});
userSchema.plugin(passportLocalMongoose);
userSchema.post("findOneAndDelete", async function (user) {
  if (user.comments.length) {
    const amount = await Review.deleteMany({ _id: { $in: user.comments } });
    console.log(`${amount.length} comments deleted`);
  }
});
const User = mongoose.model("User", userSchema);
const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  body: {
    type: String,
    maxLength: [150, "Your review cannot be longer than 150 characters"],
    trim: true,
  },
  note: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  serial: { type: Schema.Types.ObjectId, ref: "Movie" },
});
const Review = mongoose.model("Review", reviewSchema);

module.exports.User = User;
module.exports.keys = keys;
module.exports.Movie = Movie;
module.exports.Restore = mongoose.model("Restore", movieSchema);
module.exports.genres = genres;
module.exports.countries = countries;
module.exports.movieSchema = movieSchema;
module.exports.Review = Review;
