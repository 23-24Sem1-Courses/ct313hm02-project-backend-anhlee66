const express = require("express");
const expressValidator = require("express-validator");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const zip = require("express-zip");
const { engine } = require("express-handlebars");
const path = require("path");
const app = express();
const router = require("./routes/route");
const {
  resourceNotFound,
  handleError,
} = require("./controller/error.controller");

const css = "node_modules/bootstrap/dist/css";
const js = "node_modules/bootstrap/dist/js";
const jquery = "node_modules/jquery/dist";

// Set view engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "views");

app.use("/css", express.static(css));
app.use("/js", express.static(js));
app.use("/js", express.static(jquery));

//Set public folder
// app.use(express.static("public"));
app.use("/image", express.static("public/avatar"));
// app.use("/image", express.static("public"));
app.use("/files", express.static("public/files"));

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
  res.render("home");
  // res.send("ok");
});
app.get("/login", (req, res) => {
  res.render("login", { layout: "second" });
});
app.get("/signup", (req, res) => {
  res.render("signup", { layout: "second" });
});

app.use("/api", router);
app.use(resourceNotFound);
app.use(handleError);
module.exports = app;
