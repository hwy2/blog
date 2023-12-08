/**
 * token服务
 * 2021/6/17
 */
var Promise = require('bluebird');
var config = require('../config/default');//配置
var jwt = require('jsonwebtoken');//json token

module.exports = {
    /**
     * 设置token 创建token
     */
    setToken: function (payload) {
        var expiresIn = Date.now() + 60 * 30 * 1000;//30分钟
        var token = jwt.sign(payload, config.token.secretOrPrivateKey, {
            expiresIn: expiresIn,//过期时间
        });

        return {
            token: token,
            expiresIn: expiresIn
        }

    },

    /**
     * 验证token是否正确：传入当前token和当前用户uuid
     */
    verifyToken: function (token, userUuid) {
        return new Promise(function (resolve, reject) {
            jwt.verify(token, config.token.secretOrPrivateKey, function (err, tokenData) {
                if (tokenData && tokenData.uuid == userUuid) {
                    resolve("ok");
                } else {
                    reject('fail');
                }
            })
        })
    },
    /**
     * 验证管理员 token是否正确：传入当前token和当前用户uuid
     */
    verifyAdminToken: function (token, userUuid) {
        return new Promise(function (resolve, reject) {
            jwt.verify(token, config.token.secretOrPrivateKey, function (err, tokenData) {
                // console.log(tokenData, tokenData.uuid == userUuid, tokenData.role == 1)
                if (tokenData && tokenData.uuid == userUuid && tokenData.isAdmin) {
                    resolve("ok");
                } else {
                    reject('fail');
                }
            })
        })
    },
    /**
     * 路由验证token
     */
    verifyRouterToken: function (req, res, next, isAdmin) {
        var token = req.headers.accesstoken;
        if (!token) {//如果没有token直接返回错误
            res.json({
                code: '401',
                msg: "缺少token"
            });

            return;
        } else {
            jwt.verify(token, config.token.secretOrPrivateKey, function (err, tokenData) {
                if (err) {
                    res.json({
                        code: "402",
                        msg: "token错误"
                    });
                    return;
                } else {
                    //验证是否为管理员
                    if (isAdmin && tokenData.uuid && !tokenData.isAdmin) {
                        //验证userUuid 避免普通用户登录修改其他人资料   
                        var userUuid = (req.body || req.query || req.params)['userUuid'];
                        if (userUuid && userUuid != tokenData.uuid) {
                            res.json({
                                code: "403",
                                msg: "无权访问"
                            });
                            return;
                        } else {
                            next();
                        }

                    } else {
                        next();
                    }
                }
            })
        }
    },
    /**
     * 清除token
     */
    delToken: function (token) {
        if (!token) {
            return 'delTokenFail';
        } else {
            jwt.decode(token);
            return 'delTokenSuccess';
        }
    },



}