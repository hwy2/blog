var createError = require('http-errors');
var express = require('express'); //web 框架
var path = require('path'); //路径
var cors = require('cors'); //跨域
var i18n = require('i18n'); //国际化
// var cookieParser = require('cookie-parser');
var logger = require('morgan'); //开发模式下log
var bodyParser = require('body-parser'); //json
var config = require('config-lite'); //读取配置文件
var winston = require('winston'); //日志
var expressWinston = require('express-winston'); //基于 winston 的用于 express 的日志中间件
var models = require('./models'); //临时添加 为了生成数据库表，后面写到Controllers里面
var routes = require('./routes'); //路由

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

//配置i18n
i18n.configure({
  locales: ['en', 'zh-CN'], //声明包含的语言
  cookie: 'locale',
  directory: __dirname + '/locales',
  defaultLocale: 'zh-CN' //默认的语言
});

var app = express();

//i18n
app.use(i18n.init);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//设置json
//格式化JSON的输出
app.set('json spaces', 2);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json());

//配置跨域
app.use(cors({
  origin: config.cors.origin, //'*',
  methods: "PUT,POST,GET,DELETE,OPTIONS",
  // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// 路由
routes(app);

//错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//开启定时任务
var schedule = require('./services/schedule'); //定时
schedule.sendWeatherMail();
schedule.testBlogApi();


module.exports = app;
