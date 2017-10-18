const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user){
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // User has already had their email and password authenticated
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  // Check if email and password is sent
  if(!email || !password){
    return res.status(422).send({ error: 'You must provide both email and password' });
  }

  // Check if user email exist
  User.findOne({ email: email.toLowerCase() }, function(err, existingUser) {
    if(err) return next(err);

    // If user email exist return an error
    if(existingUser){
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If user email doest NOT exist
    const user = new User({
      email: email.toLowerCase(),
      password: password
    });

    user.save(function(err){
      if(err) return next(err)

      // Respond to indicate user was created
      res.json({ token: tokenForUser(user) });
    });

  });
}
