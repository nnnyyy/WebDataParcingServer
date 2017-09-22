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

    list = commlist.getList();
    if( !list[key] ) {
        res.send('error');
        return;
    }

    var url_final = list[key].url + list[key].obj.getRealPage(page);

    console.log(url_final);
    //  ����Ʈ ������
    var reqOptions = {
        url: url_final,
        method: 'GET',
        headers: {
            "User-Agent": list[key].user_agent
        },
        timeout:5000,
        encoding: null,
    }

    try {
        request( reqOptions, function(err, res_inner, body) {
            var data;
            if(list[key].isEUCKR){
                var strContents = new Buffer(body);
                data = iconv.decode(strContents, "EUC-KR").toString();
            }
            else {
                data = body.toString();
            }
            var $ = cheerio.load(data);
            try {
                list[key].parcer($, key, list[key], function(ret){
                    ret.next_page = list[key].obj.nextPage(page);
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
    list = commlist.getList();
    key = req.params.key;
    idx = req.params.idx;
    list[key].app_parcer(key, idx, function(ret) {
        res.render('appview', ret);
    })
})