const cookieParser = require("cookie-parser");
const session = require("express-session");
const express = require("express");
const app = express();
const path = require("path");
const flash = require("express-flash");
const { initialize } = require("./config/account.js");

app.disable("x-powered-by");
app.set("view engine", "ejs");
app.use("/public", express.static(path.resolve(__dirname, "public")));

app.use(cookieParser());
app.use(
  session({
    secret: "patao",
    cookie: {
      maxAge: 2592000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(...initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", require("./routes/index.js"));
app.use("/search", require("./routes/search.js"));
app.use("/content", require("./routes/content.js"));
app.use("/account", require("./routes/account.js"));
app.use("/api", require("./routes/api/index.js"));

app.use((req, res, next) => {
  const data = {
    method: req.method,
    url: req.url,
    protocol: req.protocol,
    version: req.httpVersion,
  };
  res.status(404);
  if (req.xhr) {
    res.json(data);
  } else {
    res.render("404.ejs", { data });
  }
});

app.use((err, req, res, next) => {
  const data = {
    method: req.method,
    url: req.url,
    protocol: req.protocol,
    version: req.httpVersion,
    error:
      process.env.NODE_ENV === "development"
        ? {
            name: err.name,
            messege: err.message,
            stack: err.stack,
          }
        : undefined,
  };
  res.status(500);
  if (req.xhr) {
    res.json(data);
  } else {
    res.render("500.ejs", { data });
  }
});

app.listen(5000);
