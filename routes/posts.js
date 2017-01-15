/**
 * Created by zhangyihao on 2017-01-13.
 */
var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', function (req, res, next) {
    res.render('posts')
});

router.post('/', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

router.get('/create', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

router.get('/:postId', function (req, res, next) {
    res.send(req.flash());
});

router.get('/:postId/edit', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

router.post('/:postId/create', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

router.get('/:postId/remove', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

router.post('/:postId/commnet', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

router.get('/:postId/comment/:commentId/remove', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

module.exports = router;