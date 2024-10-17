const { Schema, model } = require('mongoose');

const projetSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  description: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
}, { timestamps: true });

const Project = model('projects', projetSchema);
module.exports = Project;
