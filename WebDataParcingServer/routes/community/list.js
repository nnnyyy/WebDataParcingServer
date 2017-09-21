/**
 * Created by nnnyy on 2017-09-20.
 */
var app = require('../../app');
var clien = require('./clien');

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