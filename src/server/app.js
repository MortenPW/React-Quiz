const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const path = require("path");

const authApi = require("./api/authApi");
const User = require("./database/user");

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose
  .connect(
    "mongodb://database:27017/data",
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to docker MongoDB."))
  .catch(() => {
    // Catch- if running server manually
    mongoose
      .connect(
        "mongodb://localhost:27017/data",
        { useNewUrlParser: true }
      )
      .then(() => console.log("Connected to localhost MongoDB."))
      .catch(err => {
        console.error(err);
      });
  });

const app = express();

// Configure parsing of jsons, cookies and sessions
app.use(bodyParser.json());
app.use(
  session({
    secret: "a42g224g#!asdccDSA--_+21Sa_SECRET.OF.OURS",
    resave: false,
    saveUninitialized: false
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// Set strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

/*
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) throw err;
      if (user === "undefined" || user === null) {
        return done(null, false, { message: "Invalid username / password" });
      }

      console.log(user);

      // test a matching password
      user.comparePassword(password, (err, isMatch) => {
        if (err) throw err;
        console.log(password, isMatch); // -> Password123: true
      });
    });

    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: "Invalid username / password" });
      }

      console.log(user);
      console.log(user.password);

      user.comparePassword(password, function(err, isMatch) {
        if (err) throw err;
        console.log(password, isMatch); // -&gt; Password123: true
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid password" });
        }
      });
    });
  })
);
*/

// Api routes
app.use("/api", authApi);

// Handling 404
app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "..", "..", "public", "index.html"));
});

module.exports = app;
