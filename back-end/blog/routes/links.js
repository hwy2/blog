var express = require('express');
var router = express.Router();
var checkToken = require('../middlewares/check').checkToken;
var linksDao = require('../controllers/links'); //友链处理
/**
 * Create
 * 创建友链信息
 */
router.post("/create", checkToken, function (req, res, next) {
    linksDao.createLinks(req, res, next,false);
});

/**
 * apply
 * 创建友链信息
 */
router.post("/apply", function (req, res, next) {
    linksDao.createLinks(req, res, next,true);
});

/**
 * info
 * 查询友链信息
 */
router.get('/info', function (req, res, next) {
    linksDao.readLinks(req, res, next);
});

/**
 * list
 * 查询全部友链信息
 */
router.get('/list', function (req, res, next) {
    linksDao.readLinksList(req, res, next);
});


/**
 * update
 * 更新信息
 */
router.put('/upinfo', checkToken, function (req, res, next) {
    linksDao.updateLinks(req, res, next);
});

/**
 * delete
 * 删除友链
 */
router.get("/del", checkToken, function (req, res, next) {
    linksDao.deleteLinks(req, res, next);
})


module.exports = router;