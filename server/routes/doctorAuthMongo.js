const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const authController = require('../authController');

router.post(
  '/login',
  [
    check('username', 'Please include a valid username').notEmpty(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await authController.login(req, res);
  }
);

module.exports = router;
