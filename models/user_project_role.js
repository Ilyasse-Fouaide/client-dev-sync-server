const { Schema, model } = require('mongoose');

const userProjectRoleSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    enum: {
      values: ['administrator', 'member', 'guest'],
      message: '\'{VALUE}\' is not a valid name try: \'administrator, member or guest\''
    }
  },
}, { timestamps: true });

const UserProjectRole = model('user_projects_role', userProjectRoleSchema);
module.exports = UserProjectRole
