const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// on save hook, encrypt password
userSchema.pre("save", function(next) {
  // get access to the user model
  const user = this;

  // generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    // hash the password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }
      console.log(hash);
      // overwrite plain text password with the hashed password
      user.password = hash;
      next();
    });
  });
});

const ModelClass = mongoose.model("user", userSchema);

module.exports = ModelClass;
