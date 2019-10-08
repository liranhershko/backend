const User = require("../models/user");

exports.signup = function(req, res, next) {
  console.log("###################")
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

      return res.json({ success: true });
    });
  });
};
