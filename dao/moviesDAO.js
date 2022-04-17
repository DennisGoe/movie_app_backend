import mongodb, { ObjectId } from "mongodb";
const objectId = mongodb.ObjectId;

let movies;

export default class MoviesDAO {
  static async injectDB(conn) {
    if (movies) {
      return;
    }
    try {
      movies = await conn.db(process.env.RESTREVIEWS_NS).collection("movies");
    } catch (e) {
      console.log("unable to establish connection in handle movies");
    }
  }
  static async getMovies({
    filters = null,
    page = 0,
    moviesPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      }
    }
    let cursor;

    try {
      cursor = await movies.find(query);
    } catch (e) {
      console.log("unable to issue find command");
      return {
        moviesList: [],
        totalNumMovies: 0,
      };
    }

    const displayCursor = cursor
      .limit(moviesPerPage)
      .skip(moviesPerPage * page);

    try {
      const moviesList = await displayCursor.toArray();
      const totalNumMovies = await movies.countDocuments(query);
      return { moviesList, totalNumMovies };
    } catch (e) {
      console.log(
        "unable to convert cursor to array or problem counting documents"
      );
      return { moviesList: [], totalNumMovies: 0 };
    }
  } // end getmovies

  static async addNewMovie(name, rating) {
    try {
      const newMovie = {
        name,
        rating,
      };
      return await movies.insertOne(newMovie);
    } catch (e) {
      console.log("unable to create new movie");
      return { error: e };
    }
  }

  static async updateMovie(movieId, name, rating) {
    try {
      const updateResponse = await movies.updateOne(
        { _id: objectId(movieId) },
        { $set: { name: name, rating: rating } }
      );
      return updateResponse;
    } catch (e) {
      console.log("unable to update movie");
      return { error: e };
    }
  }

  static async deleteMovie(movieId) {
    try {
      const deleteResponse = await movies.deleteOne({
        _id: ObjectId(movieId),
      });
      return deleteResponse;
    } catch (e) {
      console.log("unable to delete review");
      return { error: e };
    }
  }
}
