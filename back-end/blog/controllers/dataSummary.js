var co = require('co');
var i18n = require('i18n'); //i18n国际化
var utils = require('../libs/utils'); //工具类
var DataSummary = require('../models/index').DataSummary; //数据汇总表
var Article = require('../models/index').Article; //文章
var Category = require('../models/index').Category; //类别
var Comment = require('../models/index').Comment; //类别
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = {
    getDataSummaryList: function (req, res, next) {

        co(function* () {
            var dataSummaryResult = yield DataSummary.findAndCountAll({
                attributes: ['name', 'value', 'type'],
                order: [
                    ['createDate', 'DESC']
                ]
            });

            var dataSummaryList = dataSummaryResult.rows || [];
            utils.handleJson({
                response: res,
                msg: i18n.__('doSuccess'),
                result: {
                    list: dataSummaryList
                }
            })
        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },
    summaryCategory: function (req, res, next) {
        co(function* () {
            var categoryResult = yield Category.findAndCountAll({});
            var categoriesTotal = categoryResult.count;

            yield DataSummary.update({
                value: categoriesTotal
            }, {
                where: {
                    name: "categoriesTotal"
                }
            })

        }).catch(function (error) {
            utils.handleJson({
                response: res,
                error: error
            })
        })

    },
    summaryAricle: function (req, res, next) {
        co(function* () {
            var articleResult = yield Article.findAndCountAll({
                where: {
                    state: {
                        [Op.or]: [1, 2],
                    }
                }
            });
            var articlesTotal = articleResult.count;
            yield DataSummary.update({
                value: articlesTotal
            }, {
                where: {
                    name: "articlesTotal"
                }
            });
        }).catch(function (error) {
            utils.handleJson({
                response: res,
                error: error
            })
        })
    },
    summaryPage: function (req, res, next) {
        co(function* () {
            var articleResult = yield Article.findAndCountAll({
                where: {
                    state: 4
                }
            });
            var pagesTotal = articleResult.count;
            yield DataSummary.update({
                value: pagesTotal
            }, {
                where: {
                    name: "pagesTotal"
                }
            });
        }).catch(function (error) {
            utils.handleJson({
                response: res,
                error: error
            })
        })
    },
    summaryComment: function (req, res, next) {
        co(function* () {
            var commentResult = yield Comment.findAndCountAll({});
            var commentsTotal = commentResult.count;

            yield DataSummary.update({
                value: commentsTotal
            }, {
                where: {
                    name: "commentsTotal"
                }
            })
        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },
    createDataSummaryCategory: function (req, res, next) {
        co(function* () {
            var categoryResult = yield Category.findAll({});
            var dataSummaryResult = yield DataSummary.findAll({
                where: {
                    type: 1
                }
            });
            // 对比类别表查看有没有已经删除的类别还在dataSummary表内
            dataSummaryCount = dataSummaryResult.filter(item => {
                let titleList = categoryResult.map(v => v.dataValues.title)
                return !titleList.includes(item.dataValues.name)
            });

            //对比类别表查看有无新增的类别数据
            categoryCount = categoryResult.filter(item => {
                let nameList = dataSummaryResult.map(v => v.dataValues.name)
                return !nameList.includes(item.dataValues.title)
            });

            // 根据现有的类别删除数据
            if (dataSummaryCount.length > 0) {
                for (let i = 0; i < dataSummaryCount.length; i++) {
                    yield DataSummary.destroy({
                        where: {
                            uuid: dataSummaryCount[i].dataValues.uuid
                        }
                    })
                }
            }
            //根据新增的类别添加数据
            let listDataSummary = [];
            if (categoryCount.length > 0) {

                for (let i = 0; i < categoryCount.length; i++) {
                    let result = yield Category.findAll({
                        include: {
                            model: Article,
                            where: {
                                state: {
                                    [Op.or]: [1, 2],
                                }
                            }
                        },
                        where: {
                            title: categoryCount[i].dataValues.title
                        }
                    });
                    listDataSummary.push({
                        name: result[0].dataValues.title,
                        value: result[0].dataValues.articles.length,
                        type: 1
                    })
                }

                // 批量创建
                yield DataSummary.bulkCreate(listDataSummary);
            }

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },
    updateDataSummaryCategory: function (req, res, next) {
        co(function* () {
            var categoryList = yield Category.findAll({
                attributes: ['title']
            });

            for (let i = 0; i < categoryList.length; i++) {
                let result = yield Category.findAll({
                    include: {
                        model: Article,
                        where: {
                            state: {
                                [Op.or]: [1, 2],
                            }
                        },
                        attributes: ['title']
                    },
                    where: {
                        title: categoryList[i].dataValues.title
                    }
                });
                yield DataSummary.update({
                    value: result[0].dataValues.articles.length
                }, {
                    where: {
                        name: result[0].dataValues.title
                    }
                });
            }

        }).catch(function (error) {
            utils.handleError({
                response: res,
                error: error
            })
        })
    },
    updateDataSummary: function (req, res, next) {
        this.summaryCategory(req, res, next);
        this.summaryAricle(req, res, next);
        this.summaryComment(req, res, next);
        this.createDataSummaryCategory(req, res, next);
        this.updateDataSummaryCategory(req, res, next);
        this.summaryPage(req, res, next);
    }
}