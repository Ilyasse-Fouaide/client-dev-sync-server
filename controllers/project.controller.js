const { StatusCodes } = require("http-status-codes");
const tryCatchWrapper = require("../tryCatchWrapper");
const Project = require("../models/project.model");
const UserProject = require('../models/user_project.model');
const UserProjectRole = require('../models/user_project_role');
const Error = require("../customError");
const Invitation = require("../models/invitation.model");
const { v4: uuidv4 } = require('uuid');
const { Types } = require("mongoose");

exports.myProjects = tryCatchWrapper(async (req, res, next) => {
  const { userId } = req.user;

  // get the administrator role
  const administratorRole = await UserProjectRole.findOne({ name: 'administrator' });

  if (!administratorRole) {
    return next(Error.notFound('Administrator role not found'));
  }

  // If the user has admin privileges, retrieve all projects created by someone
  // Otherwize get all projects that created by me.
  const search = req.user.role === "admin"
    ? { role: administratorRole._id }
    : { user: userId, role: administratorRole._id };

  const userProjects = await UserProject
    .find(search)
    .populate({ path: 'user', select: 'full_name email' })
    .populate({ path: 'project', select: 'name icon' })
    .populate({ path: 'role', select: 'name' });

  res.status(StatusCodes.OK).json(userProjects);
});

exports.myJoinedProjects = tryCatchWrapper(async (req, res, next) => {
  const { userId } = req.user;

  // get member role
  const memberRole = await UserProjectRole.findOne({ name: 'member' });

  if (!memberRole) {
    return next(Error.notFound('member role not found'));
  }

  // Query for user projects where the user has the role of 'member'
  const projects = await UserProject
    .find({ user: userId, role: memberRole._id })
    .populate({ path: 'user', select: '_id full_name email' })
    .populate({ path: 'project', select: '_id name icon' })
    .populate({ path: 'role', select: 'name' });

  res.status(StatusCodes.OK).json(projects);
});


exports.create = tryCatchWrapper(async (req, res, next) => {
  const { name, description } = req.body;
  const { userId } = req.user;

  const project = new Project();
  const userProject = new UserProject();

  const administratorRole = await UserProjectRole.findOne({ name: 'administrator' });

  if (!administratorRole) {
    return next(Error.notFound('Administrator role not found'));
  }

  project.name = name;
  project.description = description || "";

  userProject.user = userId;
  userProject.project = project._id;
  userProject.role = administratorRole._id;

  await project.save();
  await userProject.save();

  res.status(StatusCodes.NO_CONTENT).json();
});

exports.getSingleProject = tryCatchWrapper(async (req, res, next) => {
  const { projectId } = req.params;
  const { role, userId } = req.user;
  const projectObjectId = new Types.ObjectId(projectId);
  const userObjectId = new Types.ObjectId(userId);

  const userProject = await UserProject.findOne({ project: projectObjectId });

  if (!userProject) {
    return next(Error.notFound('project not found'));
  }

  const isMyOwnProject = userProject.user.toString() === userObjectId.toString()
  const isAdmin = role === 'admin'

  // update here
  // only admin can see other projects
  if (!isAdmin && !isMyOwnProject) {
    return next(Error.unAuthorized('You are not allowed to see this project'))
  }

  const project = await UserProject
    .findOne({ project: projectObjectId })
    .populate({ path: 'user', select: 'full_name email image' })
    .populate({ path: 'project', select: 'name icon' })
    .populate({ path: 'role', select: 'name' });

  if (!project) {
    return next(Error.notFound('Project not found'));
  }

  res.status(StatusCodes.OK).json(project);
});

exports.getProjectMembers = tryCatchWrapper(async (req, res, next) => {
  const { projectId } = req.params;
  const { userId, role } = req.user;
  const projectObjectId = new Types.ObjectId(projectId);
  const userObjectId = new Types.ObjectId(userId);

  const userProject = await UserProject.findOne({ project: projectObjectId });

  if (!userProject) {
    return next(Error.notFound('project not found'));
  }

  const isMyOwnProject = userProject.user.toString() === userObjectId.toString()
  const isAdmin = role === 'admin'

  // non admins role cannot see members of other projects
  if (!isMyOwnProject && !isAdmin) return next(Error.unAuthorized('You are not member of this project'))

  const projectMembers = await UserProject
    .find({ project: projectObjectId }, { project: 0, updatedAt: 0, __v: 0 })
    .populate({ path: 'user', select: '_id full_name email image' })
    .populate({ path: 'role', select: 'name' })

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
