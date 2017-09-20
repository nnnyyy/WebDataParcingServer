/**
 * Created by nnnyy on 2017-09-20.
 */
var express = require('express');
var router = express.Router();

module.exports = router;

var commlist = require('./list');
commlist.init();

router.get('/', function(req, res, next) {
    res.send(commlist.getListJson());
});

router.get('/:key/:page', function(req, res, next) {
    key = req.params.key;
    page = req.params.page;

    list = commlist.getList();
    if( !list[key] ) {
        res.send('error');
        return;
    }

    res.send('ok');
})