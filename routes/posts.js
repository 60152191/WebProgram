var express = require('express'),
    path = require('path'),
    _ = require('lodash'),
    fs = require('fs'),
    User = require('../models/User'),
    post = require('../models/post');
    Comment = require('../models/comment');

  var router = express.Router();
  function needAuth(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/signin');
    }
  }


  /* GET users listing. */
  //게시판으로 이동
  router.get('/', function(req, res, next) {
    post.find({}, function(err, posts) {
      if (err) {
        return next(err);
      }
      res.render('posts/index', {posts: posts});
    });
  });

  //게시글 등록
  router.get('/new', needAuth, function(req, res, next) {
    post.find({}, function(err, post) {
      if (err) {
        return next(err);
      }
      res.render('posts/edit', {post: post});
    });
  });

  //게시글 수정페이지로 이동
  router.get('/:id/edit', needAuth, function(req, res, next) {
    post.findById(req.params.id, function(err, post) {
      if (err) {
        return next(err);
      }
      res.render('posts', {post: post});
    });
  });


  //게시글 상세보기
  router.get('/:id', function(req, res, next) {
    post.findById(req.params.id, function(err, post) {
      if (err) {
        return next(err);
      }
      Comment.find({post: post.id}, function(err, comments) {
        if (err) {
          return next(err);
        }
        res.render('posts/show', {post: post, comments: comments});
      });
    });
  });


  //새로운 게시글 등록
  router.post('/', needAuth, function(req, res, next) {
      var newpost = new post({
        title: req.body.title,
        email: req.body.email,
        content: req.body.content,
        country: req.body.country,
        address: req.body.address,
        price: req.body.price,
        convenient: req.body.convenient,
        rule: req.body.rule
      });
      console.log(req.body)
      newpost.save(function(err) {
        if (err) {
          return next(err);
        } else {
          res.redirect('/posts');
        }
      });

  });


    
  //게시글 삭제
  router.delete('/:id', needAuth, function(req, res, next) {
    post.findOneAndRemove({_id: req.params.id}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/posts');
    });
  });

  //게시글 수정
  router.put('/:id', needAuth, function(req, res, next) {
    post.findById({_id: req.params.id}, function(err, post) {
      if (err) {
        return next(err);
      }
      if (post.password !== req.body.current_password) {
        return res.redirect('back');
      }

      post.email = req.body.email;
      post.title = req.body.title;
      post.content = req.body.content;
      post.country = req.body.country;
      post.address = req.body.address;
      post.price = req.body.price;
      post.convenient = req.body.convenient;
      post.rule = req.body.rule;
      if (req.body.password) {
        post.password = req.body.password;
      }

      post.save(function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/posts');
      });
    });
  });
  
  //코멘트
  router.post('/:id/comments', function(req, res, next) {
  var comment = new Comment({
    post: req.params.id,
    email: req.body.email,
    content: req.body.content,
    checkin: req.body.checkin,
    checkout: req.body.checkout,
    personnel: req.body.personnel,
  });

  comment.save(function(err) {
    if (err) {
      return next(err);
    }
    post.findByIdAndUpdate(req.params.id, {$inc: {numComment: 1}}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/posts/' + req.params.id);
    });
  });
});


module.exports = router;
