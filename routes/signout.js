/**
 * Created by zhangyihao on 2017-01-13.
 */
var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

module.exports = router;