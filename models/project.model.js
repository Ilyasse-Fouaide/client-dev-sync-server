const { Schema, model } = require('mongoose');

const projetSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  description: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
}, { timestamps: true });

const Project = model('projects', projetSchema);
module.exports = Project;
