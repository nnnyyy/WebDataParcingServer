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
            url = list.server_root + '/community/app/'+ key + '/' + no;
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

//  �� �������� �Ľ�
exports.app_page = function(key, idx, callback) {
    var url_final = '';
    switch(key) {
        case 'fomos_free':
            url_final = 'http://m.fomos.kr/talk/article_view?bbs_id=11&lurl=%2Ftalk%2Farticle_list%3Fbbs_id%3D11%26page%3D1&indexno=' + idx;
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
    callback({title:title, nickname: nickname, vcnt: viewcnt, article: article, comments: ''});
}