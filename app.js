const express = require("express");
const mongoose = require("mongoose");
const routes = require("./src/routes/station_route"); // import the routes

const MONGO_URI =
  process.env.MONGO_URI ||
  `mongodb://127.0.0.1:27017/citibikes${
    process.env.NODE_ENV === "test" ? "-test" : ""
  }`;

class App {
  constructor() {
    this.server = express();

    this.middlewares();

    mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "http://localhost:4200");
      next();
    });
  }

  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
