var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

//creates schema for users
var userSchema = mongoose.Schema({
  username: {type: String, required: true, index:{unique:true} },
  password: { type: String, required: true }
});


//create model of users
var User = mongoose.model('User', userSchema);

// User.hashPassword = function(next){
//   var cipher = Promise.promisify(bcrypt.hash);
//   return cipher(this.password, null, null).bind(this)
//     .then(function(hash) {
//       this.password = hash;
//       next();
//   });
// };

User.comparePassword = function(attemptedPassword, password, callback) {
  bcrypt.compare(attemptedPassword, password, function(err, isMatch) {
    if(err){
      return callback(err);
    }
    callback(null, isMatch);
  });
};

userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});
module.exports = User;
// not currently working
// userSchema.pre('save', function(next){
//   this.hashPassword(next);
// });

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//   },
// });

