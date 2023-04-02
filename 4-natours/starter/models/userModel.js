const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//create schema for user database
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
  },
  email: {
    type: String,
    required: [true, 'User must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'User must have a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'User must confirm password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  photo: String,
  passwordChangedAt: Date,
});

// Middleware

// encrypt password in pre save middleware
userSchema.pre('save', async function (next) {
  // only run when modified password
  if (!this.isModified('password')) return next();

  // hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // set password confirm to undefined, bc we need it only for validate password on create
  this.passwordConfirm = undefined;

  next();
});

// instance method is available for all documents in certain collection
// check password from login with password from database
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// another instance method
// check if user changed password when token is active
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

//create model
const User = mongoose.model('User', userSchema);

module.exports = User;
