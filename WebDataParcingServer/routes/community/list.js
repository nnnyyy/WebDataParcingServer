/**
 * Created by nnnyy on 2017-09-20.
 */
var app = require('../../app');
var clien = require('./clien');

var community_list = {
    clien_free:
    {
        name: '클리앙 모공',
        url: 'http://m.clien.net/service/board/park?&od=T31&po=',
        obj: clien,
        parcer: clien.free,
        app_parcer: clien.free_app_page,
        isAppView: true,
    },
    clien_pop:
    {
        name: '클리앙 공감',
        url: 'https://m.clien.net/service/group/board_all?&od=T33&po=',
        obj: clien,
        parcer: clien.pop,
        app_parcer: clien.free_app_page,
        isAppView: false,
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