/**
 * Created by nnnyy on 2017-09-20.
 */
var request = require('request');
var cheerio = require('cheerio');
var urlencode = require('urlencode');
var list = require('./list');
var iconv  = require('iconv-lite');
var PREFIX_LINK = 'http://bestjd.cafe24.com/zboard/';

exports.getRealPage = function(page) {
    return page;
}

exports.nextPage = function(page) {
    return parseInt(page) + 1;
}

exports.getPageURL = function(key, idx) {
    switch(key) {
        case 'bestiz_gcjd':
            return 'http://bestjd.cafe24.com/zboard/view.php?id=bestgj&page=1&sn1=&divpage=8&sn=off&ss=on&sc=off&select_arrange=headnum&desc=asc&no=' + idx;
    }

    return '';
}

exports.free = function($, key, info, callback) {
    data = [];
    var title = '';
    var url = '';
    var name = 'noname';
    var regdate = '';
    var viewcnt = '0';
    var comment = '0';
    $('table').eq(3).find('tr').each(function(i){
        title = $(this).find("td").eq(1).find("a").text().trim();
        url = PREFIX_LINK + $(this).find("td").eq(1).find("a").attr("href");
        if(info.isAppView) {
            no = list.getParameterByName('no', url);
            url = list.makeAppViewURL(key, no);
        }
        name = $(this).find("td").eq(2).find("span").text().trim();
        regdate = $(this).find("td").eq(3).find("span").text().trim();
        viewcnt = $(this).find("td").eq(4).text().trim();
        comment = $(this).find(".commentnum").text().trim();
        comment = comment.replace("[", "");
        comment = comment.replace("]", "");

        if(title != "" && name != "Best" && name != "") {
            data.push({title:title, link:url, username:name, regdate:regdate, viewcnt:viewcnt, commentcnt:comment, linkencoding:urlencode(url)});
        }
    })
    callback({ret:0, list:data});
}

exports.parsingContent = function($,key,idx,callback) {
    var title = '';
    var nickname = '';
    var viewcnt = '';
    var article = '';
    var comments = [];

    $('tr').each(function(i){
        tnickname = $(this).find('td').eq(1).find('table').eq(0).find('td').eq(0).text().trim();
        tviewcnt = $(this).find('td').eq(1).find('table').eq(0).find('td').eq(1).text().trim();
        ttitle = $(this).find('td').eq(1).find('b').text().trim();
        if(tnickname != '' && tviewcnt != ''){
            nickname = tnickname;
            viewcnt = tviewcnt;
        }
        if(ttitle != '') {
            title = ttitle;
        }
    })

    article = $('table').eq(13).html();
    article = article.replace(/(\r\n|\n|\r)/gm,"").trim();

    // 댓글
    $('table').eq(14).find('tr').each(function(i){
        id = $(this).find('td').eq(0).text().trim();
        comm = $(this).find('td').eq(1).text().trim();
        regdate = $(this).find('td').eq(2).text().trim();
        comments.push({nick:id, comment: comm, regdate: regdate });
    })

    callback({title:title, nickname: nickname, vcnt: viewcnt, article: article, comments: comments});
}