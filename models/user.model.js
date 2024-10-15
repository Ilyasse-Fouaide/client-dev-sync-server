const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  full_name: {
    type: string,
    required: [true, 'full name required']
  },
  email: {
    type: string,
    required: [true, 'email required'],
    unique: true,
  },
  password: {
    type: string,
    required: [true, 'password required']
  },
  role: {
    type: string,
    required: [true, 'password required'],
    enum: {
      values: ['user', 'admin'],
      message: 'expected \'user, admin\' but got {VALUE}'
    },
    default: 'guest'
  },
  location: {
    type: string,
    required: false,
  },
  birthday: {
    type: date,
    required: false,
  },
}, { timestamps: true });

const User = model('users', userSchema);
module.exports = User;
