/**
 * Created by zhangyihao on 2017-01-13.
 */
'user strict';
var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/', checkNotLogin, function (req, res, next) {
  res.locals.username = '';
  res.locals.password = '';
  var userName = req.flash('username');
  var password = req.flash('password');
  if(userName!==null) {
    res.locals.username = userName.toString();
  }
  if(password!==null) {
    res.locals.password = password.toString();
  }
  res.render('signin.ejs');
});

router.post('/', checkNotLogin, function (req, res, next) {
  var userName= req.fields.username;
  var password = req.fields.password;

  UserModel.getUserByName(userName).then(function (user) {
    if(!user) {
      req.flash('username', userName);
      req.flash('password', password);
      req.flash('error', '用户不存在！');
      return res.redirect('back');
    }

    if(sha1(password) !== user.password) {
      req.flash('username', userName);
      req.flash('password', password);
      req.flash('error', '用户名或密码错误!');
      return res.redirect('back');
    }

    req.flash('success', '登录成功!');
    delete user.password;
    req.session.user = user;
    res.redirect('/posts');
  }).catch(next);
});

module.exports = router;