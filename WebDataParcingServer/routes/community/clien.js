/**
 * Created by nnnyy on 2017-09-20.
 */
var request = require('request');
var cheerio = require('cheerio');
var urlencode = require('urlencode');
var list = require('./list');
var PREFIX_LINK = 'https://m.clien.net';

exports.free = function($, key, info, callback) {
    data = [];
    url = '';
    $('.item').each(function() {
        title = $(this).find('.list-subject').text().trim();
        title = "[" + title.replace("\n", "] ");
        title = title.replace(/\n/gi, "");
        title = title.replace(/\t/gi, "");
        url = PREFIX_LINK + $(this).find('.list-subject').attr('href');
        if(info.isAppView) {
            a = url.split('?')[0];
            b = a.split('/');
            //url = list.server_root + '/community/app/'+ key + '/' + b[b.length-1];
            url = list.makeAppViewURL(key, b[b.length-1]);
        }
        name = $(this).find('.list-author').text().trim();
        regdate = $(this).find('.timestamp').text().trim();
        comment = $(this).find('.badge-reply').text().trim();
        viewcnt = "0";
        if(name == "") return;
        if(comment == "") comment = "0";
        data.push({title: title, link: url, username: name, regdate: regdate, viewcnt: viewcnt, commentcnt: comment, linkencoding:urlencode(url)});
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
        case 'clien_free':
            return 'https://m.clien.net/service/board/park/'+ idx +'?po=0&od=T33&sk=&sv=&category=&groupCd=board_all&articlePeriod=default';

        case 'clien_android':
            return 'https://www.clien.net/service/board/cm_andro/'+ idx +'?po=0&od=T31&sk=&sv=&category=&groupCd=&articlePeriod=default';
    }

    return '';
}

exports.parsingContent = function($,key,idx,callback) {
    title = $('.title-subject div.break').text().trim();
    nickname = $('button.nick').text().trim();
    viewcnt = $('span.view-count storng').text().trim();
    article = $('.post-content').html();
    article = article.replace(/(\r\n|\n|\r)/gm,"").trim();

    var url_final = ''
    switch(key) {
        case 'clien_free':
            url_final = 'https://m.clien.net/service/api/board/park/'+idx+'/comment?param=%7B%22order%22%3A%22date%22%2C%22po%22%3A0%2C%22ps%22%3A100%7D';
            break;

        case 'clien_android':
            url_final = 'https://m.clien.net/service/api/board/cm_andro/'+idx+'/comment?param=%7B%22order%22%3A%22date%22%2C%22po%22%3A0%2C%22ps%22%3A100%7D';
            break;
    }

    var reqOptions = {
        url: url_final,
        method: 'GET',
        headers: {
        }
    }

    try {
        request( reqOptions, function(err, res_inner, body) {
            try {
                var comments_root = JSON.parse(body);
                var comments = [];
                for(var i = 0 ; i < comments_root.length ; ++i) {
                    clean_comment = comments_root[i].comment.replace(/(&nbsp;|<\/?[^>]+(>|$))/g, "");
                    comments.push({nick:comments_root[i].member.nick, comment: clean_comment, regdate: comments_root[i].insertDate});
                }
                console.log(comments);
                callback({title:title, nickname: nickname, vcnt: viewcnt, article: article, comments: comments});
            }
            catch(e) {
                callback({});
            }

        });
    }catch(e){
        callback({});
    }
}