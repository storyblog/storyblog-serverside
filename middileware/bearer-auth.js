'use strict';

const users = require('../models/users');

module.exports = (req, res, next) => {
  if (!req.headers.cookie && !req.headers.cookies) {
    next('You Must Log-in');
    return;
  }
  if (req.headers.cookie) {
    const bearerToken = req.cookies['remember token'];
    users.verifyToken(bearerToken).then(userInfo => {
      req.user = userInfo;
      next();
    }).catch(err => next('Invalid User Token'));
  } else {
    const subToken = req.headers.cookies;
    users.verifyToken(subToken).then(userInfo => {
      req.user = userInfo;
      next();

    }).catch(err => next('Invalid User Token'));
  }
};
