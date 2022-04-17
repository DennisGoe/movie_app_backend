import MoviesDAO from "../dao/moviesDAO.js";

export default class MoviesController {
  static async apiGetMovies(req, res, next) {
    const moviesPerPage = req.query.moviesPerPage
      ? parseInt(req.query.restaurantsPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.name) {
      filters.name = req.query.name;
    }

    const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
      filters,
      page,
      moviesPerPage,
    });

    let response = {
      movies: moviesList,
      page: page,
      filters: filters,
      entries_per_page: moviesPerPage,
      total_results: totalNumMovies,
    };
    res.json(response);
  }
  static async apiCreateMovie(req, res) {
    try {
      const name = req.body.name;
      const rating = req.body.rating;
      const movieRespone = await MoviesDAO.addNewMovie(name, rating);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
  static async apiUpdateMovie(req, res) {
    try {
      const movieId = req.body.movieId;
      const name = req.body.name;
      const rating = req.body.rating;
      const movieResponse = await MoviesDAO.updateMovie(movieId, name, rating);
      res.json({ status: "success" });
    } catch (e) {
      console.log("unable to update review");
      return { error: e };
    }
  }

  static async apiDeleteMovie(req, res) {
    try {
      const movieId = req.body.movieId;
      const movieResponse = await MoviesDAO.deleteMovie(movieId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
