/**
 * Created by nnnyy on 2017-09-20.
 */
var request = require('request');
var cheerio = require('cheerio');
var urlencode = require('urlencode');
var list = require('./list');
var PREFIX_LINK = 'http://m.fomos.kr';

exports.free = function($, key, info, callback) {
    data = [];
    var title = '';
    var url = '';
    var name = 'noname';
    var regdate = '';
    var viewcnt = '0';
    var comment = '0';
    url = '';
    $('.list_area .list_cont .board_list li').each(function() {
        if( $(this).attr('class') == 'notice' ) return;
        title = $(this).find('.title').text().trim();
        url = PREFIX_LINK + $(this).find('a').attr('href');
        if(info.isAppView) {
            no = list.getParameterByName('indexno', url);
            url = list.makeAppViewURL(key, no);
        }
        user_info = $(this).find('.info');
        name = user_info.find('.user').text();
        viewcnt = user_info.find('.num').text();
        regdate = user_info.find('.date').text();
        comment = $(this).find('.red').text().replace(/\(|\)/g, '');
        if( comment == '' ) comment = '0';
        row = {title: title, link: url, username: name, regdate: regdate, viewcnt: viewcnt, commentcnt: comment, linkencoding:urlencode(url)};
        data.push(row);
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
        case 'fomos_free':
            return 'http://m.fomos.kr/talk/article_view?bbs_id=11&lurl=%2Ftalk%2Farticle_list%3Fbbs_id%3D11%26page%3D1&indexno=' + idx;
    }

    return '';
}

exports.parsingContent = function($,key,idx,callback) {
    var title = $('.board_area .tit').text().trim();
    var nickname = $('#contents .author').text().trim();
    $('.news_image img').each(function() {
        $(this).attr('src', PREFIX_LINK + $(this).attr('src'));
    })
    $('.banner_area').each(function() {
        $(this).html('');
    })
    $('#mobitree').html('');
    $('#mobitreeP').html('');
    $('#waveP').html('');
    $('#waveAd').html('');
    $('#uniqubeAd_area').html('');
    $('.btn_like').html('');
    $('#contents iframe').each(function() {
        $(this).attr('width', '100%');
        $(this).attr('height', 'auto');
    })
    var viewcnt = 'view'
    var article = $('.view_cont').html();
    article = article.replace(/(\r\n|\n|\r)/gm,"").trim();
    callback({title:title, nickname: nickname, vcnt: viewcnt, article: article, comments: ''});
}