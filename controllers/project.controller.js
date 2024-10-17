const { StatusCodes } = require("http-status-codes");
const tryCatchWrapper = require("../tryCatchWrapper");
const Project = require("../models/project.model");
const UserProject = require('../models/user_project.model');
const Error = require("../customError");

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

  res.status(StatusCodes.OK).json({
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

exports.sendAcceptationEmail = () => { };
exports.assingProtjectRole = () => { };
