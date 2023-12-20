var i18n = require("i18n");
var co = require("co");
var utils = require("../libs/utils");
var WebConfig = require('../models/index').WebConfig; //web配置表
// var dataSummary = require('./dataSummary');
module.exports = {
    // 创建webConfig配置文件
    createWebConfig: function (req, res, next) {
        var params = req.body || req.params;
        var webConfig = {
            siteName: utils.trim(params.siteName),
            siteAddress: utils.trim(params.siteAddress),
            siteDescription: utils.trim(params.siteDescription),
            keyWord: utils.trim(params.keyWord),
            recordNumber: utils.trim(params.recordNumber),
            internetAlert: utils.trim(params.internetAlert),
            isOpenCoverImage: utils.trim(params.isOpenCoverImage),
            isOpenCommentaries: utils.trim(params.isOpenCommentaries),
        };


        if (!webConfig.siteName || !webConfig.siteAddress) {
            utils.handleJson({
                response: res,
                msg: i18n.__('siteName&&siteAddress')
            });

            return;
        }

        co(function* () {
            var webConfigResult = yield WebConfig.create(webConfig);

            if (!webConfigResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doFail')
                });
                return;
            }

            var webConfigOne = webConfigResult.dataValues;
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    webConfig: webConfigOne
                }
            })


        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },
    // 查询webConfig配置文件
    infoWebConfig: function (req, res, next) {

        co(function* () {
            var webConfigResult = yield WebConfig.findOne({});
            if (!webConfigResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doFail')
                });
                return;
            }
            var webConfig = webConfigResult.dataValues;
            // dataSummary.createCategory();
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    webConfig: webConfig
                }
            });
        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },
    // 更新webConfig配置文件
    updateWebConfig: function (req, res, next) {
        var params = req.body || req.params;
        var webConfig = params.webConfig;
        var webConfigUuid = utils.trim(webConfig.uuid);
        if (!webConfigUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassParamsComplete')
            });

            return;
        }
        co(function* () {
            var webConfigResult = yield WebConfig.update(webConfig, {
                where: {
                    uuid: webConfigUuid
                }
            });

            if (!webConfigResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__("doFail")
                });
                return;
            }

            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: "+1"
            })


        }).catch(function (error) {
            utils.handleJson({
                response: res,
                error: error
            })
        })

    }
}