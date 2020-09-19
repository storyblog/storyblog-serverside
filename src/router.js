'use strict';

/* --------------------------------- require -------------------------------- */

require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user-model');
const Blog = require('../models/blog-model');

const bearerMiddleware = require('../middileware/bearer-auth');

/* ---------------------------- route definitions --------------------------- */
//POL
router.get('/', (req, res) => {
  res.send('Welcome..');
});

router.get('/view-blogs', viewBlogsHandler);
router.post('/create-blog', bearerMiddleware, createBlogHandler);
router.post('/append-blog/:blogId', bearerMiddleware, appendBlogHandler);
router.get('/edit/:blogId', bearerMiddleware, editHandler);
router.post('/edit-contribution/:contId', bearerMiddleware, editBlogHandler);

/* ----------------------------- route handlers ----------------------------- */

function viewBlogsHandler(req, res) {
  Blog.read()
    .then(data => {
      res.status(200).json(data);
    });
}

function createBlogHandler(req, res) {
  let newBlog = req.body;
  newBlog.lastUpdate = newBlog.date;
  Blog.create(newBlog)
    .then(data => {
      User.addBlogID(req.user.username, data._id, 'create')
        .then(() => {
          res.status(201).json(data);
        });
    });
}
 
function appendBlogHandler(req, res) {
  const blogId = mongoose.Types.ObjectId(req.params.blogId);
  Blog.addToBlog(blogId, req.body)
    .then(data => {
      User.addBlogID(req.user.username, blogId, 'append');
      res.status(201).json(data);
    });
}

//user requesting to edit a blog
function editHandler(req, res) {
  const blogId = mongoose.Types.ObjectId(req.params.blogId);
  Blog.getContributions(blogId, req.user.username, req.user.role)
    .then(data => {
      if (data.length) res.status(200).json(data);
      else res.status(200).send('You don\'t have any appended contributions to this blog.' );
    });
}

function editBlogHandler(req, res) {
  const contId = mongoose.Types.ObjectId(req.params.contId);
  Blog.editContribution(contId, req.body, req.user.username, req.user.role)
    .then(data => {
      res.status(200).json(data);
    });
}

module.exports = router;
