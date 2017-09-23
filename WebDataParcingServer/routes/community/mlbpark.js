/**
 * Created by nnnyy on 2017-09-20.
 */
var request = require('request');
var cheerio = require('cheerio');
var urlencode = require('urlencode');
var list = require('./list');
var iconv  = require('iconv-lite');
var PREFIX_LINK = 'http://bestjd.cafe24.com/zboard/';

exports.free = function($, key, info, callback) {
    data = [];
    var title = '';
    var url = '';
    var name = 'noname';
    var regdate = '';
    var viewcnt = '0';
    var comment = '0';

    $('.contents .items').each(function() {

        title_prefix = '[' + $(this).find('.word').text().trim() + '] ';
        $(this).find('.word').text('');
        title = title_prefix + $(this).find('.title').text().trim();
        url = $(this).find('.title a').attr('href');
        if(info.isAppView) {
            no = list.getParameterByName('id',url);
            url = list.makeAppViewURL(key, no);
        }
        name = $(this).find('.info .nick').text().trim();
        regdate = $(this).find('.info .date').text().trim();

        console.log({title:title, link:url, username:name, regdate:regdate, viewcnt:viewcnt, commentcnt:comment, linkencoding:urlencode(url)});

        data.push({title:title, link:url, username:name, regdate:regdate, viewcnt:viewcnt, commentcnt:comment, linkencoding:urlencode(url)});
    })

    callback({ret:0, list:data});
}

//  �� �������� �Ľ�
exports.app_page = function(key, idx, callback) {
    var url_final = '';
    switch(key) {
        case 'mlb_bp':
            url_final = 'http://mlbpark.donga.com/mp/b.php?p=1&b=bullpen&id='+ idx +'&select=&query=&user=&site=donga.com&reply=&source=';
            break;
    }

    console.log(url_final);

    var reqOptions = {
        url: url_final,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
        },
    }

    try {
        request( reqOptions, function(err, res_inner, body) {
            var $ = cheerio.load(body);
            try {
                parsingContent($, key, idx, function(ret) {
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

exports.getRealPage = function(page) {
    return page;
}

exports.nextPage = function(page) {
    return parseInt(page) + 30;
}

function parsingContent($,key,idx,callback) {
    var title = '';
    var nickname = '';
    var viewcnt = '';
    var article = '';
    var comments = [];

    title_prefix = '[' + $('.titles .word').text() + '] ';
    $('.titles .word').text('');
    title = title_prefix + $('.titles').text();
    //regdate = $('.titles .date').text().trim();
    nickname = $('.view_head .nick').text().trim();
    viewcnt = $('.view_head .text2 .val').eq(1).text().trim();
    article = $('#contentDetail').html();
    article = article.replace(/(\r\n|\n|\r)/gm,"").trim();

    $('.reply_list div').each(function() {
        var cls = $(this).attr('class');
        if(cls != 'my_con' && cls != 'other_con') return;
        commname = $(this).find('.name').text().trim();
        date =  $(this).find('.date').text().trim();
        comm =  $(this).find('.re_txt').text().trim();
        comments.push({nick:commname, comment: comm, regdate: date});
    })

    callback({title:title, nickname: nickname, vcnt: viewcnt, article: article, comments: comments});
}