const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

// create local strategy
const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // verify this email and password,
  // call done with the user if it is the correct email and password,
  // otherwise call done with false
  User.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false);
    }

    // compare passwords - is password equal to user.password?
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
});

// setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
};

// create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub, (err, user) => {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      // no error but didn't find a user
      done(null, false);
    }
  });
});

//tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
