/**
 * Created by nnnyy on 2017-09-20.
 */
var app = require('../../app');
var clien = require('./clien');
var fomos = require('./fomos');

var SERVER_ROOT = 'http://4seasonpension.com:7888';
exports.server_root = SERVER_ROOT;

var community_list = {
    clien_free:
    {
        name: '클리앙 모공',
        url: 'http://m.clien.net/service/board/park?&od=T31&po=',
        obj: clien,
        parcer: clien.free,
        app_parcer: clien.app_page,
        isAppView: true,
    },
    clien_android:
    {
        name: '클리앙 안드로메당',
        url: 'https://www.clien.net/service/board/cm_andro?&od=T31&po=',
        obj: clien,
        parcer: clien.free,
        app_parcer: clien.app_page,
        isAppView: true,
    },
    fomos_free:
    {
        name: '포모스 자게',
        url: 'http://m.fomos.kr/talk/article_list?bbs_id=11&page=',
        obj: fomos,
        parcer: fomos.free,
        app_parcer: fomos.app_page,
        isAppView: true,
    }
};

var listQuery = '';

exports.init = function() {
    var list_parse = {};
    idx = 0;
    for( var data in community_list ) {
        list_parse[data] = {name: community_list[data].name, index: idx++ };
    }

    listQuery = JSON.stringify(list_parse);
}

exports.getListJson = function() {
    return listQuery;
}

exports.getList = function() {
    return community_list;
}

// URL 스트링 파라메터 추출
exports.getParameterByName = function(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
