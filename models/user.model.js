const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

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
  },
  birthday: {
    type: Date,
    required: false,
  },
}, { timestamps: true });

userSchema.pre('save', function () {
  const user = this;
  if (!user.isModified('password')) return;

  const salt = bcrypt.genSaltSync(8);
  const hashPassword = bcrypt.hashSync(user.password, salt);

  user.password = hashPassword;
});

const User = model('users', userSchema);
module.exports = User;
