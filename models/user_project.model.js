const { Schema, model, Types } = require('mongoose');

const userProjectSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'users',
  },
  project: {
    type: Types.ObjectId,
    ref: 'projects',
  },
  role: {
    type: String,
    required: [true, 'role is required'],
    enum: ['owner', 'client'],
  },
}, { timestamps: true });

const UserProject = model('user_projects', userProjectSchema);
module.exports = UserProject;
