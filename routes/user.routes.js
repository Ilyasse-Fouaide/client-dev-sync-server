const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');
const authorized = require('../middlewares/authorized');

router.route('/:userId')
  .get(authorized, user.getUser)
  .put(authorized, user.updateUser);

module.exports = router
