/**
 * Created by nnnyy on 2017-09-20.
 */
var request = require('request');
var cheerio = require('cheerio');


var PREFIX_LINK = 'https://m.clien.net';

exports.free = function($, info, callback) {
    data = [];
    url = '';
    $('.item').each(function() {
        title = $(this).find('.list-subject').text().trim();
        url = PREFIX_LINK + $(this).find('.list-subject').attr('href');
        if(info.isAppView) {
            a = url.split('?')[0];
            b = a.split('/');
            url = 'http://127.0.0.1:7888/community/app/clien_free/' + b[b.length-1];
        }
        name = $(this).find('.list-author').text().trim();
        regdate = $(this).find('.timestamp').text().trim();
        comment = $(this).find('.badge-reply').text().trim();
        viewcnt = "0";
        if(name == "") return;
        if(comment == "") comment = "0";
        data.push({title: title, link: url, name: name, regdate: regdate, viewcnt: viewcnt, commentcnt: comment});
    })
    callback({ret:0, list:data});
}

//  ¾Û Çü½ÄÀ¸·Î ÆÄ½Ì
exports.free_app_page = function(idx, callback) {
    url_final = 'https://m.clien.net/service/board/park/'+ idx +'?po=0&od=T33&sk=&sv=&category=&groupCd=board_all&articlePeriod=default';
    console.log(url_final);

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
                callback({ret:0})
            }
            catch(e) {
                callback({ret:-1})
            }

        });
    }catch(e){
        callback({ret:-1})
    }
}

exports.pop = function($, info, callback) {
    data = [];
    //$('div.PM_CL_realtimeKeyword_rolling_base div.PM_CL_realtimeKeyword_rolling ul li span.ah_k')
    $('.item').each(function() {
        title = $(this).find('.list-subject').text().trim();
        title = "[" + title.replace("\n", "] ");
        title = title.replace(/\n/gi, "");
        title = title.replace(/\t/gi, "");
        url = PREFIX_LINK + $(this).find('.list-subject').attr('href');
        name = $(this).find('.list-author').text().trim();
        regdate = $(this).find('.timestamp').text().trim();
        comment = $(this).find('.badge-reply').text().trim();
        viewcnt = "0";
        if(name == "") return;
        if(comment == "") comment = "0";
        data.push({title: title, link: url, name: name, regdate: regdate, viewcnt: viewcnt, commentcnt: comment});
    })
    callback({ret:0, list:data});
}

exports.page = function(page) {
    return page - 1;
}

exports.nextPage = function(page) {
    return parseInt(page) + 1;
}