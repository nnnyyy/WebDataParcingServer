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
    return page - 1;
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