var co = require('co');
var i18n = require('i18n'); //i18n国际化
var utils = require('../libs/utils'); //工具类
var config = require('../config/default'); //配置文件
var Comment = require('../models/index').Comment; //评论
var Article = require('../models/index').Article; //评论
var dataSummary = require('./dataSummary');
var Sequelize = require('sequelize');
var WebConfig = require('../models/index').WebConfig; //web配置表
const configs = require('../config/default');
const email = require('../services/email');
const Op = Sequelize.Op;
var dateFormat = require("dateformat"); //时间格式化
const { isArray } = require('underscore');
const { User } = require('../models/index');
module.exports = {
    /**
     * 创建评论
     */
    createComment: function (req, res, next, status = 1) {
        _this = this
        var params = req.body || req.params;

        var comment = {
            nickName: utils.trim(params.nickName),
            ip: utils.trim(params.ip),
            agent: utils.trim(params.agent),
            email: utils.trim(params.email),
            comments: utils.trim(params.comments),
            articleUuid: utils.trim(params.articleUuid),
            faceUrl: utils.getGravatarURL(email),
            link: utils.trim(params.link),
            vestingPlace: utils.trim(params.vestingPlace),
            status: status
        }

        if (!comment.nickName || !comment.email || !comment.comments) {
            utils.handleJson({
                response: res,
                msg: i18n.__("pleasePassParamsComplete")
            });

            return;
        }

        co(function* () {
            var commentResult = yield Comment.create(comment);
            if (JSON.stringify(commentResult) == "{}") {
                utils.handleJson({
                    response: res,
                    msg: i18n.__("doFail")
                });
                return;
            }

            var commen = commentResult.dataValues;

            // 统计评论数据
            dataSummary.summaryComment(req, res, next);

            _this.getEmailInformation(commen, comment.articleUuid, req, res, next)
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    commen: commen
                }
            })

        }).catch(function (error) {
           // console.log('error')
            utils.handleError({
                response: res,
                error: error
            })
        })

    },
    /**
     * 回复评论
     */
    recoverComment: function (req, res, next) {
        this.createComment(req, res, next, 0)
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
        var comment = params.comment;
        var commentUuid = utils.trim(comment.uuid);
        var nickName = utils.trim(comment.nickName);
        var email = utils.trim(comment.email);
        var comments = utils.trim(comment.comments);
        if (!nickName || !email || !comments, !commentUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassParamsComplete')
            });
            return;
        }
        //console.log(comment)
        // return
        co(function* () {
            var commentFindOne = yield Comment.findOne({
                where: {
                    uuid: commentUuid
                }
            });
            if (!commentFindOne) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('noInformationFound')
                });
                return;
            }
            var commentResult = yield Comment.update({ nickName, email, comments }, {
                where: {
                    uuid: commentUuid
                }
            });
            //console.log('ss', commentResult)
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
                result: "u1"
            });

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })

    },
    /**
     * 修改评论状态
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    updateCommentStatus: function (req, res, next) {
        var params = req.body || req.params;
        var status = params.status;
        if (!status.toString()) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassParamsComplete')
            });

            return;
        }
        var commentUuid = utils.trim(params.commentUuid);
        if (!commentUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            });

            return;
        }
        co(function* () {
            var commentFindOne = yield Comment.findOne({
                where: {
                    uuid: commentUuid
                }
            });
            if (!commentFindOne) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('noInformationFound')
                });
                return;
            }
            var commentResult = yield Comment.update({ status: status }, {
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
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: 'u1'
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
        var commentUuid = utils.trim(params.commentUuid);
        if (!commentUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__("pleasePassUuid")
            });
            return;
        }

        co(function* () {
            var commentFindOne = yield Comment.findOne({
                where: {
                    uuid: commentUuid
                }
            });
            if (!commentFindOne) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('noInformationFound')
                });
                return;
            }
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
        // console.log(condition)
        // 分页
        var page = {
            currPage: parseInt(utils.trim(params.currPage)) || config.page.currPage, //获取当前页
            pageSize: parseInt(utils.trim(params.pageSize)) || config.page.pageSize //每页数量
        }

        co(function* () {
            var commentResult = yield Comment.findAndCountAll({
                where: condition,
                include: [{
                    model: Article
                }],
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
    getEmailInformation: async function (commen, articleUuid, req, res, next) {

        var webConfigResult = await WebConfig.findOne({});
        var webConfig = webConfigResult.dataValues;
        var articleResult = await Article.findOne({
            where: {
                uuid: articleUuid,

            },
            include: [
                { model: User }
            ]
        })
       // console.log('articleResult', articleResult.dataValues)
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
                            <span style="color:#333;">${commen.nickName}</span>
                            <br/>
                            <label style="color:#999;">邮箱: <a href="mailto:${commen.email}" rel="noopener"
                                    target="_blank">${commen.email}</a></label>
                        </div>
                        <div style="line-height:40px;  font-size:14px;">
                            <label style="color:#999;">评论地址：</label>
                            <a href = "${webConfig.siteAddress + '/home/article/' + articleUuid}"
                                style="color:#333;" rel="noopener"
                                target="_blank">${webConfig.siteAddress + '/home/article/' + articleUuid}</a>
                        </div>
                        <div style="line-height:40px;  font-size:14px;">
                            <label style="color:#999;">评论时间：</label>
                            <span style="color:#333;">${dateFormat(commen.createDate, "yyyy-mm-dd HH:MM:ss")}</span>
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
        var emailNum = config.email.admin
        if (articleResult.dataValues.user.state == "1") {
            emailNum = articleResult.dataValues.user.email
        }
        var opts = {
            to: emailNum,
            subject: `来自[${webConfig.siteName}]的新消息`,
            html: object
        }

        // 发送邮件
        email.sendSystemEmail(opts);
    },
    /**获取用户文章相关联的评论 */
    getUserCommentList: function (req, res, next) {
        //console.log('getUserCommentList')
        var params = req.query || req.params;
        var userUuid = utils.trim(params.userUuid);
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
        if (!userUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            });
            return
        }
        // 分页
        var page = {
            currPage: parseInt(utils.trim(params.currPage)) || config.page.currPage, //获取当前页
            pageSize: parseInt(utils.trim(params.pageSize)) || config.page.pageSize //每页数量
        }
        co(function* () {
            var articleResult = yield Article.findAll({
                where: {
                    userUuid
                },
                attributes: ['uuid'],
                include: [
                    {
                        model: Comment,
                        where: condition,
                        include: [{
                            model: Article
                        }],
                    }
                ]
            })
            // console.log('articleResult', articleResult)
            var commentsList = froItem(articleResult)
           console.log('哈哈',commentsList)
            var pageResult = yield utils.handlePage({
                count: commentsList.length,
                page: page
            })
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    list: commentsList.slice(0, 10),
                    page: pageResult
                }
            })

        }).catch(error => {
            utils.handleError({
                response: res,
                error: error
            })
            // console.log(error)
        })

    },

}

function froItem(list) {
    var commentsList = []
    for (const item of list) {
        if ((isArray(item.comments)) && (item.comments.length > 0)) {
            for (const iterator of item.comments) {
                commentsList.push(iterator)
            }
        }

    }
    return commentsList
}