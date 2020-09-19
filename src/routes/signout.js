'use strict';

const express = require('express');
const barearAuth = require('../../middileware/bearer-auth');

const router = express.Router();

router.get('/signout', barearAuth, signoutHandler);
/**
 * @param {object} req 
 * @param {object} res 
 */
function signoutHandler(req, res) {
  if(req.headers.cookie) {
    let token = req.headers.cookie.split('=');
    res.cookie('remember token', token, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.send('logout');
  }
}

module.exports = router;
