const { Movie, Review, User } = require("../../dataBase");
const createReviews = async function (SerId, UserId) {
  const serial = await Movie.findById(SerId);
  const creator = await User.findById(UserId);
  const comment = new Review({
    body: "what a great Serial",
    user: creator._id,
    note: 7,
    serial: serial._id,
  });
  creator.comments.push(comment);
  serial.reviews.push(comment);
  await comment.save();
  await creator.save();
  await serial.save();
};

createReviews("65bd141857a384e41732a3ef", "65bcc5027547b94de261718e");
