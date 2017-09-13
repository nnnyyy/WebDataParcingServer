var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

module.exports = router;