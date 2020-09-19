'use strict';

const mongoose = require('mongoose');

const user = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true }, 
  //c_blogs: an array that contains the IDs of the blogs that the user has created or contributed (appended) to
  c_blogs: [{
    blogId: { type: mongoose.Schema.Types.ObjectId },
  }], 
  role: { type: String, enum: ['Admin', 'Writer'], required: true },
});


module.exports = mongoose.model('user', user);
