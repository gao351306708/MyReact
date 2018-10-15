var express = require('express');
var router = express.Router();

/* GET 学生. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

/* GET 教师. */
router.get('/teacher', function(req, res, next) {
  res.render('teacher', {});
});
module.exports = router;
