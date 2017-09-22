/**
 * Created by nnnyy on 2017-09-20.
 */
var request = require('request');
var cheerio = require('cheerio');
var urlencode = require('urlencode');
var list = require('./list');
var iconv  = require('iconv-lite');
var PREFIX_LINK = 'http://www.instiz.net/free/';

exports.free = function($, key, info, callback) {
    data = [];
    var title = '';
    var url = '';
    var name = 'noname';
    var regdate = '';
    var viewcnt = '0';
    var comment = '0';
    $('#mainboard tr').each(function() {
        if($(this).find('#topboard').length != 0) return;
        if($(this).find('#subject').length == 0) return;
        title = $(this).find('#subject').text().trim();
        name = $(this).find('.minitext2').text().trim();
        comment = $(this).find('.cmt').text().trim();
        url = PREFIX_LINK + $(this).find('a.cmt').attr('href');
        if(info.isAppView) {
            no = list.getParameterByName('no', url);
            url = list.makeAppViewURL(key, no);
        }

        regdate = $(this).find('.listno').eq(1).text();
        viewcnt = $(this).find('.listno').eq(2).text();
        row = {title: title, link: url, username: name, regdate: regdate, viewcnt: viewcnt, commentcnt: comment, linkencoding:urlencode(url)};
        data.push(row);
    })
    callback({ret:0, list:data});
}

//  �� �������� �Ľ�
exports.app_page = function(key, idx, callback) {
    var url_final = '';
    switch(key) {
        case 'instiz_free':
            url_final = 'http://www.instiz.net/free?no='+ idx + '&page=1&category=1';
            break;
    }

    console.log(url_final);

    var reqOptions = {
        url: url_final,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
        },
        encoding:null,
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
    return parseInt(page) + 1;
}

function parsingContent($,key,idx,callback) {
    var title = $('.tb_top #subject').text().trim();
    var nickname = '';
    var viewcnt = '';
    var article = '';
    var comments = [];

    $('.tb_lr .tb_left span').each(function(i){
        switch(i){
            case 0: nickname = $(this).text(); break;
        }
    })

    $('.tb_lr .tb_left span').text('');
    viewcnt = $('.tb_lr .tb_left').text().replace('조회','').trim();

    $('#memo_content_1 #mobile').text('');
    $('#memo_content_1 span').attr('style','');
    article = $('#memo_content_1').html();
    console.log(article);
    article = article.replace(/(\r\n|\n|\r)/gm,"").trim();


    $('.comment_memo').each(function(i){
        var id = '';
        var comm_nick = '';
        var comm = '';
        var comm_date = '';
        $(this).find('span').each(function(j){
            if(j == 0) id = $(this).attr('id');
        })
        id = id.replace('com','');

        comm_nick = $(this).find('#com' + id + ' .href').text();
        comm = $(this).find('#n' + id).text();
        $(this).find('div').each(function(i){
            if(i != 1) return;
            comm_date = $(this).find('.links').text();
        })
        comments.push({nick:comm_nick, comment: comm, regdate: comm_date });
    })

    callback({title:title, nickname: nickname, vcnt: viewcnt, article: article, comments: comments});
}