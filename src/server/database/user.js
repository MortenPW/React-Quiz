const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);

/*
UserSchema.methods.comparePassword = (candidatePassword, callback) => {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};
*/

//var User = (module.exports = mongoose.model("User", UserSchema));

/*
module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username };
  User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};

module.exports.verifyUser = function(username, password, callback) {
  User.getUserByUsername(username, function(err, user) {
    if (user === undefined) {
      return false;
    }

    console.log(user);
    console.log(user.hash);
    console.log(user.id);
    console.log(user._id);

    console.log(user.password);

    User.comparePassword(password, user.password);
  });
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports.createUser = function(newUser, callback) {
  const exists = User.findById(newUser.id, callback);

  if (exists) {
    return false;
  } else {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
      });
    });
    return true;
  }
  
};
*/
