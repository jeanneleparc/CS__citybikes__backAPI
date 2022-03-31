const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./src/routes/station_route"); // import the routes

const baseURL = process.env.BASE_URL || "localhost";

const MONGO_URI =
  process.env.MONGO_URI ||
  `mongodb://${baseURL}:27017/citibikes${
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
      res.header("Access-Control-Allow-Origin", `http://${baseURL}`);
      res.header(
        "Access-Control-Allow-Methods",
        "GET,PUT,POST,DELETE,PATCH,OPTIONS"
      );
      res.header("Access-Control-Allow-Headers", "*");
      next();
    });
    this.server.use(bodyParser.json({ extended: true }));
  }

  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
