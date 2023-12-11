var co = require('co');
var md5 = require('blueimp-md5'); //md5 加密
var i18n = require('i18n'); //i18n国际化
var config = require('../config/default'); //配置文件
var utils = require('../libs/utils'); //工具类
var AdminUser = require('../models/index').AdminUser; //管理员
var tokenService = require('../services/token'); //token服务

module.exports = {
    /**
     * 登录 post
     */
    login: function (req, res, next) {
        var params = req.body || req.params;
        var userName = utils.trim(params.userName);
        var password = utils.trim(params.password);

        if (!userName && !password) {
            utils.handleJson({
                response: res,
                msg: i18n.__('userNameOrPwdNull')
            });
            return;
        }
        co(function* () {
            var userResult = yield AdminUser.findOne({
                where: {
                    userName: userName
                }
            });

            if (!userResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('adminUserNotExist')
                });
                return;
            }
            //存在该用户
            var user = userResult.dataValues;
            if (md5(password) != user.password) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('passwordError')
                });

                return;
            }

            // 登录成功 删除密码
            delete user.password;

            utils.handleJson({
                response: res,
                msg: i18n.__('loginSuccess'),
                result: {
                    user: user,
                    accessToken: tokenService.setToken({
                        uuid: user.uuid,
                        isAdmin: true
                    })
                }
            })

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error

            })
        })

    },

    /**
     * 登出
     */
    logout: function (req, res, next) {
        // 清空当前用户的token
        var token = req.headers.accesstoken;
        var result = tokenService.delToken(token);
        //退出登录
        utils.handleJson({
            response: res,
            msg: i18n.__('logoutSuccess'),
            result: result,
        });
    },

    /**
     * 更新token 防止token过期
     * 参数：
     * {
     *  token
     *  userUuid
     * }
     */
    updateAccessToken: function (req, res, next) {
        var params = req.body || req.params;
        var token = utils.trim(params.token);
        var userUuid = utils.trim(params.userUuid);

        if (!token || !userUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('doFail')
            });
            return;
        }

        co(function* () {
            // 验证token
            yield tokenService.verifyToken(token, userUuid);

            utils.handleJson({
                response: res,
                msg: i18n.__('tokenUpdate'),
                result: {
                    accessToken: tokenService.setToken({
                        uuid: userUuid
                    })
                }
            })

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })

    },

    /**
     * 新增管理员
     */
    createAdminUser: function (req, res, next) {
        var params = req.body || req.params;
        var userName = utils.trim(params.userName);
        var password = utils.trim(params.password);

        if (!userName || !password) {
            utils.handleJson({
                response: res,
                msg: i18n.__('userNameOrPwdNull')
            });

            return;
        }

        co(function* () {
            var userResult = yield AdminUser.findOne({
                where: {
                    userName: userName
                }
            });
            // 验证是否被注册
            if (userResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('adminUserHadReg')
                });

                return;
            }

            userResult = yield AdminUser.create({
                userName: userName,
                password: md5(password),
                role: utils.trim(params.role) || "1" //角色 1超级管理员 2普通管理员
            });

            if (!userResult) { //注册失败
                utils.handleJson({
                    response: res,
                    msg: i18n.__('regFail')
                });

                return;
            }

            // 注册成功
            var adUser = userResult.dataValues;
            delete adUser.password;
            utils.handleJson({
                response: res,
                msg: i18n.__("regSuccess"),
                result: {
                    user: adUser
                }
            })

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },

    /**
     * 管理员列表
     */
    getAdminUserList: function (req, res, next) {
        var params = req.query || req.params;
        var condition = {};

        // 分页
        var page = {
            currPage: utils.trim(params.currPage) || config.page.currPage, //获取当前页
            pageSize: utils.trim(params.pageSize) || config.page.pageSize //每页数量
        }

        co(function* () {
            var userResult = AdminUser.findAndCountAll({
                where: condition,
                attributes: {
                    exclude: ['password']
                },
                limit: page.pageSize,
                offset: page.pageSize * (page.currPage - 1),
                order: [
                    ['updateDate', 'DESC']
                ]
            })
            var userList = userResult.rows || [];
            var pageResult = yield utils.handlePage({
                count: userResult.count,
                page: page
            });
            utils.handleJson({
                response: res,
                result: {
                    list: userList,
                    page: pageResult
                }
            })

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
        //查询
    },
}