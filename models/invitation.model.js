const { Schema, model, Types } = require('mongoose');

const invitationSchema = new Schema({
  sender: {
    type: Types.ObjectId,
    ref: 'users'
  },
  project: {
    type: Types.ObjectId,
    ref: 'projects'
  },
  recipient: {
    type: Types.ObjectId,
    ref: 'users'
  },
  role: {
    type: Types.ObjectId,
    ref: 'user_projects_role'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted'],
    default: 'pending',
  },
  token: {
    type: String,
  },
  isValid: {
    type: Boolean,
    required: true,
    default: true,
  },
}, { timestamps: true });

const Invitation = model('invitations', invitationSchema);
module.exports = Invitation;
