'use strict';

const express = require('express');
const basicAuth = require('../../middileware/basic-auth');
const router = express.Router();

router.post('/signin', basicAuth, signinUser);
/**
 * @param {object} req
 * @param {object} res 
 */
function signinUser(req, res) {
  const token = req.token;
  const day = 86400000;
  res.cookie('remember token', token, {
    expires: new Date(Date.now() + day),
    httpOnly: true,
  });
  res.send(token);
}

module.exports = router;
