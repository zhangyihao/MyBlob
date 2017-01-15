/**
 * Created by zhangyihao on 17/1/15.
 */
var User = require('../lib/mongo').User;

module.exports = {
  create: function (user) {
    return User.create(user).exec();
  }
}