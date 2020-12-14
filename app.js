require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const logger = require("pino-http")({

  customAttributeKeys: {
    req: "request",
    res: "response",
    err: "error",
    responseTime: "timeTaken",
  },

  customSuccessMessage: function (res) {
    if (res.statusCode === 404) {
      return "resource not found";
    } else if (res.statusCode === 409) {
      return "request conflit or Auth Fail";
    } else if (res.statusCode === 500) {
      return "Server Error";
    }
    return "request completed";
  },

});

//routs
const userRoutes = require("./api/routes/userRouts");
const genresRoute = require("./api/routes/genre");
const bookRouts = require("./api/routes/book");
const readRouts = require("./api/routes/read");
const reviewRouts = require("./api/routes/review");

//server
if (process.env.NODE_ENV !== "test") {
  app.use(logger);
}
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
//Routes Which handles requests
app.use("/user", userRoutes);
app.use("/genre", genresRoute);
app.use("/book", bookRouts);
app.use("/read", readRouts);
app.use("/review", reviewRouts);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  // logger(req, res);
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
