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
  recipient_email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: false,
    enum: ['client'],
    default: 'client'
  },
  status: {
    type: String,
    required: true,
    enum: ['in progress', 'accepted'],
    default: 'in progress',
  },
  token: {
    type: String,
    required: true,
  },
  isValid: {
    type: Boolean,
    required: true,
    default: true,
  },
}, { timestamps: true });

const Invitation = model('invitations', invitationSchema);
module.exports = Invitation;
