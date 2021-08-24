var i18n = require("i18n");
var co = require("co");
var utils = require("../libs/utils");
var UserInfo = require('../models/index').UserInfo;

module.exports = {
    /**
     * 创建用户信息
     */

    createUserInfo: function (req, res, next) {
        var params = req.body || req.params;
        var userUuid = utils.trim(params.userUuid);
        var nickName = utils.trim(params.nickName);
        var birth = utils.trim(params.birth);
        var sex = utils.trim(params.sex);
        var face = utils.trim(params.face);
        var city = utils.trim(params.city);
        var address = utils.trim(params.address);
        if (!userUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('userUuidNotNull')
            });
            return;
        }

        co(function* () {
            var userInfoResult = yield UserInfo.findOne({
                where: {
                    userUuid: userUuid
                }
            });
            console.log("userInfoResult", userInfoResult);
            if (userInfoResult) { //检查是否存在相同的userUuid
                utils.handleJson({
                    response: res,
                    msg: i18n.__('userInfoAlreadyExists')
                });

                return;
            }

            // 不存在则创建
            userInfoResult = yield UserInfo.create({
                userUuid: userUuid,
                nickName: nickName,
                birth: birth,
                sex: sex,
                face: face,
                city: city,
                address: address
            });

            if (!userInfoResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doFail')
                });

                return;
            }

            var userInfo = userInfoResult.dataValues;

            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    userInfo: userInfo
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
     * 查询用户信息
     */
    readUserInfo: function (req, res, next) {
        var params = req.query || req.params;
        var userUuid = utils.trim(params.userUuid);
        if (!userUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('userUuidNotNull')
            });

            return;
        }

        co(function* () {
            var userInfoResult = yield UserInfo.findOne({
                where: {
                    userUuid: userUuid
                }
            });

            if (!userInfoResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('userInfoNotExist')
                });
                return;
            }

            var userInfo = userInfoResult.dataValues;
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    userInfo: userInfo
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
     * 更新用户信息
     */
    updateUserInfo: function (req, res, next) {
        var params = req.query || req.params;
        var userInfo = JSON.parse(params.userInfo);
        var userInfoUuid = utils.trim(userInfo.uuid);
        if (!userInfoUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            });

            return;
        }

        co(function* () {
            var userInfoResult = yield UserInfo.update(userInfo, {
                where: {
                    uuid: userInfoUuid
                }
            });
            console.log( userInfoResult);
            if (!userInfoResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__("updateUserInfoFail")
                });

                return;
            }
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: "+1"
            })

        }).catch(function (error) {
            utils.handleError({
                response: resm,
                error: error
            })
        })
    },

    /**
     * 删除用户信息
     */
    deleteUserInfo: function (req, res, next) {
        var params = req.query || req.params;
        var userInfoUuid = utils.trim(params.userInfoUuid);
        if (!userInfoUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            });
            return;
        }

        co(function* () {
            var userInfoResult = yield UserInfo.findOne({
                where: {
                    uuid: userInfoUuid
                }
            });

            if (!userInfoResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('userInfoNotExist')
                });
                return;
            }

            userInfoResult = yield UserInfo.destroy({
                where: {
                    uuid: userInfoUuid
                }
            });
            if (!userInfoResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doFail')
                });
                return;
            }
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: '-1'
            })

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    }
}