const express = require('express');
const router = express.Router();
const project = require('../controllers/project.controller');
const authorized = require('../middlewares/authorized');

router.route('/:projectId/members')
  .get(authorized, project.getProjectMembers);

router.route('/:projectId/send-invitation')
  .post(authorized, project.sendInvitationEmail);

router.route('/invitations/:invitationId/accept/:token')
  .post(authorized, project.acceptInvitation);

router.route('/:projectId')
  .get(authorized, project.getSingleProject)
  .patch(authorized, project.update)
  .delete(authorized, project.delete);

router.route('/invitations')
  .get(authorized, project.getMyInvitations);

router.route('/my-joined-projects')
  .get(authorized, project.myJoinedProjects);

router.route('/')
  .get(authorized, project.myProjects)
  .post(authorized, project.create);

module.exports = router
