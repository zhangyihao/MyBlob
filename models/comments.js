/**
 * Created by zhangyihao on 2017-02-07.
 */
'use strict';
var marked = require('marked');
var Comment = require('../lib/mongo').Comment;

Comment.plugin('contentToHtml', {
  afterFid: function (comments) {
    return comments.map(function (comment) {
      comment.content = marked(comment.content);
      return comment;
    });
  }
});

module.exports = {
  create: function (comment) {
    return Comment.create(comment).exec();
  },

  delCommentById: function (commentId, author) {
    return Comment.remove({author: author, _id: commentId}).exec();
  },

  delCommentsByPostId: function (postId) {
    return Comment.remove({postId: postId}).exec();
  },

  getComments: function (postId) {
    return Comment.find({postId: postId})
      .populate({path: 'author', model: 'User'})
      .sort({_id: 1})
      .addCreatedAt()
      .contentToHtml()
      .exec();
  },

  getCommentsCount: function (postId) {
    return Comment.count({postId: postId}).exec();
  }
}