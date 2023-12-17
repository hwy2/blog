/**
 * router
 */
var i18n = require('i18n'); //国际化
var utils = require('../libs/utils'); //工具类
let path = require("path");
var express = require("express");

module.exports = function (app) {
  app.use(function (req, res, next) {
    if (req.method != 'GET' && JSON.stringify(req.body) != "{}") {
      const data = utils.declassificationAES(req.body.data)
      // console.log(data)
      req.body = data
    }
    next()
  })
  //router分流
  app.use('/common', require('./common'));
  app.use('/user', require('./users'));
  app.use('/userInfo', require('./userInfo'));
  app.use('/category', require('./category'));
  app.use('/article', require('./article'));
  app.use('/webConfig', require('./webConfig'));
  app.use('/comment', require('./comment'));
  app.use('/dataSummary', require('./dataSummary'));
  app.use('/links', require('./links'));

  app.use('/', express.static(path.join(__dirname,'..','/dist')));

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