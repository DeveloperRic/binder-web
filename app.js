var createError = require("http-errors");
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressValidator = require("express-validator");
var session = require("express-session");
var dotenv = require("dotenv");
var passport = require("passport");
var Auth0Strategy = require("passport-auth0");
var MongoStore = require("connect-mongo")(session);
var mongoose = require("mongoose");
// var cors = require("cors");

mongoose.set('useFindAndModify', false);
mongoose
  .connect("mongodb+srv://web:dDbUSRI4hPWoPFzH@binder-hkqjh.gcp.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("Connected to MongoDB database"))
  .catch(err => console.error("Failed to connect to database", err));

const G = require("./config/globals");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  express.static(path.join(__dirname, "public"), {
    immutable: true,
    maxAge: 5 * 1000,
    setHeaders: res => res.status(200)
  })
);

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Express session
let sesh = {
  secret: "$2a$10$JoQJPkqmDHBcfql.C9hEWOSt4J76dy8CNvIVKjCKwiFWFjLVfXRZi",
  saveUninitialized: true,
  resave: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {} //  maxAge: 120 * 60 * 1000  2 hours later experies the session
};
if (app.get("env") === "production") {
  sesh.cookie.secure = true; // serve secure cookies, requires https
}
app.use(session(sesh));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

// Dotenv init
dotenv.config();

// Passport initialize
// // - auth0 strategy
// passport.use(
//   new Auth0Strategy(
//     {
//       domain: process.env.AUTH0_DOMAIN,
//       clientID: process.env.AUTH0_CLIENT_ID,
//       clientSecret: process.env.AUTH0_CLIENT_SECRET,
//       callbackURL: process.env.AUTH0_CALLBACK_URL
//     },
//     (accessToken, refreshToken, extraParams, profile, done) => {
//       // accessToken is the token to call Auth0 API (not needed in the most cases)
//       // extraParams.id_token has the JSON Web Token
//       // profile has all the information from the user
//       return done(null, profile);
//     }
//   )
// );
// - Serialize user
passport.serializeUser(function(user, done) {
  done(null, user);
});
// - Deserialize user
passport.deserializeUser(function(user, done) {
  done(null, user);
});
// - finalise passport setup
app.use(passport.initialize());
app.use(passport.session());

// Express validator
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;
      while (namespace.lenght) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

app.use("/", indexRouter);
app.use("/user", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (req.originalUrl.startsWith("/api")) {
    try {
      G.errorResponse(
        err.status || 500,
        err.message,
        err.stack.split("\n"),
        res
      );
    } catch (error) {
      G.errorResponse(err.status || 500, err.message, err, res);
    }
  } else {
    res.render("error", {
      message: "Something went wrong",
      customNavbar: "registration-navbar",
      containerWrapper: "container",
      errorStatus: err.status || 500
    });
  }
});

module.exports = app;
