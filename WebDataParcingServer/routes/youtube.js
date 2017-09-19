/**
 * Created by nnnyy on 2017-09-14.
 */
const youtubeBrowerKey = 'AIzaSyCKfmVmbkI1-bFKVanEOwFTBDQr6sKZOuw'
var urlencode = require('urlencode');
var request = require('request');

exports.key = youtubeBrowerKey;

exports.MakeVideoBaseURL = function(maxResults){
    return 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&maxResults='+ maxResults +'&key='+ youtubeBrowerKey;
}

exports.YoutubeSearch = function(query, params, pageToken, handler) {
    var url_final = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key='+youtubeBrowerKey+'&maxResults=20&type=video&q='+params;
    console.log(url_final);
    if(pageToken != null) {
        url_final += '&pageToken=' + pageToken;
    }
    if(query.regionCode != null) {
        url_final += '&regionCode=' + query.regionCode;
    }
    var reqOptions = {
        url: url_final,
        method: 'GET',
        headers: {
            'Accept' : 'application/xml',
            'Accept-Charset' : 'utf-8',
            'User-Agent' : 'my-reddit-client'
        }
    }

    try {
        request( reqOptions, function(err, res, body) {
            try {
                var sRet = "";
                var nextToken = JSON.parse(body).nextPageToken;
                var prevToken = JSON.parse(body).prevPageToken;
                if(JSON.parse(body).items != null) {
                    for( var i = 0 ; i < JSON.parse(body).items.length ; ++i) {
                        var id = JSON.parse(body).items[i].id.videoId;
                        sRet += (id + ",");
                    }
                    handler({sRet: JSON.stringify(sRet), nextToken:nextToken, prevToken:prevToken});
                }
                else {
                    handler({sRet:""});
                }
            }
            catch(e) {
                handler({sRet:""});
                console.log("YoutubeSearch: " + e + " , " + url_final);
            }
        });
    }
    catch(err) {
        console.log(err);
        handler({sRet:""});
    }
}


exports.YoutubeGetVideos = function(url, nextToken, prevToken, res_parent) {
    var reqOptions = {
        url: url,
        method: 'GET',
        headers: {
            'Accept' : 'application/xml',
            'Accept-Charset' : 'utf-8',
            'User-Agent' : 'my-reddit-client'
        }
    };

    //console.log(url);

    try {
        request( reqOptions, function(err, res, body) {
            try {
                var list = []
                var jsonRoot = JSON.parse(body);
                var nextPageToken = nextToken;
                if( JSON.parse(body).nextPageToken ) {
                    nextPageToken = JSON.parse(body).nextPageToken;
                }
                var prevPageToken = prevToken;
                if( JSON.parse(body).prevPageToken ) {
                    prevPageToken = JSON.parse(body).prevPageToken;
                }
                if(jsonRoot.items != null) {
                    for( var i = 0 ; i < jsonRoot.items.length ; ++i) {
                        var item = jsonRoot.items[i];
                        var title = item.snippet.title;
                        var thumnails = item.snippet.thumbnails.default.url;
                        if( item.snippet.thumbnails.high != null ) {
                            thumbnails = item.snippet.thumbnails.high.url;
                        }
                        var chtitle = item.snippet.channelTitle;
                        var id = item.id;
                        var duration = item.contentDetails.duration;
                        var definition = item.contentDetails.definition;
                        var viewCnt = item.statistics.viewCount;
                        var commentCnt = item.statistics.commentCount;
                        list.push({id:id, title:title, thumnails:thumnails, chtitle:chtitle, duration: duration, definition:definition, viewCnt: viewCnt, commentCnt: commentCnt});
                    }
                    //console.log({prevToken:prevPageToken, nextToken:nextPageToken, contents:list});
                    res_parent.send({ret:0,prevToken:prevPageToken, nextToken:nextPageToken, contents:list});
                }
                else {
                    res_parent.send({ret:-1, prevToken:"", nextToken:"", contents:list});
                }
            }
            catch(e) {
                res_parent.send({ret:-1, prevToken:"", nextToken:""});
                console.log("YoutubeGetVideos: " + e + ", " + url);
            }
        });
    }
    catch(err) {
        console.log(err);
        res_parent.end(err);
    }
}