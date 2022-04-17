import express from "express";
import MoviesController from "./movies.controller.js";

const router = express.Router();

router
  .route("/")
  .get(MoviesController.apiGetMovies)
  .post(MoviesController.apiCreateMovie)
  .put(MoviesController.apiUpdateMovie)
  .delete(MoviesController.apiDeleteMovie);

export default router;
