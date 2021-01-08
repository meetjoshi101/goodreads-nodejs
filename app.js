require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const serveIndex = require('serve-index');
const multer = require("multer");
const cors = require('cors');
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


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './public/uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });


//server
if (process.env.NODE_ENV !== "test") {
  app.use(logger);
}
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET, OPTIONS");
    return res.status(200).json({});
  }
  next();
});

app.use('/ftp', express.static('public'), serveIndex('public', {'icons': true}));
// eslint-disable-next-line no-unused-vars
app.post('/upload', upload.single('file'), (req, res) => {
  console.log();
  res.status(200).json({url: req.get('host') + '/ftp/uploads/' + req.file.filename})
})
//Routes Which handles requests
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
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
