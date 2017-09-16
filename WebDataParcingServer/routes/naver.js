/**
 * Created by nnnyyy on 2017-09-15.
 */
var request = require('request');
var cheerio = require('cheerio');
var urlencode = require('urlencode');

exports.GetMost = function(callback) {
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
            var cnt = 1;
            $('div.PM_CL_realtimeKeyword_rolling_base div.PM_CL_realtimeKeyword_rolling ul li span.ah_k').each(function() {
                aMost.push({rank: cnt, item:$(this).text()})
                cnt++;
            });

            //res.send({ data: aMost });
            callback({ret:0, data: aMost});
        });
    }
    catch(err) {
        console.log(err);
        callback({ret:-1});
        //res.render('index', { title: 'Express - Error' });
    }
}

exports.GetNews = function(req_query, callback) {
    query = urlencode(req_query);
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
            //res.send({ ret: 'success', body: obj });
            callback({ret:0, news: obj});
        });
    }catch(e){
        callback({ret:-1});
    }
}