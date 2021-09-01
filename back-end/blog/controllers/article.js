var co = require('co');
var i18n = require('i18n'); //i18n国际化
var utils = require('../libs/utils'); //工具类
var config = require('../config/default'); //配置文件
var {
    Article,
    Category,
    ArticleCategory,
    User,
    UserInfo,
    Comment
} = require('../models/index'); //文章

var Mysql = require('../models/mysql');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var dateFormat = require("dateformat"); //时间格式化
var dataSummary = require('./dataSummary');
module.exports = {
    /**
     * 获取文章详情
     */
    getArticleInfo: function (req, res, next) {
        var params = req.query || req.params;
        var articleUuid = utils.trim(params.articleUuid);
        if (!articleUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            });
            return;
        }
        co(function* () {
            var articleResult = yield Article.findOne({
                where: {
                    uuid: articleUuid
                },
                include: [{
                        model: Category,
                        attributes: ['uuid', 'title']
                    },
                    {
                        model: User,
                        attributes: ['uuid', 'email'],
                        include: [{
                            model: UserInfo,
                            attributes: ['uuid', 'nickName', 'face']
                        }]
                    },
                    {
                        model: Comment
                    }
                ]
            });

            if (!articleResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('articleNotExist')
                });
                return;
            }
            var article = articleResult.dataValues;
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    article: article
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
     * 获取所有文章
     */
    getArticleList: function (req, res, next) {
        var params = req.query || req.params;
        var categoryTitle = utils.trim(params.categoryTitle);
        var articleVague = utils.trim(params.articleVague);
        var categoryCondition = {},
            condition = {};
        if (categoryTitle) {
            categoryCondition.title = categoryTitle
        }
        if (articleVague) {
            condition.content = {
                [Op.like]: '%' + articleVague + '%'
            }
        }
        // 分页
        var page = {
            currPage: parseInt(utils.trim(params.currPage)) || config.page.currPage, //获取当前页
            pageSize: parseInt(utils.trim(params.pageSize)) || config.page.pageSize //每页数量
        }

        co(function* () {
            var articleResultCount = yield Article.findAll({
                include: [{
                    model: Category,
                    where: categoryCondition
                }],
                where: condition
            })
            // 由于findAndCountAll计数器的不正确性，所以需要先查询所有的条数再分页
            var articleResult = yield Article.findAll({
                include: [{
                    model: Category,
                    where: categoryCondition
                }, {
                    model: User,
                    attributes: ['uuid', 'email'],
                    include: [{
                        model: UserInfo,
                        attributes: ['uuid', 'nickName']
                    }]
                }, {
                    model: Comment,
                    attributes: ['uuid']
                }],
                where: condition,
                limit: page.pageSize,
                offset: page.pageSize * (page.currPage - 1),
                order: [
                    ['createDate', 'DESC']
                ]
            })

            if (!articleResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('articleNotExist')
                });
                return;
            }
            // 处理分页
            var pageResult = yield utils.handlePage({
                count: articleResultCount.length,
                page: page
            });
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    list: articleResult,
                    page: pageResult
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
     * 创建文章
     */
    createArticle: function (req, res, next) {
        var params = req.body || req.params;
        var title = utils.trim(params.title);
        var photo = utils.trim(params.photo);
        var content = utils.trim(params.content);
        var state = utils.trim(params.state) || "0";
        var abstract = utils.trim(params.abstract);
        var ishot = utils.trim(params.ishot) || false;
        var userUuid = utils.trim(params.userUuid);
        var categoryUuids = utils.handleArray(params.categoryUuids);
        console.log(categoryUuids)

        if (!title || !content || !userUuid || !categoryUuids) {
            utils.handleJson({
                response: res,
                msg: i18n.__("pleasePassParamsComplete")
            });

            return;
        }

        co(function* () {
            var articleResult = yield Article.create({
                title: title,
                photo: photo,
                content: content,
                state: state,
                abstract: abstract,
                ishot: ishot,
                userUuid: userUuid
            });
            var categoryResult = yield Category.findAll({
                where: {
                    uuid: categoryUuids
                }
            });
            if (!articleResult || !categoryResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('creationFailed')
                });

                return;
            }
            // console.log(articleResult);
            //通过addCategory方法在ArticleCategory表添加记录
            yield articleResult.addCategory(categoryResult)
            dataSummary.updateDataSummary(req, res, next);
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: "+1"
            });

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })

    },

    /**
     * 修改文章
     * 
     */
    updateArticle: function (req, res, next) {
        var params = req.body || req.params;
        var article = JSON.parse(params.article);
        var articleUuid = utils.trim(article.uuid);
        var categoryUuids = utils.handleArray(params.categoryUuids);
        // console.log("", works)
        if (!articleUuid || !categoryUuids) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            });
            return;
        }

        co(function* () {
            // 查询是否有该记录
            var article = yield Article.findOne({
                where: {
                    uuid: articleUuid
                }
            });
            if (!article) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('articleNotExist')
                });
                return;
            }
            var articleResult = yield Article.update(article, {
                where: {
                    uuid: articleUuid
                }
            });
            var categoryResult = yield Category.findAll({
                where: {
                    uuid: categoryUuids
                },
            });
            console.log(article);
            article.setCategories(categoryResult)

            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: "+1"
            })
        }).catch(async function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },

    /**
     * 删除文章
     */
    deleteArticle: function (req, res, next) {
        var params = req.query || req.params;
        var articleUuid = utils.trim(params.articleUuid);
        if (!articleUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            });

            return;
        }

        co(function* () {
            var articleResult = yield Article.findOne({
                where: {
                    uuid: articleUuid
                }
            });

            if (!articleResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('articleNotExist')
                });
                return;
            }

            yield ArticleCategory.destroy({
                where: {
                    articleUuid: articleUuid
                }
            });
            articleResult = yield Article.destroy({
                where: {
                    uuid: articleUuid
                }
            })
            if (!articleResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doFail')
                });
                return;
            }
            dataSummary.updateDataSummary(req, res, next);
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
     * 文章浏览量增加
     */
    addeArticlePageViews: function (req, res, next) {
        var params = req.query || req.params;
        var articleUuid = utils.trim(params.articleUuid);
        var articlePageview = utils.trim(params.articlePageview);

        console.log(req.ip);

        if (!articleUuid || !articlePageview) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassParamsComplete')
            });
            return;
        }

        co(function* () {
            var pageViews = ++articlePageview;
            var articleResult = yield Article.update({
                pageview: pageViews
            }, {
                where: {
                    uuid: articleUuid
                }
            });

            if (!articleResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('articleNotExist')
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
    }
}