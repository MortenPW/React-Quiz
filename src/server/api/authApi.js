const express = require("express");
const passport = require("passport");

const User = require("../database/user");

const router = express.Router();

router.post("/login", passport.authenticate("local"), function(req, res) {
  res.status(204).send();
});

router.post("/signup", function(req, res) {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function(err, user) {
      if (err) {
        // User already exist
        return res.status(400).send();
      }

      passport.authenticate("local")(req, res, () => {
        req.session.save(err => {
          if (err) {
            return next(err);
          }
          // OK
          res.status(204).send();
        });
      });
    }
  );
});

router.post("/logout", function(req, res) {
  req.logout();
  res.status(204).send();
});

router.get("/user", function(req, res) {
  if (!req.user) {
    res.status(401).send();
    return;
  }

  res.status(200).json({ username: req.user.username });
});

module.exports = router;
