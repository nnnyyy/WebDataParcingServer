/**
 * Created by nnnyy on 2017-09-20.
 */
var request = require('request');
var cheerio = require('cheerio');
var urlencode = require('urlencode');
var list = require('./list');
var iconv  = require('iconv-lite');
var PREFIX_LINK = 'http://m.humoruniv.com/board/';

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
        $(this).find('.listno').each(function(i) {
            switch(i) {
                case 1: regdate = $(this).text(); break;
                case 2: viewcnt = $(this).text(); break;
            }
        })
        row = {title: title, link: url, username: name, regdate: regdate, viewcnt: viewcnt, commentcnt: comment, linkencoding:urlencode(url)};
        data.push(row);
    })
    callback({ret:0, list:data});
}

//  �� �������� �Ľ�
exports.app_page = function(key, idx, callback) {
    var url_final = '';
    switch(key) {
        case 'humor_pop':
            url_final = 'http://m.humoruniv.com/board/read.html?table=pds&pg=0&number=' + idx;
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
            var strContents = new Buffer(body);
            var data = iconv.decode(strContents, "EUC-KR").toString();
            var $ = cheerio.load(data);
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

    /*
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
    */
    callback({title:title, nickname: nickname, vcnt: viewcnt, article: article, comments: comments});
}