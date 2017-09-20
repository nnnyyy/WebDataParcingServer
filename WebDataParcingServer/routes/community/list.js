/**
 * Created by nnnyy on 2017-09-20.
 */

var clien = require('./clien');

var community_list = {
    clien_free:
    {
        name: '클리앙 모공',
        url: 'https://www.clien.net/service/board/park',
        parcer: clien.free
    },
    clien_pop:
    {
        name: '웃대 웃긴자료',
        url: 'https://www.clien.net/service/board/park',
        parcer: clien.pop
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