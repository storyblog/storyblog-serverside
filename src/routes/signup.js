'use strict';
const express = require('express');
const users = require('../../models/users');
const User = require('../../models/user-model');
const router = express.Router();
router.post('/signup', signUpUser);
/**
 * @param {object} req
 * @param {object} res 
 */
function signUpUser(req, res, next) {
  let userInfo = req.body;
  console.log(userInfo);
  users.saveHash(userInfo)
    .then(saveInfo => {
      User.create(saveInfo)
        .then(user => {
          let token = users.getToken(user);
          req.headers.Authorization = `Token ${token}`;
          let day = 86400000;
          res.cookie('remember token', token, {
            expires: new Date(Date.now() + day),
            httpOnly: true,
          });
          res.send(token);
        }).catch(err => {
          res.status(403).send('Invalid Signup! Username is taken');
        });
    }).catch(err => {
      res.status(403).send('Invalid Signup! Username is taken');
    });
}    
module.exports = router;