const { StatusCodes } = require("http-status-codes");
const tryCatchWrapper = require("../tryCatchWrapper");
const Project = require("../models/project.model");
const UserProject = require('../models/user_project.model');
const Error = require("../customError");
const Invitation = require("../models/invitation.model");
const { v4: uuidv4 } = require('uuid')

exports.index = tryCatchWrapper(async (req, res, next) => {
  const { userId } = req.user;

  const userProjects = await UserProject
    .find({ user: userId })
    .populate({ path: 'user', select: '_id full_name email' })
    .populate({ path: 'project', select: '_id name' });

  res.status(StatusCodes.OK).json(userProjects);
});

exports.create = tryCatchWrapper(async (req, res, next) => {
  const { name, role } = req.body;
  const { userId } = req.user;

  if (!name || !role) return next(Error.badRequest('name or role required'));

  const project = new Project();
  const userProject = new UserProject();

  project.name = name;

  userProject.user = userId;
  userProject.project = project._id;
  userProject.role = role;

  await project.save();
  await userProject.save();

  res.status(StatusCodes.CREATED).json({
    project: {
      description: project.description,
      icon: project.icon,
      name: project.name,
    },
    userProject: {
      role: userProject.role,
    }
  });
});

exports.sendInvitationEmail = tryCatchWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const { projectId } = req.params;
  const { recipient, role } = req.body;

  // Generate a unique token
  const token = uuidv4();

  // only my own projects has access to send email invi
  const projectOwner = await UserProject.findOne({
    project: projectId,
    user: userId,
    role: 'owner' // Assuming the role field indicates ownership
  });

  if (!projectOwner) return next(Error.unAuthorized('You don\'t have access to send email for this project'));

  const invitation = new Invitation({
    sender: userId,
    project: projectId,
    recipient,
    role,
    token,
  });

  await invitation.save();

  res.status(StatusCodes.CREATED).json(invitation);
});

exports.getMyInvitations = tryCatchWrapper(async (req, res, next) => {
  // Find all invitations where the user is the recipient
  const invitations = await Invitation.find({
    recipient: req.user.userId
  })
    .populate({ path: 'project', select: '_id description name icon' })
    .populate({ path: 'sender', select: '_id email' })
    .populate({ path: 'recipient', select: '_id email' });

  res.status(StatusCodes.OK).json(invitations);
});

exports.acceptInvitation = tryCatchWrapper(async (req, res, next) => {
  res.status(StatusCodes.OK).json({ message: true });
});

exports.trackInvitations = tryCatchWrapper(async (req, res, next) => {
  res.status(StatusCodes.OK).json({ message: true });
});
