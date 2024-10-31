const express = require('express');
const router = express.Router();
const userProjectRole = require('../controllers/userProjectsRole.controller');
const authorized = require('../middlewares/authorized');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.route('/roles/:id')
  .get(authorized, adminMiddleware, userProjectRole.show)
  .patch(authorized, adminMiddleware, userProjectRole.update)
  .delete(authorized, adminMiddleware, userProjectRole.delete)

router.route('/roles')
  .get(authorized, adminMiddleware, userProjectRole.index)
  .post(authorized, adminMiddleware, userProjectRole.create)
  .delete(authorized, adminMiddleware, userProjectRole.deleteMultiple);

module.exports = router
