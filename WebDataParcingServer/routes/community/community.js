/**
 * Created by nnnyy on 2017-09-20.
 */
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();
module.exports = router;

var commlist = require('./list');
commlist.init();

router.get('/', function(req, res, next) {
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

    var url_final = list[key].url + list[key].page(page);

    //  리스트 얻어오기
    var reqOptions = {
        url: url_final,
        method: 'GET',
        headers: {
        }
    }

    try {
        request( reqOptions, function(err, res_inner, body) {
            var $ = cheerio.load(body);
            try {
                list[key].parcer($, list[key], function(ret){
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
    list[key].app_parcer(idx, function(ret) {
        res.render('appview', ret);
    })
})