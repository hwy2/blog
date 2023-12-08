var i18n = require("i18n");
var co = require("co");
var utils = require("../libs/utils");
var Links = require('../models/index').Links;
var config = require('../config/default');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var WebConfig = require('../models/index').WebConfig; //web配置表
var dateFormat = require("dateformat"); //时间格式化
const configs = require('../config/default');
const email = require('../services/email');
module.exports = {
    /**
     * 创建友链信息
     */
    createLinks: function (req, res, next, isApply) {
        var _this = this;
        var params = req.body || req.params;
        var linkModel = {
            name: utils.trim(params.name),
            URL: utils.trim(params.URL),
            sort: utils.trim(params.sort),
            image: utils.trim(params.image) || config.fileAbsolute.face + "nopic.jpg",
            description: utils.trim(params.description),
            state: isApply ? 0 : utils.trim(params.state) || 0
        };

        if (!linkModel.name || !linkModel.URL) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassParamsComplete')
            });
            return;
        }
        if (linkModel.image === "http://") {
            linkModel.image = config.fileAbsolute.face + "nopic.jpg"
        }
        co(function* () {
            // console.log(linkModel);
            var LinksResult = yield Links.create(linkModel);
            if (!LinksResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doFail')
                });
                return;
            }
            var links = LinksResult.dataValues;
            if (isApply) {
                _this.getEmailInformation(links);
            }
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    links: links
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
     * 查询友链信息
     */
    readLinks: function (req, res, next) {
        var params = req.query || req.params;
        var linksUuid = utils.trim(params.linksUuid);
        if (!linksUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            });
            return;
        }
        co(function* () {
            var LinksResult = yield Links.findOne({
                where: {
                    uuid: linksUuid
                }
            });

            if (!LinksResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doFail')
                });
                return;
            }
            var links = LinksResult.dataValues;
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    links: links
                }
            })

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            });
        })
    },
    /**
     * 查询全部友链信息
     */
    readLinksList: function (req, res, next) {
        var params = req.query || req.params;
        var nameVague = utils.trim(params.name);
        var state = parseInt(params.state);
        var condition = {};
        if (nameVague) {
            condition.name = {
                [Op.like]: '%' + nameVague + '%'
            }
        }
        if (state) {
            condition.state = state
        }
            // 分页
            var page = {
                currPage: parseInt(utils.trim(params.currPage)) || config.page.currPage, //获取当前页
                pageSize: parseInt(utils.trim(params.pageSize)) || config.page.pageSize //每页数量
            }
        co(function* () {
            var LinksResult = yield Links.findAndCountAll({
                where: condition,
                limit: page.pageSize,
                offset: page.pageSize * (page.currPage - 1),
                order: [
                    ['createDate', 'DESC']
                ]
            });
            if (!LinksResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doFail')
                });
                return;
            }
            var links = LinksResult.rows || [];
            // 处理分页
            var pageResult = yield utils.handlePage({
                count: LinksResult.count,
                page: page
            })
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    list: links,
                    page: pageResult
                }
            })

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            });
        })
    },
    /**
     * 更新友链信息
     */
    updateLinks: function (req, res, next) {
        var params = req.body || req.params;
        var linkModel = params.links;
        if (!linkModel.state) linkModel.state = 0;
        if (!linkModel.uuid || !linkModel.name || !linkModel.URL) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassParamsComplete')
            });
            return;
        }
        if (!linkModel.image) {
            linkModel.image = config.fileAbsolute.face + "nopic.jpg";
        }
        co(function* () {
            var LinksFindOne = yield Links.findOne({
                where: {
                    uuid: linkModel.uuid
                }
            });
            if (!LinksFindOne) {
                utils.handleJson({
                    response: res,
                    msg: i18n__('noInformationFound')
                });
                return;
            }

            var LinksResult = yield Links.update(linkModel, {
                where: {
                    uuid: linkModel.uuid
                }
            });
            if (!LinksResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n__('doFail')
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
                response: res,
                error: error
            })
        })
    },

    /**
     * 删除友链信息
     */
    deleteLinks: function (req, res, next) {
        var params = req.query || req.params;
        var linksUuid = utils.trim(params.linksUuid);
        if (!linksUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            });
            return;
        }

        co(function* () {
            var LinksFindOne = yield Links.findOne({
                where: {
                    uuid: linksUuid
                }
            });

            if (!LinksFindOne) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('noInformationFound')
                });
                return;
            }

            var LinksResult = yield Links.destroy({
                where: {
                    uuid: linksUuid
                }
            });
            if (!LinksResult) {
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
            });

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },

    /**
     * 发送审核邮件
     */
    getEmailInformation: async function (links) {

        var webConfigResult = await WebConfig.findOne({});
        var webConfig = webConfigResult.dataValues;
        var object = ` <div id="contentDiv" onmouseover="getTop().stopPropagation(event);"
        onclick="getTop().preSwapLink(event, 'html', 'ZC2010-kTkPZlCCgcLTTSBBibaHRb8');"
        style="position:relative;font-size:14px;height:auto;padding:15px 15px 10px 15px;z-index:1;zoom:1;line-height:1.7;"
        class="body">
        <div id="qm_con_body">
            <div id="mailContentContainer" class="qmbox qm_con_body_content qqmail_webmail_only" style="">
                <div
                    style="margin:100px auto;background-color:#fff;  width:866px; border:1px solid #F1F0F0;box-shadow: 0 0 5px #F1F0F0;">
                    <div
                        style="width:838px;height: 78px; padding-top: 10px;padding-left:28px; background-color:#F7F7F7;">
                        <a style="cursor:pointer; font-size:30px; color:#333;text-decoration: none; font-weight: bold;"
                            href="${webConfig.siteAddress}" rel="noopener" target="_blank">${webConfig.siteName}</a><span
                            style="color:#999; font-size:14px;padding-left:20px;">${webConfig.siteDescription}</span>
                    </div>
                    <div style="padding:30px;">
                        <div style="height:50px; line-height:50px; font-size:16px; color:#9e9e9e;">您有一条新的友链需要审核</div>
                        <div style="line-height:30px;  font-size:16px; margin-bottom:20px; text-indent: 2em;">
                            友链名称：${links.name}<br>
                            &emsp;&emsp;友链地址：${links.URL}
                        </div>
                        <div style="line-height:40px;  font-size:14px;">
                            <label style="color:#999;">请登录网站后台，进行审核</label>
                        </div>
                        <div style="line-height:40px;  font-size:14px;">
                            <label style="color:#999;">申请时间：</label>
                            <span style="color:#333;">${dateFormat(links.createDate,"yyyy-mm-dd HH:MM:ss")}</span>
                        </div>
                    </div>
                </div>

                <style type="text/css">
                    .qmbox style,
                    .qmbox script,
                    .qmbox head,
                    .qmbox link,
                    .qmbox meta {
                        display: none !important;
                    }
                </style>
            </div>
        </div><!-- -->
        <style>
            #mailContentContainer .txt {
                height: auto;
            }
        </style>
    </div>`;
        var opts = {
            to: configs.email.admin,
            subject: `来自[${webConfig.siteName}]的新消息`,
            html: object
        }

        // 发送邮件
        email.sendSystemEmail(opts);
    }
}