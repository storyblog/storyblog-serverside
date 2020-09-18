'use strict';
const userSchema = require('./schema/user-schema');
class User {
  constructor() {
    // this.schema = userSchema;
  }
  //Add a new user record
  /**
   * @param {Object} userObj 
   */
  async create(userObj) {
    const isUser = await userSchema.findOne({ username: userObj.username });
    if (!isUser) {
      const newUserDocument = new userSchema(userObj);
      return await newUserDocument.save(userObj);
    } else {
      throw new Error('Username is taken');
    }
  }
  //Retrieve a user record / all user records
  /**
   * @param {String} username 
   */
  async read(username) {
    //if a username is passed, get the record with that username, else get all the records
    if (username) {
      const userRecord = await userSchema.findOne({ username });
      return userRecord || null;
    } else {
      return await userSchema.find({});
    }
  }
  //Add the id of the blog that the user has created/contributed to in the user record
  /**
   * @param {String} username 
   * @param {ObjectId} blogId 
   * @param {String} action
   */
  async addBlogID(username, blogId, action) {
    if (action === 'create') 
      return await userSchema.findOneAndUpdate({ username }, { $push: { c_blogs: { blogId } } });
    else if (action === 'append') { //check if the blogId exists in user's record or not, because a user/blog creator can append to the same blog more than once
      const hasBlogId = await userSchema.findOne({ username }, { c_blogs: { $elemMatch: { blogId } } });
      if (!hasBlogId)
        return await userSchema.findOneAndUpdate({ username }, { $push: { c_blogs: { blogId } } });
    }
  }
}
module.exports = new User();