var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//文件上传
var fileUpload = require('express-fileupload');
const cors = require('cors');

var index = require('./routes/index');
var api = require('./routes/api');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors());//同源策略
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit:'100mb',extended: false }));//请求数据是参数的大小
app.use(cookieParser());
app.use(fileUpload());
app.use('/public',express.static(path.join(__dirname, '/public')));//设置虚拟根目录
app.use(express.static('thirdParty'));
app.use(express.static('assets'));
app.use(express.static('uploadImages'));
app.use('/src',express.static('src'));

app.use('/', index);
app.use('/api', api);
app.use('/teacher', index);

//热更新模块
console.log("process.env.NODE_ENV====>>",process.env.NODE_ENV)
if (process.env.NODE_ENV !== "production") {
  console.log("热更新进来了")
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpackConfig = require('./webpack.config.js');
  var webpack = require('webpack');
  var compiler = webpack(webpackConfig);
  var devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    noInfo: true,
    stats: {
      colors: true
    }
  });
  var hotMiddleware = webpackHotMiddleware(compiler);
  app.use(devMiddleware);
  app.use(hotMiddleware);
  //html hmr
  compiler.plugin('compilation', function (compilation) {//webpack编译完成
    //在这个插件合成出页面之后，添加一个回调，调用中间件emit一个action为reload的事件，对应另一边client订阅的事件，实现浏览器的刷新
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
      hotMiddleware.publish({action: 'reload'})
      cb()
    })
  });
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log("404--------------404----进来了----------404")
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{});
});

module.exports = app;
