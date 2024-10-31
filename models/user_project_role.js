const { Schema, model } = require('mongoose');

const userProjectRoleSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    enum: ['administrator', 'memmber', 'guest']
  },
}, { timestamps: true });

const UserProjectRole = model('user_projects_role', userProjectRoleSchema);
module.exports = UserProjectRole
