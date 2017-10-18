const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this email and password, call done with the user
  // If it is the correct email and password
  // Otherwise, call one with false
  User.findOne({ email: email.toLowerCase() }, function(err, user) {
    if(err) return done(err);
    if(!user) return done(null, false);

    // Compare passwords. Is pasword equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
      if(err) return done(err);

      if(!isMatch) return done(null, false);

      return done(null, user);
    });
  });
});

// Setup options for jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('token'),
  secretOrKey: config.secret
};

// Create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exist in out database
  // If it does, call 'done' with that other
  // Otherwiser, call done witout a user object
  User.findById(payload.sub, function(err, user) {
    if(err) return done(err, false);

    if(user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
