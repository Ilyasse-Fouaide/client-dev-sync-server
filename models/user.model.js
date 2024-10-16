const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config')

const userSchema = new Schema({
  full_name: {
    type: String,
    required: [true, 'full name required']
  },
  email: {
    type: String,
    required: [true, 'email required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'password required']
  },
  role: {
    type: String,
    required: [true, 'password required'],
    enum: {
      values: ['user', 'admin'],
      message: 'expected \'user, admin\' but got {VALUE}'
    },
    default: 'user'
  },
  location: {
    type: String,
    required: false,
    default: null,
  },
  birthday: {
    type: Date,
    required: false,
    default: null,
  },
}, { timestamps: true });

userSchema.pre('save', function () {
  const user = this;
  /**
   * Returns true if any of the given paths are modified, else false. If no arguments, returns true if any path in this document is modified.
  */
  console.log(user.isModified('password'));
  if (!user.isModified('password')) return;

  const salt = bcrypt.genSaltSync(8);
  const hashPassword = bcrypt.hashSync(user.password, salt);

  user.password = hashPassword;
});

userSchema.methods.comparePassword = async function (passwordString, hashedPassword) {
  return await bcrypt.compare(passwordString, hashedPassword);
};

userSchema.methods.genRefreshToken = function () {
  return jwt.sign({
    userId: this._id,
    email: this.email,
    role: this.role
  }, config.JWT_SECRET_KEY, { expiresIn: config.JWT_REFRESHTOKEN_LIFETIME || '7d' });
};

const User = model('users', userSchema);
module.exports = User;
