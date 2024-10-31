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
    type: Types.ObjectId,
    ref: 'user_projects_role',
  },
}, { timestamps: true });

const UserProject = model('user_projects', userProjectSchema);
module.exports = UserProject;
