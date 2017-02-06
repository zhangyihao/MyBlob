/**
 * Created by zhangyihao on 17/1/15.
 */
var User = require('../lib/mongo').User;

module.exports = {
  // 注册一个用户
  create: function create(user) {
    return User.create(user).exec();
  },

  // 根据用户名查找用户
  getUserByName: function getUserByName(name) {
    return User.findOne({name : name}).addCreatedAt().exec();
  }
}