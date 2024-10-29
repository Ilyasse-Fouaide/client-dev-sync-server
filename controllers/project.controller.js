const { StatusCodes } = require("http-status-codes");
const tryCatchWrapper = require("../tryCatchWrapper");
const Project = require("../models/project.model");
const UserProject = require('../models/user_project.model');
const Error = require("../customError");
const Invitation = require("../models/invitation.model");
const { v4: uuidv4 } = require('uuid');
const { Types } = require("mongoose");

exports.index = tryCatchWrapper(async (req, res, next) => {
  const { userId } = req.user;

  // If the user has admin privileges, retrieve all projects created by someone
  // Otherwize get all projects that created by me.
  const search = req.user.role === "admin"
    ? { role: 'owner' }
    : { user: userId, role: 'owner' };

  const userProjects = await UserProject
    .find(search)
    .populate({ path: 'user', select: '_id full_name email' })
    .populate({ path: 'project', select: '_id name icon' });

  res.status(StatusCodes.OK).json(userProjects);
});

exports.joinedProjects = tryCatchWrapper(async (req, res, next) => {
  const { userId } = req.user;

  // Query for user projects where the user has the role of 'client'
  const clientProjects = await UserProject
    .find({ user: userId, role: 'client' })
    .populate({ path: 'user', select: '_id full_name email' })
    .populate({ path: 'project', select: '_id name icon' });

  // If no projects are found, you may want to return an empty array or a message
  res.status(StatusCodes.OK).json(clientProjects);
});


exports.create = tryCatchWrapper(async (req, res, next) => {
  const { name, role, description } = req.body;
  const { userId } = req.user;

  // if (!name) return next(Error.badRequest('role required'));

  const project = new Project();
  const userProject = new UserProject();

  project.name = name;
  project.description = description;

  userProject.user = userId;
  userProject.project = project._id;
  userProject.role = role;

  await project.save();
  await userProject.save();

  res.status(StatusCodes.NO_CONTENT).json();
});


exports.getSingleProject = tryCatchWrapper(async (req, res, next) => {
  const { projectId } = req.params;
  const projectObjectId = new Types.ObjectId(projectId);

  const projectMembers = await UserProject.find({ project: projectObjectId });

  res.status(StatusCodes.OK).json(projectMembers);
});

exports.getProjectMembers = tryCatchWrapper(async (req, res, next) => {
  const { projectId } = req.params;
  const { userId, role } = req.user;
  const projectObjectId = new Types.ObjectId(projectId);

  const userProject = await UserProject.findOne({ user: userId, project: projectObjectId });

  if (!userProject && role !== "admin") return next(Error.unAuthorized('You are not member of this project'))

  const projectMembers = await UserProject
    .find({ project: projectObjectId }, { project: 0, updatedAt: 0, __v: 0 })
    .populate({ path: 'user', select: '_id full_name email' })

  res.status(StatusCodes.OK).json(projectMembers);
});

exports.update = tryCatchWrapper(async (req, res, next) => {
  const { name, description, icon } = req.body;
  const { projectId } = req.params;
  const { userId } = req.user;

  const projectObjectId = new Types.ObjectId(projectId);

  // Check if the user is an owner of the project
  const userProject = await UserProject.findOne({ user: userId, project: projectObjectId, role: 'owner' });

  if (!userProject && req.user.role !== 'admin') return next(Error.unAuthorized('You are not authorized to update this project'));

  const project = await Project.findByIdAndUpdate(projectId, {
    name, description, icon
  }, { new: true, runValidators: true });

  if (!project) return next(Error.notFound('Project not found'));

  res.status(StatusCodes.CREATED).json(project);
});

exports.delete = tryCatchWrapper(async (req, res, next) => {
  const { projectId } = req.params;
  const { userId } = req.user;

  const projectObjectId = new Types.ObjectId(projectId);

  // Check if the user is an owner of the project
  const userProject = await UserProject.findOne({ user: userId, project: projectObjectId, role: 'owner' });

  if (!userProject && req.user.role !== 'admin') return next(Error.unAuthorized('You are not authorized to delete this project'));

  const project = await Project.findByIdAndDelete(projectId);

  if (!project) return next(Error.notFound('Project not found'));

  await UserProject.deleteMany({ project: projectObjectId });

  res.status(StatusCodes.NO_CONTENT).json();
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
    recipient: req.user.userId,
    isValid: true,
  })
    .populate({ path: 'project', select: '_id description name icon' })
    .populate({ path: 'sender', select: '_id email' })
    .populate({ path: 'recipient', select: '_id email' });

  res.status(StatusCodes.OK).json(invitations);
});

exports.acceptInvitation = tryCatchWrapper(async (req, res, next) => {
  const { invitationId, token } = req.params;

  const invitation = await Invitation
    .findOne({ _id: invitationId, token, isValid: true })
    .populate({ path: 'project', select: '_id description name icon' })
    .populate({ path: 'sender', select: '_id email' })
    .populate({ path: 'recipient', select: '_id email' });

  if (!invitation) return next(Error.unAuthorized('Invalid or expired invitation.'));

  const userProject = new UserProject({
    user: req.user.userId,  // same as invitation.recipient
    project: invitation.project._id,
    role: invitation.role,
  });

  await userProject.save();

  invitation.status = 'accepted';
  invitation.token = null;
  invitation.isValid = false;

  await invitation.save();

  res.status(StatusCodes.OK).json({ message: "Invitation accepted successfully." });
});

// ! ---------------------------------------------------------------------------

exports.trackInvitations = tryCatchWrapper(async (req, res, next) => {
  res.status(StatusCodes.OK).json({ message: true });
});

exports.kickMember = tryCatchWrapper(async (req, res, next) => {
  const { projectId, userIdToKick } = req.params;
  const { userId, role } = req.user;
  const projectObjectId = new Types.ObjectId(projectId);

  res.status(StatusCodes.NO_CONTENT).json(); // Respond with no content
});

// admins has functionality that assign member to a project and give them client role
// update membres role > only owner can update roles of the members
// delete member > only owner can kick a member
