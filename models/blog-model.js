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

  //Append to a blog
  /**
   * @param {ObjectId} blogId 
   * @param {Object} contributionBody
   */
  async addToBlog(blogId, contributionBody) {
    return await blogSchema.findOneAndUpdate({ _id: blogId }, { $push: { contributions: contributionBody } });
  }

  //Retrieve the contributions the user appended to a blog
  async getContributions(blogId, username) {
    return await blogSchema.find({ username }, { contributions: { $elemMatch: { _id: blogId } } });
  }

  //Edit an appended contribution
  async editContribution(contributionId, contributionBody) {
    return await blogSchema.findOneAndUpdate({ contributions: { $elemMatch: { _id: contributionId } } }, { $push: { contributions: contributionBody } });
  }

}

module.exports = new Blog();
