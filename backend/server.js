const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const apiKey = "119cc7279f02f71fc9d5998fba56da11";

app.post("/api/movies", async (req, res) => {
  const { genre, releaseType, country } = req.body;

  try {
    const url = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${apiKey}&genre=${encodeURIComponent(
      genre
    )}&releaseType=${encodeURIComponent(
      releaseType
    )}&country=${encodeURIComponent(country)}`;

    const response = await axios.get(url);

    const movies = response.data.movieListResult.movieList.map((movie) => ({
      movieName: movie.movieNm,
      genre: movie.genreAlt,
      releaseDate: movie.openDt,
      productionYear: movie.prdtYear,
      country: movie.nations.map((nation) => nation.nationNm).join(", "),
    }));

    res.json({ movies });
  } catch (error) {
    console.error("Error fetching data from KOFIC API:", error.message); // 오류 메시지 출력
    res.status(500).json({ error: "Failed to fetch movie information" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
