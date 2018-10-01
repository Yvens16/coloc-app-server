require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passportSetup = require("./config/passport/passport-setup.js");
const path = require("path");

mongoose
  .connect(
    "mongodb://localhost/coloc-app-server",
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Allow Cross-Origin Resource Sharing (cors)
// (access the API from the frontend JavaScript on a different domain/origin)
app.use(
  cors({
    // allow other domains/origins to send cookies
    credentials: true,
    // this is the domain we want cookies from (our React app)
    origin: ["http://localhost:3000"]
  })
);

// Session setup AFTER CORS
app.use(
  session({
    secret: "azertyuiop123",
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// Passport setup AFTER SESSION
passportSetup(app);

const flatRouter = require("./routes/flat-router.js");
app.use("/api", flatRouter);

const authRouter = require("./routes/auth-router.js");
app.use("/api", authRouter);

const fileRouter = require("./routes/file-router.js");
app.use("/api", fileRouter);

module.exports = app;
