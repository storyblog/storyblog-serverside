'use strict';

const mongoose = require('mongoose');

const blog = mongoose.Schema({
  title: { type: String, required: true },
  authorname: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  content: { type: String, required: true },
  lastUpdate: { type: Date },
  // author_id: { type: mongoose.Schema.Types.ObjectId },
  contributions: [{
    c_usernam: { type: String }, //the name of the user who appended to the story (including the author)
    added_content: { type: String }, //the appended content (including the original content)
    lastDate: { type: Date, default: Date.now },
  }],
});

module.exports = mongoose.model('blog',blog);
