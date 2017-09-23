/**
 * Created by nnnyy on 2017-09-20.
 */
var app = require('../../app');
var clien = require('./clien');
var fomos = require('./fomos');
var humor = require('./humor');
var instiz = require('./instiz');
var bestiz = require('./bestiz');
var mlb = require('./mlbpark');
var todayhumor = require('./todayhumor');

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
        user_agent: "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
        isAppView: true,
        isEUCKR: false,
    },
    fomos_free:
    {
        name: '포모스 자게',
        url: 'http://m.fomos.kr/talk/article_list?bbs_id=11&page=',
        obj: fomos,
        parcer: fomos.free,
        app_parcer: fomos.app_page,
        user_agent: "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
        isAppView: true,
        isEUCKR: false,
    },
    humor_pop:
    {
        name: '웃대 웃긴자료',
        url: 'http://m.humoruniv.com/board/list.html?table=pds&pg=',
        obj: humor,
        parcer: humor.free,
        app_parcer: humor.app_page,
        user_agent: "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
        isAppView: true,
        isEUCKR: true,
    },
    instiz_free:
    {
        name: '인스티즈 자유잡담',
        url: 'http://www.instiz.net/bbs/list.php?id=free&category=1&page=',
        obj: instiz,
        parcer: instiz.free,
        app_parcer: instiz.app_page,
        user_agent: "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
        isAppView: true,
        isEUCKR: false,
    },
    bestiz_gcjd:
    {
        name: '베스티즈 게천잡담',
        url: 'http://bestjd.cafe24.com/zboard/zboard.php?id=bestgj&select_arrange=headnum&desc=asc&category=&sn=off&ss=on&sc=off&keyword=&sn1=&divpage=8&page=',
        obj: bestiz,
        parcer: bestiz.free,
        app_parcer: bestiz.app_page,
        user_agent: "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
        isAppView: true,
        isEUCKR: true,
    },
    mlb_bp:
    {
        name: 'MLB파크 불펜',
        url: 'http://mlbpark.donga.com/mp/b.php?m=list&b=bullpen&query=&select=&user=&p=',
        obj: mlb,
        parcer: mlb.free,
        app_parcer: mlb.app_page,
        user_agent: "Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36",
        isAppView: true,
        isEUCKR: false,
    },
    todayhumor_bob:
    {
        name: '오유 베오베',
        url: 'http://m.todayhumor.co.kr/list.php?table=bestofbest&page=',
        obj: todayhumor,
        parcer: todayhumor.free,
        app_parcer: todayhumor.app_page,
        user_agent: "Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36",
        isAppView: true,
        isEUCKR: false,
    },
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

exports.makeAppViewURL = function(key, no) {
    return SERVER_ROOT + '/community/app/'+ key + '/' + no;
}

exports.findTextAndReturnRemainder = function(target, variable){
    var chopFront = target.substring(target.search(variable)+variable.length,target.length);
    var result = chopFront.substring(0,chopFront.search(";"));
    return result;
}