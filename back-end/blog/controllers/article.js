var co = require('co');
var i18n = require('i18n'); //i18n国际化
var utils = require('../libs/utils'); //工具类
var config = require('../config/default'); //配置文件
var Article = require('../models/index').Article; //文章
var Category = require('../models/index').Category; //类别
var ArticleCategory = require('../models/index').ArticleCategory; //文章类别中间表
var User = require('../models/index').User;
var UserInfo = require('../models/index').UserInfo;
var Comment = require('../models/index').Comment;
var Mysql = require('../models/mysql');
var dateFormat = require("dateformat"); //时间格式化
var dataSummary = require('./dataSummary');
var category = require('./category');
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
        var categoryUuid = utils.trim(params.categoryUuid);
        var condition = {};
        if (categoryUuid) {
            condition.uuid = categoryUuid
        }
        // 分页
        var page = {
            currPage: parseInt(utils.trim(params.currPage)) || config.page.currPage, //获取当前页
            pageSize: parseInt(utils.trim(params.pageSize)) || config.page.pageSize //每页数量
        }

        co(function* () {
            var articleResult = yield Article.findAndCountAll({
                include: [{
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
                limit: page.pageSize,
                offset: page.pageSize * (page.currPage - 1),
                order: [
                    ['createDate', 'DESC']
                ]
            });

            if (!articleResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('articleNotExist')
                });
                return;
            }
            var articleList = articleResult.rows || [];

            // 处理分页
            var pageResult = yield utils.handlePage({
                count: articleResult.count,
                page: page
            });
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    list: articleList,
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

        if (!title && !content && !userUuid) {
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
    updateArticle: async function (req, res, next) {
        var params = req.body || req.params;
        var article = JSON.parse(params.article);
        var articleUuid = utils.trim(article.uuid);
        var categoryUuids = utils.handleArray(params.categoryUuids);
        var works = await Mysql.transaction(); //创建数据库事务
        // console.log("", works)
        if (!articleUuid || !categoryUuids) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            });
            return;
        }

        co(function* () {

            var articleResult = yield Article.destroy({
                where: {
                    uuid: articleUuid
                },
                transaction: works
            });
            yield ArticleCategory.destroy({ //销毁不是uuid限制项，无法返回影响的条数
                where: {
                    articleUuid: articleUuid
                },
                force: true,
                transaction: works
            });
            console.log("articleResult", articleResult);
            if (!articleResult) {
                yield works.rollback();
                utils.handleJson({
                    response: res,
                    msg: i18n.__('updateArticleFail')
                });
                return;
            }
            articleResult = yield Article.create({
                uuid: articleUuid,
                title: article.title,
                photo: article.photo,
                content: article.content,
                state: article.state,
                abstract: article.abstract,
                ishot: article.ishot,
                userUuid: article.userUuid,
                updateDate: dateFormat(new Date(), 'yyyy-mm-dd hh:MM:ss')
            }, {
                transaction: works
            });
            var categoryResult = yield Category.findAll({
                where: {
                    uuid: categoryUuids
                },
                transaction: works
            });

            if (!articleResult || !categoryResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('updateArticleFail')
                });
                yield works.rollback();
                return;
            }
            yield works.commit();
            //通过addCategory方法在ArticleCategory表添加记录
            yield articleResult.addCategory(categoryResult);

            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: "+1"
            })
        }).catch(async function (error) {
            await works.rollback();
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