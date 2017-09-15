var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var youtube = require('./youtube');
var urlencode = require('urlencode');
var mysql = require('../mysql/_Mysql');

/* GET home page. */
router.get('/', function(req, res_parent, next) {
  var url_final = youtube.MakeVideoBaseURL(20);
  youtube.YoutubeSearch(req.query, '고양이, 아비시니안, 애교', '', function(ret) {
    try {
      url_final += ('&id=' + JSON.parse(ret.sRet));
      youtube.YoutubeGetVideos(url_final, ret.nextToken, ret.prevToken, res_parent);
    }catch(err){
      res_parent.send({ret:-1, prevToken:"", nextToken:"", data: ret.sRet})
    }
  })
});

router.get('/most10', function(req, res, next) {

  var reqOptions = {
    url: 'http://www.naver.com',
    method: 'GET',
    headers: {
      'Accept' : 'application/xml',
      'Accept-Charset' : 'utf-8',
      'User-Agent' : 'my-reddit-client'
    }
  }

  try {
    request( reqOptions, function(err, res_inner, body) {

      var aMost = [];
      var $ = cheerio.load(body);
      $('div.PM_CL_realtimeKeyword_rolling_base div.PM_CL_realtimeKeyword_rolling ul li span.ah_k').each(function() {
        aMost.push({item:$(this).text()})
      });

      res.send({ data: aMost });
    });
  }
  catch(err) {
    console.log(err);
    res.render('index', { title: 'Express - Error' });
  }
});

router.get('/dbtest', function(req, res, next){
  var list = [];
})

router.get('/news/:arg_query', function(req, res, next) {
  query = urlencode(req.params.arg_query);
  console.log(query);
  var reqOptions = {
    url: 'https://openapi.naver.com/v1/search/news?query='+ query +'&display=10&start=1&sort=sim',
    method: 'GET',
    headers: {
      "X-Naver-Client-Id" : "7MP8gMwbVGDFjlm3wypW",
      "X-Naver-Client-Secret" : "zkLeDVM3YZ",
    }
  }

  try {
    request( reqOptions, function(err, res_inner, body) {
      obj = JSON.parse(body);
      res.send({ ret: 'success', body: obj });
    });
  }catch(e){
    res.send({ret: 'error'});
  }
})

module.exports = router;