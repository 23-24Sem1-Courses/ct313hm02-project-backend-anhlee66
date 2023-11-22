const express = require("express");
const expressValidator = require("express-validator");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const zip = require("express-zip");
const app = express();
const router = require("./routes/route");
const {
  resourceNotFound,
  handleError,
} = require("./controller/error.controller");

// app.use(express.static("public"));
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(
  session({
    secret: "secretkey",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    debug: true,
  })
);

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello Doc App");
});
app.use("/api", router);

app.use(resourceNotFound);
app.use(handleError);
module.exports = app;
