var express = require('express');
var router = express.Router();
var checkAdminToken = require('../middlewares/check').checkAdminToken; //检验管理员token
var webConfigDao = require('../controllers/webConfig');


/**
 * 创建
 */
router.post("/create", checkAdminToken, function (req, res, next) {
    webConfigDao.createWebConfig(req, res, next);
});

/**
 * 修改配置
 */
router.put("/update", checkAdminToken, function (req, res, next) {
    webConfigDao.updateWebConfig(req, res, next);
});


/**
 * 查询
 */
router.get("/info", function (req, res, next) {
    webConfigDao.infoWebConfig(req, res, next)
});


module.exports = router;