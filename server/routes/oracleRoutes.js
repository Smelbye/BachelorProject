const express = require('express');
const router = express.Router();
const path = require('path');
const oracleController = require(path.join(__dirname, '..', 'controllers', 'oracleController'));


router.post('/oracle', oracleController.callOracleScript);

module.exports = router;

