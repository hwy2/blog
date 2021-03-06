var co = require('co');
var Promise = require("bluebird");
var i18n = require('i18n'); //i18n国际化
var utils = require('../libs/utils'); //工具类
var Attachment = require('../models/index').Attachment; //附件
var fileService = require('../services/file'); //文件服务
var fs = require('fs');
var config = require('../config/default'); //配置文件
const router = require('../routes/common');
module.exports = {
    /**
     * 文件上传
     */
    uploadEnclosure: function (req, res, next) {
        var files = req.files;
        if (!files || !files.length) {
            //err
            utils.handleError({
                response: res,
                error: i18n.__('uploadFileFail'),
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
    returnRandomPictures: function (req, res, next) {
        var picturesList = fileService.getFileName();
        var random = parseInt(Math.floor(Math.random() * (picturesList.length - 1 + 1) + 1));
        // 重定向为新的链接
        res.location(config.fileAbsolute.wallpaper + picturesList[random]);
        res.send(302);

    }
}