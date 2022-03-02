var co = require('co');
var md5 = require('blueimp-md5'); //md5加密
var i18n = require('i18n'); //i18n国际化
var config = require('../config/default'); //配置文件
var utils = require('../libs/utils'); //工具类
var User = require('../models/index').User; //用户
var tokenService = require('../services/token'); //token服务
const UserInfo = require('../models/index').UserInfo;
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {

    /**
     * 检测邮箱是否注册checkEmail
     * get
     * req.query || req.params
     */
    checkEmail: function (req, res, next) {
        var params = req.query || req.params;
        var email = utils.trim(params.email);
        if (!email) {
            utils.handleJson({
                response: res,
                msg: i18n.__('success'),
                result: {
                    emailHadReg: false
                }
            })
        }

        co(function* () {
            var userResult = yield User.findOne({
                where: {
                    email: email,
                }
            });

            var result = false;
            if (userResult) {
                result = true;
            }

            //success
            utils.handleJson({
                response: res,
                msg: i18n.__('success'),
                result: {
                    emailHadReg: result,
                }
            });


        }).catch(function (error) {
            //err
            utils.handleError({
                response: res,
                error: error
            })

        })
    },

    /**
     * 注册 
     * post
     * req.body
     */
    reg: function (req, res, next) {
        var params = req.body || req.query || req.params;
        var userDao = {
            name: params.name,
            email: params.email,
            role: params.role || "2",
            password: md5(params.password),
            state: params.state || '0',
        }
        const userInfo = {
            nickName: utils.trim(params.nickName),
            birth: utils.trim(params.birth),
            sex: utils.trim(params.sex),
            face: utils.trim(params.face),
            city: utils.trim(params.city),
            address: utils.trim(params.address),
            userUuid: ''
        }
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!userDao.email || !userDao.password || !reg.test(userDao.email) || !userInfo.nickName || !userInfo.face) {
            utils.handleJson({
                response: res,
                msg: i18n.__('emailOrPwdNull')
            })
            return;
        }

        co(function* () {

            var userResult = yield User.findOne({
                where: {
                    email: userDao.email
                }
            });

            // 用户被注册
            if (userResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('emailHadReg')
                })

                return;
            }

            userResult = yield User.create(userDao);

            if (!userResult) { //注册失败
                utils.handleJson({
                    response: res,
                    msg: i18n.__('regFail')
                })
                return;
            }

            // 成功
            var user = userResult.dataValues;

            //删除密码
            delete user.password;

            userInfo.userUuid = user.uuid;
            var userInfoResult = yield UserInfo.create(userInfo)
            if (!userInfoResult) { //注册失败
                utils.handleJson({
                    response: res,
                    msg: i18n.__('regFail')
                })
                return;
            }
            user.userInfo = userInfoResult;
            utils.handleJson({
                response: res,
                msg: i18n.__('regSuccess'),
                result: {
                    user: user,
                    accessToken: tokenService.setToken({
                        uuid: user.uuid
                    }) //token
                }
            });


        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },

    /**
     * 登录
     * post
     * req.body
     */
    login: function (req, res, next) {
        var params = req.body;
        var email = utils.trim(params.email);
        var password = utils.trim(params.password);

        if (!email || !password) {
            utils.handleJson({
                response: res,
                msg: i18n.__('emailOrPwdNull')
            })
            return;
        }

        // 检查是否有该用户
        co(function* () {
            var userResult = yield User.findOne({
                where: {
                    email: email
                },
                include: [{
                    model: UserInfo
                }]
            });

            if (!userResult) { //用户不存在
                utils.handleJson({
                    response: res,
                    msg: i18n.__('userNotExist')
                })
                return;
            }

            var user = userResult.dataValues;

            if (md5(password) != user.password) {
                //密码不正确
                utils.handleJson({
                    response: res,
                    msg: i18n.__('passwordError')
                })
                return;
            }

            //增加用户标识
            if (user.password) {
                delete user.password; //删除密码
                user.isPwd = true;
            }
            user.role = user.role === '1' ? '管理员' : '普通用户'
            // 验证是否为管理员
            if (user.role && user.role === '管理员') {
                console.log("管理员登录");

                utils.handleJson({
                    response: res,
                    msg: i18n.__('loginSuccess'),
                    result: {
                        user: user,
                        accessToken: tokenService.setToken({
                            uuid: user.uuid,
                            isAdmin: true
                        })
                    },
                });

                return;
            }



            //success
            utils.handleJson({
                response: res,
                msg: i18n.__('loginSuccess'),
                result: {
                    user: user,
                    accessToken: tokenService.setToken({
                        uuid: user.uuid
                    }), //token
                },
            });
        }).catch(function (error) {
            //err
            utils.handleError({
                response: res,
                error: error,
            });
        });
    },

    /**
     * 退出登录 
     * get
     * headers.accessToken
     */
    logout: function (req, res, next) {
        // 清空session中的用户信息
        // req.session.user = null;
        // 清空当前用户的token
        var token = req.headers.accessToken;
        var result = tokenService.delToken(token);
        // 退出登录
        utils.handleJson({
            response: res,
            msg: i18n.__('logoutSuccess'),
            result: result
        })
    },

    /**
     * 根据用户对象更新token post
     * put
     */
    updateAccessToken: function (req, res, next, isAdmin) {
        var params = req.body || req.params;
        var userUuid = utils.trim(params.userUuid);
        var token = utils.trim(params.token);
        console.log(userUuid, token)
        if (!userUuid || !token) {
            //fail
            utils.handleJson({
                response: res,
                msg: i18n.__('doFail')
            })

            return;
        }

        co(function* () {
            // 验证token
            yield tokenService.verifyToken(token, userUuid);

            if (isAdmin) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('tokenUpdate'),
                    result: {
                        accessToken: tokenService.setToken({
                            uuid: userUuid,
                            isAdmin: true
                        })
                    }
                });
                return;
            }
            // success
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
     * 查询全部
     * get
     * 使用req.query || req.params
     */
    getUserList: function (req, res, next) {
        var params = req.query || req.params;
        var email = utils.trim(params.email);
        var name = utils.trim(params.name);
        var role = utils.trim(params.role);
        var condition = {};

        if (email) {
            condition.email = {
                [Op.like]: '%' + email + '%'
            }
        }

        if (name) {
            condition.name = {
                [Op.like]: '%' + name + '%'
            }
        }

        if (role) {
            condition.role = role;
        }


        // 分页
        var page = {
            currPage: parseInt(utils.trim(params.currPage)) || config.page.currPage, //获取当前页
            pageSize: parseInt(utils.trim(params.pageSize)) || config.page.pageSize //每页数量
        }

        // 查询
        co(function* () {
            var result = yield User.findAndCountAll({
                where: condition,
                attributes: {
                    exclude: ['password']
                },
                include: UserInfo,
                limit: page.pageSize, //每页多少条
                offset: page.pageSize * (page.currPage - 1), //偏移量
                order: [ //排序
                    ['createDate', 'DESC']
                ]
            })

            var userList = result.rows || [];

            for (const item of userList) {
                item.role = item.role === '1' ? '管理员' : '普通用户'
            }

            // 处理分页
            var pageResult = yield utils.handlePage({
                count: result.count,
                page: page
            })

            // success

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
    },

    /**
     * 获取用户详情
     * get请求
     * 使用req.query || req.params
     */
    getUserInfo: function (req, res, next) {
        var params = req.query || req.params;
        console.log("params", params);
        var userUuid = utils.trim(params.userUuid);

        if (!userUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUserUuid')
            })
            return;
        }

        co(function* () {
            var userResult = yield User.findOne({
                where: {
                    uuid: userUuid
                },
                attributes: {
                    exclude: ['password']
                },
                include: UserInfo
            });

            if (userResult) {
                userResult.role = userResult.role === '1' ? '管理员' : '普通用户'
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doSuccess'),
                    result: {
                        user: userResult.dataValues
                    }
                });
            } else {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('userInfoNotExist')
                })
            }

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },

    /**
     * 更新用户信息 put
     */
    updateUserInfo: function (req, res, next) {
        var params = req.body || req.params;
        var user = utils.trim(params.user);
        var userInfo = utils.trim(params.userInfo);
        var userUuid = utils.trim(user.uuid);
        var userInfoUuid = utils.trim(userInfo.uuid);

        if (!userUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            });
            return;
        }
        co(function* () {
            var userInfoResults = '';
            var userResult = yield User.update(user, {
                where: {
                    uuid: userUuid
                }
            });

            if (!userResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('updateUserInfoFail')
                })

                return;
            }

            if (userInfoUuid && userInfo.nickName) {
                yield UserInfo.update(userInfo, {
                    where: {
                        uuid: userInfoUuid
                    }
                })
            } else if (!userInfoUuid && userInfo.nickName) {
                userInfo.userUuid = userUuid;
                userInfoResults = yield UserInfo.create(userInfo);
            } else {}
            
            utils.handleJson({
                response: res,
                msg: i18n.__('updateUserInfoSuccess'),
                result: "+1"
            })

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },

    /**
     * 修改密码 put
     */
    updateUserPwd: function (req, res, next) {
        var params = req.body || req.params;
        // 检查数据
        var checkFlag = utils.validateMandatory(params);
        if (!checkFlag) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassParamsComplete')
            });

            return;
        }

        // 验证新旧密码
        var userUuid = params.userUuid;
        var oldPwd = utils.trim(params.oldPwd);
        var newPwd = utils.trim(params.newPwd);
        console.log(oldPwd, newPwd);
        if (oldPwd === newPwd) {
            utils.handleJson({
                response: res,
                msg: i18n.__('newPwdEqOldPwd')
            });

            return;
        }

        co(function* () {
            var userResult = yield User.findOne({
                where: {
                    uuid: userUuid
                }
            });

            if (!userResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('userNotExist')
                });

                return;
            }
            var user = userResult.dataValues;
            if (user.password && md5(oldPwd) != user.password) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('oldPwdError')
                });

                return;
            }
            yield User.update({
                password: md5(newPwd)
            }, {
                where: {
                    uuid: userUuid
                }
            });

            utils.handleJson({
                response: res,
                msg: i18n.__('updateSuccess'),
                result: "+1"
            })


        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },

    /**
     * 删除
     */
    deleteUser: function (req, res, next) {
        var params = req.query || req.params;
        var userUuid = utils.trim(params.userUuid);
        if (!userUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUserUuid')
            });

            return;
        }

        co(function* () {
            // 删除
            var oneUser = yield User.findAndCountAll();
            if (oneUser.count < 2) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('notDeleteLastAccount')
                });

                return;
            }
            var userResult = yield User.findOne({
                where: {
                    uuid: userUuid
                }
            });
            if (!userResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('userNotExist')
                });

                return;
            }
            userResult = yield User.destroy({
                where: {
                    uuid: userUuid
                }
            });
            if (!userResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doFail')
                });
                return;
            }
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: "-1"
            });

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })


    }
}