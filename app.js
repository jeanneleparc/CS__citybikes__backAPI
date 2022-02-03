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
      const allowedOrigins = ["http://localhost:4200", "http://127.0.0.1:4200"];
      const { origin } = req.headers;
      if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }
      res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.header("Access-Control-Allow-Credentials", true);
      next();
    });
  }

  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
