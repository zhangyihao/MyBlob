/**
 * Created by zhangyihao on 2017-01-13.
 */
var express = require('express');
var router = express.Router();

var PostModel = require('../models/post');
var CommentModel = require('../models/comments');

var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', function (req, res, next) {
  var author = req.query.author;
  var active;
  if(typeof(req.session.user)!=="undefined" && req.session.user!==null && author===req.session.user._id) {
    active = 'user';
  }
  PostModel.getPosts(author)
    .then(function (posts) {
      res.render('posts', {posts: posts, active:active});
    })
    .catch(next);
});

router.post('/', checkLogin, function (req, res, next) {
  var author = req.session.user._id;
  var title = req.fields.title;
  var content = req.fields.content;

  try {
    if (!title.length) {
      throw new Error('请填写文章标题');
    }
    if (!content.length) {
      throw new Error('请填写文章内容');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  var post = {
    author: author,
    title: title,
    content: content,
    pv: 0
  };

  PostModel.create(post)
    .then(function (result) {
      post = result.ops[0];
      req.flash('success', '发表成功');
      res.redirect('/posts/'+post._id);
    }).catch(next);
});

router.get('/create', checkLogin, function (req, res, next) {
  res.render('post.ejs', {active:'create'});
});

router.get('/:postId', function (req, res, next) {
  var postId = req.params.postId;

  console.log('-----'+postId);
  Promise.all([
    PostModel.getPostById(postId),
    PostModel.incPv(postId)
  ])
    .then(function (result) {
      var post = result[0];
      if(!post) {
        throw new Error('文章不存在');
      }

      res.render('browsePost', {post: post});
    })
    .catch(next);
});

router.get('/:postId/edit', checkLogin, function (req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user._id;

  PostModel.getRawPostById(postId)
    .then(function (post) {
      if(typeof(post)==='undefined' || post===null) {
        throw new Error('文章不存在！');
      }

      if(author.toString()!==post.author._id.toString()) {
        throw new Error('权限不足');
      }

      console.log(post.title+'---'+post.content);
      res.render('editPost', {post: post});
    }).catch(next);
});

router.post('/:postId/edit', checkLogin, function (req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user._id;
  var title = req.fields.title;
  var content = req.fields.content;

  // if(typeof(title)==='undefined' || title===null) {
  //   req.flash('error', '标题不能为空');
  // }

  PostModel.updatePostById(postId, author, title, content)
    .then(function () {
      req.flash('success', '编辑文章成功');
      res.redirect('/posts/'+postId.toString());
    })
    .catch(next);
});

router.post('/:postId/create', checkLogin, function (req, res, next) {
  res.send(req.flash());
});

router.get('/:postId/remove', checkLogin, function (req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user._id;

  PostModel.delPostById(postId, author)
    .then(function () {
      req.flash('success','删除文章成功!');
      res.redirect('/posts');
    })
    .catch(next);
});

router.post('/:postId/commnet', checkLogin, function (req, res, next) {
  res.send(req.flash());
});

router.get('/:postId/comment/:commentId/remove', checkLogin, function (req, res, next) {
  res.send(req.flash());
});

module.exports = router;