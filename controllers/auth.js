const jwt = require("jwt-simple");
const User = require("../models/user");
const config = require("../config");

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // sub = subject of the token
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // user has already had their email and password auth'd
  // we just need to give them a token

  // user is on the req by the help of passport - it is a param sent on done callback
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "you must provide email and password" });
  }

  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      // db connection error
      return next(err);
    }

    if (existingUser) {
      // 422 - unprocessable entity
      return res.status(422).send({ error: "emails is in use" });
    }

    const user = new User({ email, password });
    user.save(err => {
      if (err) {
        return next(err);
      }

      return res.json({ token: tokenForUser(user) });
    });
  });
};
