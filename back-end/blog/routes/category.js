/**
 * 文章分类router
 */

var express = require('express');
var router = express.Router();
var CategoryDao = require('../controllers/category');
var checkToken = require('../middlewares/check').checkToken; //检查token的中间件
var checkAdminToken = require('../middlewares/check').checkAdminToken; //检验管
/**
 * /info
 * 获取当前分类
 * get
 */
router.get("/info", function (req, res, next) {
    CategoryDao.categoryInfo(req, res, next);
});

/**
 * /create
 * 创建分类
 * post
 */
router.post("/create", function (req, res, next) {
    CategoryDao.categoryCreate(req, res, next);
});

/**
 * /del
 * 删除分类
 * get
 */
router.get("/del", checkAdminToken,function (req, res, next) {
    CategoryDao.categoryDelete(req, res, next);
});

/**
 * /update
 * 更新分类
 * put
 */
router.put("/update", function (req, res, next) {
    CategoryDao.categoryUpdate(req, res, next);
});

/**
 * /list
 * 全部分类
 * get
 */
router.get("/list", function (req, res, next) {
    CategoryDao.categoryList(req, res, next);
}); 

//
router.get("/categoryArticleList", function (req, res, next) {
    CategoryDao.categoryArticleList(req, res, next);
});


/**
 获取用户评论信息
 */
router.get("/userCategoryList", async function (req, res, next) {
    var userUuid = (req.query || req.query || req.params).userUuid
    var token = req.headers.accesstoken;

    try {
        const result = await verifyAdminToken(token, userUuid)
        if (result == 'ok') {
            CategoryDao.categoryList(req, res, next)
        } else {
            CategoryDao.userCategoryList(req, res, next)
        }
    } catch (error) {
        CategoryDao.userCategoryList(req, res, next)
    }
});


module.exports = router;