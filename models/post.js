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

Post.plugin('addCommentsCount', {
  afterFind: function (posts) {
    return Promise.all(posts.map(function (post) {
      return CommentModel.getCommentsCount(post._id)
        .then(function (commentscount) {
          post.commentsCount = commentscount;
          return post;
        });
    }));
  }
})

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
    var query = {};
    if(typeof(author)!=="undefined" && author!==null) {
      query.author = author;
    }
    return Post.find(query)
      .populate({path: 'author', model: 'User'})
      .sort({_id: -1})
      .addCreatedAt()
      .contentToHtml()
      .exec();
  },

  incPv : function (postId) {
    return Post.update({_id: postId}, {$inc:{pv:1}})
      .exec();
  },

  getRawPostById: function (postId) {
    return Post.findOne({_id: postId})
      .populate({path: 'author', model:'User'})
      .exec();
  },

  updatePostById: function (postId, author, title, data) {
    return Post.update({author: author, _id:postId},
      {$set:{title:title, content:data}}).exec();
  },

  delPostById: function (postId, author) {
    return Post.remove({author: author, _id: postId}).exec();
  }

};

