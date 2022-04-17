import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import MoviesDAO from "./dao/moviesDAO.js";

dotenv.config();

const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;
MongoClient.connect(process.env.RESTREVIEW_DB_URI, {
  wtimeoutMS: 2500,
})
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await MoviesDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  });
