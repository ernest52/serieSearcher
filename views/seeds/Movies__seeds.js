const axios = require("axios");
const moduls = require("../../dataBase");
const Movie = moduls.Movie;
const genres = moduls.genres;
const countries = moduls.countries;
const { keys } = require("../../dataBase");
const { checkElements } = require("../../public/scripts/functions");
const { data } = require("autoprefixer");

// const comedy = await axios.get("https://api.tvmaze.com/search/shows?q=comedy");
// console.log(comedy);

async function getData(query) {
  // const data = await axios.get("https://api.tvmaze.com/search/shows?q=", query);
  try {
    const response = await axios.get(
      `https://api.tvmaze.com/search/shows?q=${query}`
    );
    let dataArray = response.data;
    const currentMovies = await Movie.find();
    // console.log(currentMovies);
    // for (let data of dataArray)
    const serials = [];
    dataArray.forEach(async (data) => {
      const image = data.show.image;
      const text = data.show.summary;
      let country = countries.includes(data.show.network?.country.name)
        ? data.show.network.country.name
        : "";
      let genre = [];
      let genresArray = data.show.genres;
      genresArray.forEach((g) => {
        if (g && genres.includes(g)) {
          genre.push(g);
        }
      });
      // if (genre[0]) {
      //   console.log(genre);
      // }

      if (image && text && genre[0] && country) {
        const newMovie = new Movie({
          score: data.score,
          name: data.show.name,
          genres: genre,
          language: data.show.language,
          status: data.show.status,
          premiered: data.show.premiered,
          ended: data.show.ended ? data.show.ended : "",
          country,
          image: {
            medium: image.medium,
            original: image.original,
          },
          summary: text,
        });
        let theSame = false;
        currentMovies.forEach((movie) => {
          if (checkElements(movie, newMovie)) {
            theSame = true;
          }
        });
        // console.log(`the Same: ${theSame}`);

        serials.push(newMovie);
        if (!theSame) {
          await newMovie.save();
        }
      }
    });
    return serials;
  } catch (err) {
    console.log("Error with connection: ", err);
  }
}

genres.forEach((genre, index) => {
  if (index) {
    getData(genre);
  }
});

countries.forEach((c) => getData(c));
module.exports = getData;
