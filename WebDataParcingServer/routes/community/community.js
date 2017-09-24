/**
 * Created by nnnyy on 2017-09-20.
 */
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var iconv  = require('iconv-lite');
var router = express.Router();
module.exports = router;

var commlist = require('./list');
commlist.init();

router.get('/list', function(req, res, next) {
    res.send(commlist.getListJson());
});

router.get('/:key/:page', function(req, res, next) {
    key = req.params.key;
    page = req.params.page;

    var listItem = commlist.getList()[key];
    var itemObject = listItem.obj;
    var url_final = listItem.url + itemObject.getRealPage(page);

    console.log(url_final);

    var reqOptions = {
        url: url_final,
        method: 'GET',
        headers: {
            "User-Agent": listItem.user_agent
        },
        timeout:5000,
    }

    if(listItem.isEUCKR) {
        reqOptions.encoding = null;
    }

    try {
        request( reqOptions, function(err, res_inner, body) {
            var data = body;
            if(listItem.isEUCKR){
                var strContents = new Buffer(body);
                data = iconv.decode(strContents, "EUC-KR").toString();
            }

            var $ = cheerio.load(data);
            try {
                listItem.parcer($, key, listItem, function(ret){
                    ret.next_page = itemObject.nextPage(page);
                    res.send(ret);
                });
            }
            catch(e) {
                res.send('error');
            }

        });
    }catch(e){
        res.send('error');
    }
})

router.get('/app/:key/:idx', function(req, res, next) {
    key = req.params.key;
    idx = req.params.idx;
    appPage(key, idx, function(ret) {
        if(ret.ret != 0) {
            res.send('Error');
            return;
        }

        res.render('appview', ret);
    })
})


function appPage(key, idx, callback) {
    var listItem = commlist.getList()[key];
    var itemObject = listItem.obj;
    var url_final = itemObject.getPageURL(key, idx);

    var reqOptions = {
        url: url_final,
        method: 'GET',
        headers: {
            "User-Agent": listItem.user_agent,
        },
        timeout:3500,
    }

    if(listItem.isEUCKR) {
        reqOptions.encoding = null;
    }
    if(listItem.setCookie) {
        reqOptions.headers['Set-Cookie'] = listItem.setCookie;
    }

    try {
        request( reqOptions, function(err, res_inner, body) {
            if(err) {
                callback({ret:-1})
                return;
            }
            var data = body;
            try {
                if(listItem.isEUCKR) {
                    var strContents = new Buffer(body);
                    data = iconv.decode(strContents, "EUC-KR").toString();
                }
            }catch(e) {
                callback({ret:-1})
                return;
            }

            var $ = cheerio.load(data);
            try {
                itemObject.parsingContent($, key, idx, function(ret) {
                    callback({ret:0, data: ret});
                });
            }
            catch(e) {
                callback({ret:-1})
            }

        });
    }catch(e){
        callback({ret:-1})
    }
}