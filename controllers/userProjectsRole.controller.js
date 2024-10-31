const tryCatchWrapper = require("../tryCatchWrapper");
const UserProjectRole = require('../models/user_project_role');
const { StatusCodes } = require("http-status-codes");
const Error = require("../customError");

exports.create = tryCatchWrapper(async (req, res, next) => {
  const role = new UserProjectRole(req.body);
  await role.save();
  res.status(StatusCodes.CREATED).json(role);
});

exports.index = tryCatchWrapper(async (req, res, next) => {
  const roles = await UserProjectRole.find();
  res.status(StatusCodes.OK).json(roles);
});

exports.show = tryCatchWrapper(async (req, res, next) => {
  const { id } = req.params.id

  const role = await UserProjectRole.findById(id);

  if (!role) {
    return next(Error.notFound('project role not found'));
  }

  res.status(StatusCodes.OK).json(role);
});

exports.update = tryCatchWrapper(async (req, res, next) => {
  const { id } = req.params;

  const role = await UserProjectRole.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  if (!role) {
    return next(Error.notFound('project role not found'));
  }

  res.status(StatusCodes.OK).json(role);
});

exports.delete = tryCatchWrapper(async (req, res, next) => {
  const { id } = req.params;

  const role = await UserProjectRole.findByIdAndDelete(id);

  if (!role) {
    return next(Error.notFound('project role not found'));
  }

  res.status(StatusCodes.OK).json(role);
});

exports.deleteMultiple = tryCatchWrapper(async (req, res, next) => {
  const { ids } = req.body;  // arrays of IDs

  if (!Array.isArray(ids) || ids.length === 0) {
    return next(Error.badRequest('An array of IDs is required'));
  }

  const result = await UserProjectRole.deleteMany({ _id: { $in: ids } });
  res.status(StatusCodes.OK).json({ message: `${result.deletedCount} roles deleted successfully` });
});
