'use strict';
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user-model');
const SECRET = process.env.SECRET;
let role = {
  Writer: ['READ', 'CREATE', 'UPDATE'],
  Admin: ['READ', 'CREATE', 'UPDATE'],
};
let users = {};
/**
 * 
 * @param {Object} record 
 */
users.saveHash = async function(record) {
  let dataReord = await User.read(record.username);
  if (!dataReord) {
    record.password = await bcrypt.hash(record.password, 5);
    return record;
  } else {
    console.error('user already exists');
    return dataReord;
  }
};
/**
 * 
 * @param {string} user 
 * @param {string} pass
 */
users.authenticateBasic = async function(username, password) {
  const dataReord = await User.read(username);
  let valid = await bcrypt.compare(password, dataReord.password);
  return valid ? dataReord : Promise.reject();
};
/**
 * 
 * @param {Object} user
 */
users.getToken = function(user) {
  let token = jwt.sign({ username: user.username, capabilities: role[user.role], role: user.role }, SECRET);
  return token;
};
/**
 * 
 * @param {string} token
 */
users.verifyToken = async function(token) {
  return jwt.verify(token, SECRET, async function(err, decoded) {
    if (err) {
      console.log('Error :INVALID SECRET OR TOKEN ');
      return Promise.reject(err);
    }
    let username = decoded.username;
    let dataRecord = await User.read(username);
    if (dataRecord) {
      return Promise.resolve(decoded);
    }
    return Promise.reject();
  });
};
module.exports = users;