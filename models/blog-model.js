'use strict';
const blogSchema = require('./schema/blog-schema');

class Blog {
  constructor(blogSchema) {
    this.schema = blogSchema;
  }

  //Add a new blog record
  /**
   * @param {Object} blogObj 
   */
  async create(blogObj) {
    const newBlogDocument = new blogSchema(blogObj);
    newBlogDocument.contributions.push({
      c_usernam: newBlogDocument.authorname,
      added_content: newBlogDocument.content,
      lastDate: newBlogDocument.date,
    });
    return await newBlogDocument.save(blogObj);
  }

  //Retrieve a blog record / all blog records
  /**
   * @param {ObjectId} id 
   */
  async read(id) {
    //if an id is passed, get the record with that id, else get all the records
    if (id) {
      const blogRecord = await blogSchema.findOne({ _id: id });
      return blogRecord || null;
    } else {
      return await blogSchema.find({});
    }
  }

  //recombine the blog's main content after appending/editing contributions
  async combineBlog(blogId) {
    const blogRecord = await blogSchema.findById(blogId);
    const reducer = (accumulator, currentValue) => accumulator+ ' ' + currentValue.added_content;
    const text = blogRecord.contributions.reduce(reducer, '').slice(1);
    await blogSchema.findOneAndUpdate({ _id: blogId }, { content: text });
    return await blogSchema.findById(blogId);
  }

  //Append to a blog
  /**
   * @param {ObjectId} blogId 
   * @param {Object} contributionBody
   */
  async addToBlog(blogId, contributionBody) {
    await blogSchema.findOneAndUpdate({ _id: blogId }, { $push: { contributions: contributionBody } });
    return this.combineBlog(blogId);
  }

  //Retrieve the contributions the user appended to a blog
  async getContributions(blogId, username, userRole) {
    if(userRole === 'Admin')
      return ((await blogSchema.find({ _id: blogId }))[0].content);
    else if (userRole === 'Writer') {
      return ((await blogSchema.find({ _id: blogId }))[0].contributions.filter(cont => cont.c_usernam === username));
    }
  }

  //Edit an appended contribution
  async editContribution(contributionId, contributionBody, username, role) {
    const blogRecord = await blogSchema.findOne({ contributions: { $elemMatch: { _id: contributionId } } });
    const contribution = blogRecord.contributions.filter(cont => cont._id.toString() == contributionId.toString());
    if ( role === 'Admin' || (role === 'Writer' && contribution[0].c_usernam === username) ) {
      const editedCont = await blogSchema.findOneAndUpdate({ contributions: { $elemMatch: { _id: contributionId } } }, { $set: { 'contributions.$': contributionBody } });
      return this.combineBlog(editedCont._id);
    }
  }
}

module.exports = new Blog();
