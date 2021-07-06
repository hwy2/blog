/**
 * router
 */
var i18n = require('i18n'); //国际化
var utils = require('../libs/utils'); //工具类

module.exports = function (app) {
  //router分流
  app.use('/common', require('./common'));
  app.use('/user', require('./users'));
  app.use('/admin', require('./admin'));
  app.use('/userInfo', require('./userInfo'));
  app.use('/category', require('./category'));
  app.use('/article', require('./article'));
  // app.use('/', function (req, res, next) {
  //   res.send('respond with a resource');
  // });

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    if (res && !res.headersSent) {
      // var err = new Error('Not Found');
      // err.status = 404;
      // next(err);
      utils.handleJson({
        response: res,
        msg: i18n.__('requestApiError'),
      });
    }
  });
};