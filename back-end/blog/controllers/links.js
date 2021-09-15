var i18n = require("i18n");
var co = require("co");
var utils = require("../libs/utils");
var Links = require('../models/index').Links;
var config = require('../config/default');

module.exports = {
    /**
     * 创建友链信息
     */
    createLinks: function (req, res, next) {
        var params = req.body || req.params;
        var links = {
            name: utils.trim(params.name),
            URL: utils.trim(params.URL),
            sort: utils.trim(params.sort),
            image: utils.trim(params.image) || config.fileAbsolute.face + "nopic.jpg",
            description: utils.trim(params.description),
        };
        if (!links.name || !links.URL) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassParamsComplete')
            });
            return;
        }
        co(function* () {
            var LinksResult = yield Links.create(links);
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
            })
        })
    },

    /**
     * 查询友链信息
     */
    readLinks: function (req, res, next) {
        var params = req.query || req.params;
        var linksUuid = utils.trim(params.linksUuid);
        if (linksUuid) {
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
        // 分页
        var page = {
            currPage: parseInt(utils.trim(params.currPage)) || config.page.currPage, //获取当前页
            pageSize: parseInt(utils.trim(params.pageSize)) || config.page.pageSize //每页数量
        }
        co(function* () {
            var LinksResult = yield Links.findAll();

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
        var links = utils.trim(params.links);
        if (!links.uuid || !links.name || !links.URL) {
            utils.handleJson({
                response: res,
                msg: i18n.__('pleasePassParamsComplete')
            });
            return;
        }
        if (!links.image) {
            links.image = config.fileAbsolute.face + "nopic.jpg";
        }
        co(function* () {
            var LinksFindOne = yield Links.findOne({
                where: {
                    uuid: links.uuid
                }
            });
            if (!LinksFindOne) {
                utils.handleJson({
                    response: res,
                    msg: i18n__('noInformationFound')
                });
                return;
            }

            var LinksResult = yield Links.update(links, {
                where: {
                    uuid: links.uuid
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
    }
}