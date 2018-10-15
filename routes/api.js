var express = require('express');
var router = express.Router();
var fs = require('fs');

var FS_PATH_SERVICES = './routes/servicers/';
var REQUIRE_PATH_SERVICES = './servicers/';

router.options('*', function (req, res, next) {
    next();
});

try {
    var list = fs.readdirSync(FS_PATH_SERVICES);
    for (var e; list.length && (e = list.shift());) {
    	var service = require(REQUIRE_PATH_SERVICES + e);
    	service.init && service.init(router);
    }
} catch(e) {
    console.log(e);
}

module.exports = router;
