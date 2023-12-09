var co = require('co');
var Promise = require("bluebird");
var i18n = require('i18n'); //i18n国际化
var utils = require('../libs/utils'); //工具类
var Attachment = require('../models/index').Attachment; //附件
var User = require('../models/index').User; //用户
var fileService = require('../services/file'); //文件服务
// var fs = require('fs');
var config = require('../config/default'); //配置文件
const { default: axios } = require('axios');
const { Op } = require('sequelize');
// const router = require('../routes/common');
module.exports = {
    /**
     * 文件上传
     */
    uploadEnclosure: function (req, res, next) {
        var params = req.body || req.params
        // console.log(req.body)
        var files = req.files;
        console.log(files)
        var userUuid = utils.trim(params.userUuid)
        if (!files || !files.length) {
            //err
            utils.handleError({
                response: res,
                error: i18n.__('uploadFileFail'),
            });
            return;
        }
        if (!userUuid) {
            utils.handleError({
                response: res,
                error: i18n.__('pleasePassUuid'),
            });
            return;
        }

        co(function* () {
            var fileResult = yield Promise.all(files.map(function (file) {
                return Attachment.create({
                    name: file.originalname,
                    relativeUrl: file.filename,
                    absoluteUrl: fileService.getFilePath("default", file.filename),
                    type: fileService.handlerFileType(file.mimetype), //对应int值
                    size: file.size, //文件大小
                    userUuid: userUuid
                })
            }));

            //success
            utils.handleJson({
                response: res,
                msg: i18n.__('uploadFileSuccess'),
                result: {
                    fileList: fileResult,
                },
            });

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },
    /** 随机文件 */
    returnRandomPictures: async function (req, res, next) {
        var picturesList = fileService.getFileName();
        var random = parseInt(Math.floor(Math.random() * picturesList.length));

        // 重定向为新的链接
        res.location(config.fileAbsolute.wallpaper + picturesList[random]);
        // res.location('https://api.baka.fun/acgpic?source=tx')
        res.send(302);

    },
    /** 获取所有文件 */
    getFileList: function (req, res, next) {
        var params = req.query || req.params;
        var name = utils.trim(params.name)
        var condition = {
        }

        if (name) {
            condition.name = {
                [Op.like]: '%' + name + '%'
            }
        }
        // 分页
        var page = {
            currPage: parseInt(utils.trim(params.currPage)) || config.page.currPage, //获取当前页
            pageSize: parseInt(utils.trim(params.pageSize)) || config.page.pageSize //每页数量
        }

        co(function* () {
            var fileResult = yield Attachment.findAndCountAll({
                where: condition,
                include: [{
                    model: User,
                }],
                limit: page.pageSize, //每页多少条
                offset: page.pageSize * (page.currPage - 1), //偏移量
                order: [ //排序
                    ['createDate', 'DESC']
                ]
            });

            var pageResult = yield utils.handlePage({
                count: fileResult.count,
                page: page
            })

            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    list: fileResult.rows,
                    page: pageResult
                }
            })

        }).catch(error => {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },
    /** 获取用户上传文件 */
    getUserFileList: function (req, res, next) {
        var params = req.query || req.params;
        var userUuid = utils.trim(params.userUuid)
        var name = utils.trim(params.name)
        var condition = {
            userUuid: userUuid
        }

        if (name) {
            condition.name = {
                [Op.like]: '%' + name + '%'
            }
        }
        if (!userUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            })

            return
        }
        // 分页
        var page = {
            currPage: parseInt(utils.trim(params.currPage)) || config.page.currPage, //获取当前页
            pageSize: parseInt(utils.trim(params.pageSize)) || config.page.pageSize //每页数量
        }

        co(function* () {
            var fileResult = yield Attachment.findAndCountAll({
                where: condition,
                include: [{
                    model: User,
                }],
                limit: page.pageSize, //每页多少条
                offset: page.pageSize * (page.currPage - 1), //偏移量
                order: [ //排序
                    ['createDate', 'DESC']
                ]
            });

            var pageResult = yield utils.handlePage({
                count: fileResult.count,
                page: page
            })

            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    list: fileResult.rows,
                    page: pageResult
                }
            })

        }).catch(error => {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },
    /** 删除文件 */
    deleteFile: function (req, res, next) {
        var params = req.query || req.params;
        var fileUuid = utils.trim(params.fileUuid)
        if (!fileUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            })
            return
        }
        co(function* () {
            var resultOne = yield Attachment.findOne({
                where: {
                    uuid: fileUuid
                }
            })
            if (!resultOne) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('fileDoesNotExist')
                })
                return
            }
            var result = yield Attachment.destroy({
                where: {
                    uuid: fileUuid
                }
            })

            if (!result) {
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
        }).catch(error => {
            utils.handleError({
                response: res,
                error: error
            })
        })
    }
}