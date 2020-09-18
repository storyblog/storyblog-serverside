'use strict';
/**
 * basic variable
 * @type {string}
 */
const base64 = require('base-64');
const users = require('../models/users');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    res.send('Invalid Login!');
  } else {
    const basic = req.headers.authorization.split(' ').pop();
    const [username, password] = base64.decode(basic).split(':');
    users.authenticateBasic(username, password)
      .then(validator => {
        req.token = users.getToken(validator);
        next();
      }).catch(err => {
        res.send('Invalid Login..');
      });
  }
};
