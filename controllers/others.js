const { asyncWrap, ErrorApp } = require("../public/scripts/ErrorApp");
const { countries, genres, Movie } = require("../dataBase");
module.exports = asyncWrap(async (req, res) => {
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
});
