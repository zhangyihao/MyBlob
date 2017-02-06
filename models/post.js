/**
 * Created by zhangyihao on 2017-02-06.
 */
'use strict';
var marked = require('marked');
var Post = require('../lib/mongo').Post;

Post.plugin('contentToHtml', {
  afterFind: function (posts) {
    return posts.map(function (post) {
      post.content = marked(post.content);
      return post;
    })
  },

  afterFindOne: function (post) {
    if(post) {
      post.content = marked(post.content);
    }
    return post;
  }
});

module.exports = {
  //发布文章
  create: function create(post) {
    return Post.create(post).exec();
  },

  getPostById: function getPostById(postId) {
    return Post.findOne({_id: postId})
      .populate({path: 'author', model: 'User'})
      .addCreatedAt()
      .contentToHtml()
      .exec();
  },
  
  getPosts: function (author) {
    
  }

}
;

