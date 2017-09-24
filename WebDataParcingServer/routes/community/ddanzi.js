/**
 * Created by nnnyy on 2017-09-20.
 */
var request = require('request');
var cheerio = require('cheerio');
var urlencode = require('urlencode');
var list = require('./list');
var iconv  = require('iconv-lite');
var PREFIX_LINK = 'http://te31.com/rgr/';

exports.free = function($, key, info, callback) {
    data = [];
    var title = '';
    var url = '';
    var name = 'noname';
    var regdate = '';
    var viewcnt = '0';
    var comment = '0';

    $('.bd .lt li').each(function(i){
        if( $(this).find('.notice') != '' ) return;

        comment = $(this).find('.title em').text().replace(/\[|\]/g,'');
        $(this).find('.title em').text('');
        if( comment == '' ) comment = 0;
        title = $(this).find('.title').text().replace(/(\r\n|\n|\r|\t)/gm,"").trim();
        name = $(this).find('.auth').text().trim();
        regdate = $(this).find('.time').text().trim();
        viewcnt = $(this).find('.cnt').eq(0).text().split(':')[1].trim();
        url = $(this).find('a').attr('href');
        if(info.isAppView) {
            no = list.getParameterByName('document_srl', url);
            url = list.makeAppViewURL(key, no);
        }

        data.push({title:title, link:url, username:name, regdate:regdate, viewcnt:viewcnt, commentcnt:comment, linkencoding:urlencode(url)});
    })

    callback({ret:0, list:data});
}

exports.getRealPage = function(page) {
    return page;
}

exports.nextPage = function(page) {
    return parseInt(page) + 1;
}

exports.getPageURL = function(key, idx) {
    switch(key) {
        case 'ddanzi_free':
            return 'http://www.ddanzi.com/index.php?mid=free&page=1&document_srl=' + idx;
    }

    return '';
}

exports.parsingContent = function($,key,idx,callback) {
    var title = '';
    var nickname = '';
    var viewcnt = '0';
    var article = '';
    var comments = [];

    $('.hx h2 a').text('');
    title = $('.hx h2').text().replace('›','').trim();
    nickname = $('.hx .ex a').text().trim();
    $('.hx .ex a').text('');
    $('<br>').insertBefore('.bd .co img');
    article = $('.bd .co').html();
    article = article.replace(/(\r\n|\n|\r)/gm,"").trim();

    // comment
    $('#cmt_list li').each(function() {
        console.log('!!');
        comm = $(this).find('div').eq(0).text().trim();
        commname = $(this).find('.auth em').text().trim();
        date = $(this).find('.auth .time').text().trim();
        comments.push({nick:commname, comment: comm, regdate: date});
    })

    callback({title:title, nickname: nickname, vcnt: viewcnt, article: article, comments: comments});
}