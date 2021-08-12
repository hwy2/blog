var i18n = require("i18n");
var co = require("co");
var utils = require("../libs/utils");
var WebConfig = require('../models/index').WebConfig; //web配置表
var dataSummary = require('./dataSummary');
module.exports = {
    // 创建webConfig配置文件
    createWebConfig: function (req, res, next) {
        var params = req.body || req.params;
        var siteName = utils.trim(params.siteName);
        var siteAddress = utils.trim(params.siteAddress);
        var siteDescription = utils.trim(params.siteDescription);
        var keyWord = utils.trim(params.keyWord);
        var recordNumber = utils.trim(params.recordNumber);
        var internetAlert = utils.trim(params.internetAlert);

        if (!siteName || !siteAddress) {
            utils.handleJson({
                response: res,
                msg: i18n.__('siteName&&siteAddress')
            });

            return;
        }

        co(function* () {
            var webConfigResult = yield WebConfig.create({
                siteName: siteName,
                siteAddress: siteAddress,
                siteDescription: siteDescription,
                keyWord: keyWord,
                recordNumber: recordNumber,
                internetAlert: internetAlert
            });

            if (!webConfigResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doFail')
                });
                return;
            }

            var webConfig = webConfigResult.dataValues;
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    webConfig: webConfig
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
        var webConfig = utils.handleArray(params.webConfig);
        // 检查数据
        var checkFlag = utils.validateMandatory(webConfig);
        if (!checkFlag) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassParamsComplete')
            });

            return;
        }

        var webConfigUuid = utils.trim(webConfig.uuid);
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