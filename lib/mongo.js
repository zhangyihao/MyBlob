/**
 * Created by zhangyihao on 17/1/15.
 */
'use strict';
var config = require('config-lite');
var Mongolass = require('mongolass');

var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

var moment = require('moment');
var objectToTimestamp = require('objectid-to-timestamp');

mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
    return results;
  },

  afterFindOne: function (result) {
    if(result) {
      result.created_at = moment(objectToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  }
});

exports.User = mongolass.model('User', {
  name: {type:'string'},
  password: {type: 'string'},
  gender: {type:'string', enum: ['m', 'f', 'x']},
  bio: {type:'string'}
});
exports.User.index({name: 1}, {unique: true}).exec();

exports.Post = mongolass.model('Post', {
  author: {type: Mongolass.Types.ObjectId},
  title: {type: 'string'},
  content: {type: 'string'},
  pv: {type: 'number'}
});
exports.Post.index({ author: 1, _id: -1}).exec();

exports.Comment = mongolass.model('Comment', {
  author: {type: Mongolass.Types.ObjectId},
  content: {type: 'string'},
  postId: {type: Mongolass.Types.ObjectId}
})
exports.Comment.index({ postId: 1, _id: 1}).exec();
exports.Comment.index({ author: 1, _id: 1}).exec();
