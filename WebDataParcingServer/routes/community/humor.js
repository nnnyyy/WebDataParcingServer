/**
 * Created by nnnyy on 2017-09-20.
 */
var request = require('request');
var cheerio = require('cheerio');
var urlencode = require('urlencode');
var list = require('./list');
var PREFIX_LINK = 'http://m.humoruniv.com/board/';

exports.free = function($, key, info, callback) {
    data = [];
    var title = '';
    var url = '';
    var name = 'noname';
    var regdate = '';
    var viewcnt = '0';
    var comment = '0';
    $('.list_body_href').each(function() {
        title = $(this).find('.link_hover').text();
        name = $(this).find('.hu_nick_txt').text();
        //regdate = $(this).find('.extra').text();
        comment = $(this).find('.comment_num').text().replace('답글', '').trim();
        url = PREFIX_LINK + $(this).attr('href');
        if(info.isAppView) {
            no = list.getParameterByName('number', url);
            url = list.makeAppViewURL(key, no);
        }
        row = {title: title, link: url, username: name, regdate: regdate, viewcnt: viewcnt, commentcnt: comment, linkencoding:urlencode(url)};
        data.push(row);
    })
    callback({ret:0, list:data});
}

exports.getRealPage = function(page) {
    return page - 1;
}

exports.nextPage = function(page) {
    return parseInt(page) + 1;
}

exports.getPageURL = function(key, idx) {
    switch(key) {
        case 'humor_pop':
            return 'http://m.humoruniv.com/board/read.html?table=pds&pg=0&number=' + idx;
    }

    return '';
}

exports.parsingContent = function($,key,idx,callback) {
    $('.read_subject h2 em').text('');
    $('.wrap_img').each(function() {
        $(this).find('a').text('');
    })
    var title = $('.read_subject h2').text().trim();
    var nickname = $('#content_info .hu_nick_txt').text().trim();
    var viewcnt = '';
    $('.wrap_body img').each(function() {
        $(this).attr('style','');
        $(this).attr('width','');
    })
    var article = $('.wrap_body').html();
    var comments = [];
    article = article.replace(/(\r\n|\n|\r)/gm,"").trim();

    $('#comment li').each(function(){
        comment = $(this).find('.comment_text').text().trim();
        if(comment == '') {
            temp = $(this).find('.sub_comment').text().trim();
            if(temp == '') return;
            comment = ' -- ' + temp;
        }
        comment_nick = $(this).find('.nick').text().trim();
        comments.push({nick:comment_nick, comment: comment, regdate: '' });
    })

    callback({title:title, nickname: nickname, vcnt: viewcnt, article: article, comments: comments});
}