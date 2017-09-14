/**
 * Created by nnnyyy-dev on 2014-06-19.
 */
var mysql = require('mysql');
var _pool;
var DBMan = {}

DBMan.init = function() {
    _pool = mysql.createPool({
        connectionLimit: 10,
        host: '127.0.0.1',
        user: 'root',
        password: 's1980819',
        database: 'data_parcing'
    });

}

function init() {
    console.log("Mysql Init");
    if( !!_pool ) {
        return _pool;
    }else {
        DBMan.init();
        return _pool;
    }
}

var pool = init();
exports.db = pool;
