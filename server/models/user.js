const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On save hook, encrypt password
// Run before saved
userSchema.pre('save', function(next) {
  // Get acess to user model
  const user = this;

  // Generate salt and run callback
  bcrypt.genSalt(10, function(err, salt){
    if(err) return next(err);

    // Hash(encrypt) user password using salt
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err) return next(err);

      // Overwrite plain text password with salt + hashed password
      user.password = hash;
      next();
    });
  });
});

// Compare encrypt login password with db password
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return callback(err);

    callback(null, isMatch);
  })
}

// Create the model class
const User = mongoose.model('user', userSchema);

// Export the model
module.exports = User;
