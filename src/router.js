'use strict';

/* --------------------------------- require -------------------------------- */

require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user-model');
const Blog = require('../models/blog-model');

const bearerMiddleware = require('../middileware/bearer-auth');
const aclMiddleware = require('../middileware/acl-middleware');

/* ---------------------------- route definitions --------------------------- */
//POL
router.get('/', (req, res) => {
  res.send('Welcome..');
});

router.get('/view-blogs', viewBlogsHandler);
router.get('/create-blog', bearerMiddleware, createBlogHandler);
router.post('/append-blog', bearerMiddleware, appendBlogHandler);


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
  Blog.addToBlog(req.params.blogId);
}

module.exports = router;
