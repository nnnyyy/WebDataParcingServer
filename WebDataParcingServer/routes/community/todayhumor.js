/**
 * Created by nnnyy on 2017-09-20.
 */
var request = require('request');
var cheerio = require('cheerio');
var urlencode = require('urlencode');
var list = require('./list');
var PREFIX_LINK = 'http://m.todayhumor.co.kr/';

exports.free = function($, key, info, callback) {
    data = [];
    var title = '';
    var url = '';
    var name = 'noname';
    var regdate = '';
    var viewcnt = '0';
    var comment = '0';

    $('a').each(function(i){
        name = $(this).find('.list_writer').text().trim();
        if(name == '') return;

        comment = $(this).find('.memo_count').text().replace(/\[|\]/g, '');
        $(this).find('.memo_count').text('');
        title = $(this).find('.listSubject').text().trim();
        viewcnt = $(this).find('.list_viewCount').text().trim();
        regdate = $(this).find('.listDate').text().trim();
        url = PREFIX_LINK + $(this).attr('href');
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
        case 'todayhumor_bob':
            return 'http://m.todayhumor.co.kr/view.php?table=bestofbest&no=' + idx;
        case 'todayhumor_best':
            return 'http://m.todayhumor.co.kr/view.php?table=humorbest&no=' + idx;
    }

    return '';
}

exports.parsingContent = function($,key,idx,callback) {
    var title = '';
    var nickname = '';
    var viewcnt = '';
    var article = '';
    var comments = [];

    title = $('.view_subject').text().trim();
    nickname = $('.view_writer_span').text().trim();
    viewcnt = $('.view_viewCount').text().replace('회','').trim();
    $('.viewContent a').text('');
    $('.viewContent div').attr('style','');
    $('.viewContent img').attr('onclick','');
    $('.viewContent img').attr('onload','');
    article = $('.viewContent').html();
    article = article.replace(/(\r\n|\n|\r)/gm,"").trim()

    console.log('what?');

    len = $('script').get().length;
    scriptdata = $('script').get()[len-1].children[0].data;
    findParentId = list.findTextAndReturnRemainder(scriptdata, 'var parent_id = ');
    findParentId = findParentId.replace(/"/g,'');

    findTable = list.findTextAndReturnRemainder(scriptdata, 'var parent_table = ');
    findTable = findTable.replace(/"/g,'');

    var url_final = ''
    switch(key) {
        case 'todayhumor_bob':
            url_final = 'http://m.todayhumor.co.kr/ajax_memo_list.php?parent_table='+ findTable +'&parent_id='+ findParentId +'&last_memo_no=0&is_mobile=Y'
            break;
        case 'todayhumor_best':
            url_final = 'http://m.todayhumor.co.kr/ajax_memo_list.php?parent_table='+ findTable +'&parent_id='+ findParentId +'&last_memo_no=0&is_mobile=Y'
            break;
    }

    console.log(url_final);
    var reqOptions = {
        url: url_final,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36",
        }
    }

    try {
        request( reqOptions, function(err, res_inner, body) {
            try {
                var comments_root = JSON.parse(body);
                comm_len = comments_root.memos.length;
                for(var i = 0 ; i < comm_len ; ++i) {
                    var item = comments_root.memos[i];
                    if(item.parent_memo_no != 0) continue;
                    commname = item.name;
                    if(commname == 'SYSTEM') continue;
                    comm = item.memo.replace(/<[^>]*>/g, '');
                    date = item.date;
                    comments.push({nick:commname, comment: comm, regdate: date});
                    rere = comments_root.memos.filter(function(item2){
                        return item2.parent_memo_no == item.no;
                    })
                    for(var j = 0 ; j < rere.length ; ++j) {
                        var item = rere[j];
                        commname = item.name;
                        if(commname == 'SYSTEM') continue;
                        comm = ' -- ' + item.memo.replace(/<[^>]*>/g, '');
                        date = item.date;
                        comments.push({nick:commname, comment: comm, regdate: date});
                    }
                }
                callback({title:title, nickname: nickname, vcnt: viewcnt, article: article, comments: comments});
            }
            catch(e) {
                callback({title:title, nickname: nickname, vcnt: viewcnt, article: article, comments: []});
            }

        });
    }catch(e){
        callback({title:title, nickname: nickname, vcnt: viewcnt, article: article, comments: []});
    }

    //callback({title:title, nickname: nickname, vcnt: viewcnt, article: article, comments: comments});
}