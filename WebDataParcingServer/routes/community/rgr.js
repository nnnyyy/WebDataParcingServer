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

    $('#revolution_main_table tr').each(function(i){
        name = $(this).find('.list_name').text().trim();
        regdate = $(this).find('td').eq(1).text().trim();
        viewcnt = $(this).find('td').eq(2).text().trim();
        title = $(this).find('.title').text().trim();
        if(title == '' || viewcnt == '') return;
        url = $(this).find('a').attr('href');
        if(info.isAppView){
            no = list.getParameterByName('no', url);
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
        case 'rgr_pop':
            return 'http://te31.com/rgr/view.php?id=rgrong&sn1=&divpage=506&sn=on&ss=on&sc=on&select_arrange=headnum&desc=asc&no=' + idx;
        case 'rgr_rare':
            return 'http://te31.com/rgr/view.php?id=rare2014&sn1=&divpage=9&sn=on&ss=on&sc=on&select_arrange=headnum&desc=asc&no=' + idx;
    }

    return '';
}

exports.parsingContent = function($,key,idx,callback) {
    var title = '';
    var nickname = '';
    var viewcnt = '';
    var article = '';
    var comments = [];

    var html_final = '';
    //  이미지 부분
    $('#page a').each(function(i) {
        if(i == 0) return;
        html_final += $(this).html();
    })
    html_final += '<br>';

    html_final += $('div[align=center] table tbody tr td table tbody tr td[valign=top]').html();
    title = $('tbody tr td[align=left] span b').eq(0).text();
    nickname = $('tbody tr td[align=left] span b').eq(1).text();
    viewcnt = $('tbody tr td[align=left] span b').eq(3).text();

    article = html_final;
    article = article.replace(/(\r\n|\n|\r)/gm,"").trim();


    $('.info_bg').each(function(i) {
        commname = $(this).find('b').eq(1).text().trim();
        comm =  $(this).find('td[colspan=2]').text().trim();
        date = $(this).find('span').eq(5).text().trim();
        comments.push({nick:commname, comment: comm, regdate: date});
    })

    callback({title:title, nickname: nickname, vcnt: viewcnt, article: article, comments: comments});
}