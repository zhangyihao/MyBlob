/**
 * Created by zhangyihao on 2017-01-13.
 */
var express = require('express');
var router = express.Router();

var checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/', checkNotLogin, function (req, res, next) {
    res.send(req.flash());
    next();
});

router.post('/', checkNotLogin, function (req, res, next) {
    res.send(req.flash());
  next();
});

module.exports = router;