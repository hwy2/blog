var co = require('co');
var i18n = require('i18n'); //i18n国际化
var utils = require('../libs/utils'); //工具类
var config = require('../config/default'); //配置文件
var Category = require('../models/index').Category; //文章类别
var Article = require('../models/index').Article; //文章
var User = require('../models/index').User;
var UserInfo = require('../models/index').UserInfo;
var Comment = require('../models/index').Comment;
var dataSummary = require('./dataSummary');
module.exports = {
    /**
     * 获取文章类别
     * info
     */
    categoryInfo: function (req, res, next) {
        var params = req.query || req.params;
        var categoryUuid = utils.trim(params.categoryUuid);
        if (!categoryUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassParamsComplete')
            });
            return;
        }

        co(function* () {
            var categoryResult = yield Category.findOne({
                where: {
                    uuid: categoryUuid
                }
            });

            if (!categoryResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('categoryNotExist')
                });
                return;
            }
            var category = categoryResult.dataValues;

            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    category: category
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
     * 创建类别
     * create
     */
    categoryCreate: function (req, res, next) {
        var params = req.body || req.params;
        var title = utils.trim(params.title);
        if (!title) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassParamsComplete')
            });
            return;
        }

        co(function* () {
            var categoryResult = yield Category.findOne({
                where: {
                    title: title
                }
            });

            if (categoryResult) { //是否存在相同title
                utils.handleJson({
                    response: res,
                    msg: i18n.__('categoryAlreadyExists')
                });
                return;
            }

            categoryResult = yield Category.create({
                title: title
            });

            if (!categoryResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doFail')
                });

                return;
            }

            var category = categoryResult.dataValues;
            dataSummary.summaryCategory(req, res, next);
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    category: category
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
     * 删除
     * delete
     */
    categoryDelete: function (req, res, next) {
        var params = req.query || req.params;
        var categoryUuid = utils.trim(params.uuid);

        if (!categoryUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            });
            return;
        }

        co(function* () {
            var categoryResult = yield Category.findOne({
                where: {
                    uuid: categoryUuid
                }
            });

            if (categoryResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('categoryNotExist')
                });

                return;
            }

            categoryResult = yield Category.destroy({
                where: {
                    uuid: categoryUuid
                }
            });
            if (!categoryResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doFail')
                });
                return;
            }
            dataSummary.summaryCategory(req, res, next);
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: "-1"
            });


        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            });
        })

    },
    /**
     * 更新
     * update
     */
    categoryUpdate: function (req, res, next) {
        var params = req.body || req.params;
        var category = utils.trim(params.category);
        var categoryUuid = utils.trim(category.uuid);
        if (!categoryUuid) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassUuid')
            });
            return;
        }

        co(function* () {
            var categoryResult = yield Category.findOne({
                where: {
                    uuid: categoryUuid
                }
            });

            if (!categoryResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('categoryNotExist')
                })
                return;
            }
            categoryResult = yield Category.update(category, {
                where: {
                    uuid: categoryUuid
                }
            });

            if (!categoryResult) {
                utils.handleJson({
                    response: res,
                    msg: i18n.__('doFail')
                });
                return;
            }
            category = categoryResult.dataValues;
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    category: category
                }
            })

        }).catch(function () {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },
    /**
     * 全部分类
     * list
     */
    categoryList: function (req, res, next) {
        var params = req.query || req.params;
        // 分页
        var page = {
            currPage: utils.trim(params.currPage) || config.page.currPage, //获取当前页
            pageSize: utils.trim(params.pageSize) || config.page.pageSize //每页数量
        }
        co(function* () {
            var categoryResult = yield Category.findAndCountAll({
                limit: page.pageSize,
                offset: page.pageSize * (page.currPage - 1),
                order: [
                    ['createDate', 'DESC']
                ]
            });

            var categoryList = categoryResult.rows || [];
            // 处理分页
            var pageResult = yield utils.handlePage({
                count: categoryResult.count,
                page: page
            });

            utils.handleJson({
                response: res,
                result: {
                    list: categoryList,
                    page: pageResult
                }
            })



        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    }
}