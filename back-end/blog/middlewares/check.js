/**
 * 检查中间件
 */
var tokenService = require('../services/token'); //token服务

module.exports = {
    /**
     * 检验普通用户token
     */
    checkToken: function (req, res, next) {
        tokenService.verifyRouterToken(req, res, next);
    },
    /**
     * 检验管理员token
     */
    checkAdminToken: function (req, res, next) {
        tokenService.verifyRouterToken(req, res, next, true);
    },
};