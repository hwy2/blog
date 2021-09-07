var co = require('co');
var i18n = require('i18n'); //i18n国际化
var utils = require('../libs/utils'); //工具类
var config = require('../config/default'); //配置文件
var Comment = require('../models/index').Comment; //评论
var dataSummary = require('./dataSummary');
var Sequelize = require('sequelize');
var WebConfig = require('../models/index').WebConfig; //web配置表
const configs = require('../config/default');
const email = require('../services/email');
const Op = Sequelize.Op;
var dateFormat = require("dateformat"); //时间格式化
module.exports = {
    /**
     * 创建评论
     */
    createComment: function (req, res, next) {
        let _this = this;
        var params = req.body || req.params;
        var nickName = utils.trim(params.nickName);
        var ip = utils.trim(params.ip);
        var agent = utils.trim(params.agent);
        var email = utils.trim(params.email);
        var comments = utils.trim(params.comments);
        var articleUuid = utils.trim(params.articleUuid);
        var faceUrl = utils.getGravatarURL(email);
        var link = utils.trim(params.link);
        if (!nickName || !email || !comments) {
            console.log("nickName", nickName);
            console.log("email", email);
            console.log("comments", comments);
            utils.handleJson({
                response: res,
                msg: i18n.__("pleasePassParamsComplete")
            });

            return;
        }

        co(function* () {
            var commentResult = yield Comment.create({
                nickName: nickName,
                ip: ip,
                agent: agent,
                email: email,
                comments: comments,
                articleUuid: articleUuid,
                faceUrl: faceUrl,
                link: link
            });

            if (!commentResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__("doFail")
                });
                return;
            }

            var commen = commentResult.dataValues;

            // 统计评论数据
            dataSummary.summaryComment(req, res, next);
            _this.getEmailInformation(commen, articleUuid, req, res, next)
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    commen: commen
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
     * 审核评论
     */
    approvedComment: function (req, res, next) {
        var params = req.body || req.params;
        var commentUuid = utils.trim(params.commentUuid);
        var status = utils.trim(params.status) || 1;
        if (!commentUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            })
            return;
        }

        co(function* () {
            var commentResult = yield Comment.update({
                status: status
            }, {
                where: {
                    uuid: commentUuid
                }
            });

            if (!commentResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__("doFail")
                });

                return;
            }

            var comment = commentResult.dataValues;

            utils.handleJson({
                response: res,
                msg: i18n.__("doSuccess"),
                result: {
                    comment: comment
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
     * 修改评论
     */
    updateComment: function (req, res, next) {
        var params = req.body || req.params;
        var comment = utils.handleArray(params.comment);
        var checkFlag = utils.validateMandatory(comment);
        if (!checkFlag) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassParamsComplete')
            });

            return;
        }
        var commentUuid = utils.trim(comment.uuid);

        co(function* () {
            var commentResult = yield Comment.update(comment, {
                where: {
                    uuid: commentUuid
                }
            });

            if (!commentResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doFail')
                });
                return;
            }

            var comment = commentResult.dataValues;
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: ""
            });

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
    deleteComment: function (req, res, next) {
        var params = req.query || req.params;
        var comment = utils.trim(params.commentUuid);
        if (!comment) {
            utils.handleJson({
                response: res,
                msg: i18n.__("pleasePassUuid")
            });
            return;
        }

        co(function* () {
            var commentResult = yield Comment.destroy({
                where: {
                    uuid: commentUuid
                }
            });

            if (!commentResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doFail')
                });
                return;
            }
            // 统计评论数据
            dataSummary.summaryComment(req, res, next);

            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: "-1"
            })


        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },
    /**
     * 查询所有评论
     * 按需查询
     * 模糊查询
     */
    getCommentList: function (req, res, next) {
        var params = req.query || req.params;
        var comments = utils.trim(params.comments);
        var email = utils.trim(params.email);
        var status = utils.trim(params.status);
        var condition = {};
        if (comments) {
            condition.comments = {
                [Op.like]: '%' + comments + '%'
            }
        }

        if (email) {
            condition.email = email
        }

        if (status) {
            condition.status = status
        }

        // 分页
        var page = {
            currPage: parseInt(utils.trim(params.currPage)) || config.page.currPage, //获取当前页
            pageSize: parseInt(utils.trim(params.pageSize)) || config.page.pageSize //每页数量
        }

        co(function* () {
            var commentResult = yield Comment.findAndCountAll({
                where: condition,
                attributes: {
                    exclude: ['ip', 'agent', '']
                },
                limit: page.pageSize, //每页多少条
                offset: page.pageSize * (page.currPage - 1), //偏移量
                order: [ //排序
                    ['createDate', 'DESC']
                ]
            });
            var commentList = commentResult.rows || [];

            // 处理分页
            var pageResult = yield utils.handlePage({
                count: commentResult.count,
                page: page
            })

            // success

            utils.handleJson({
                response: res,
                result: {
                    list: commentList,
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
     * 发送新评论邮件
     */
    getEmailInformation:async function (commen, articleUuid, req, res, next) {

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
                        <div style="height:50px; line-height:50px; font-size:16px; color:#9e9e9e;">您有一条新的评论</div>
                        <div style="line-height:30px;  font-size:16px; margin-bottom:20px; text-indent: 2em;">
                            ${commen.comments}
                        </div>
                        <div style="line-height:40px;  font-size:14px;">
                            <label style="color:#999;">评论人：</label>
                            <span style="color:#333;">${commen.nickName} 邮箱: <a href="mailto:${commen.email}" rel="noopener"
                                    target="_blank">${commen.email}</a></span>
                        </div>
                        <div style="line-height:40px;  font-size:14px;">
                            <label style="color:#999;">评论地址：</label>
                            <a href = "${webConfig.siteAddress+'/home/article/'+articleUuid}"
                                style="color:#333;" rel="noopener"
                                target="_blank">${webConfig.siteAddress+'/home/article/'+articleUuid}</a>
                        </div>
                        <div style="line-height:40px;  font-size:14px;">
                            <label style="color:#999;">评论时间：</label>
                            <span style="color:#333;">${dateFormat(commen.createDate,"yyyy-mm-dd HH:MM:ss")}</span>
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