var express = require('express'),
    post = require('../models/post');
var router = express.Router();
  
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
router.get('/new', function(req, res, next) {
  post.find({}, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: post});
  });
});

//게시글 수정페이지로 이동
router.get('/:id/edit', function(req, res, next) {
  post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: post});
  });
});


//게시글 상세보기
router.get('/:id', function(req, res, next) {
  post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    post.read = post.read + 1;
    post.save(function(err) { });
    res.render('posts/show', {post: post});
  });
});


//새로운 게시글 등록
router.post('/', function(req, res, next) {
    var newpost = new post({
      title: req.body.title,
      email: req.body.email,
      content: req.body.content
    });
    newpost.save(function(err) {
      if (err) {
        return next(err);
      } else {
        res.redirect('/posts');
      }
    });

  });
  
//게시글 삭제
router.delete('/:id', function(req, res, next) {
  post.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/posts');
  });
});

//게시글 수정
router.put('/:id', function(req, res, next) {
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

module.exports = router;
