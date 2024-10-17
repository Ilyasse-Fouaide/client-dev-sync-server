const express = require('express');
const router = express.Router();
const project = require('../controllers/project.controller');
const authorized = require('../middlewares/authorized');

router.route('/:projectId/send-invitation')
  .post(authorized, project.sendInvitationEmail);

router.route('/')
  .get(authorized, project.index)
  .post(authorized, project.create);

module.exports = router
