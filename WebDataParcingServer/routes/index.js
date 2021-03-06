var express = require('express');
var router = express.Router();
var youtube = require('./youtube');
var mysql = require('../mysql/_Mysql');
var naver = require('./naver');
var urlencode = require('urlencode');

/* GET home page. */
router.get('/youtube/:arg', function(req, res_parent, next) {
  var url_final = youtube.MakeVideoBaseURL(20);
  youtube.YoutubeSearch(req.query, urlencode(req.params.arg), '', function(ret) {
    try {
      url_final += ('&id=' + JSON.parse(ret.sRet));
      console.log(url_final);
      youtube.YoutubeGetVideos(url_final, ret.nextToken, ret.prevToken, res_parent);
    }catch(err){
      res_parent.send({ret:-1, prevToken:"", nextToken:"", data: ret.sRet})
    }
  })
});

router.get('/most', function(req, res, next) {
  naver.GetMost(function(s) {
    res.send(s);
  });
});

router.get('/dbtest', function(req, res, next){
  var list = [];
})

router.get('/news/:arg_query', function(req, res, next) {
  naver.GetNews(req.params.arg_query, function(s){
    res.send(s);
  });
})

module.exports = router;