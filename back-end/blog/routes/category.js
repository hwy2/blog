/**
 * 文章分类router
 */

var express = require('express');
var router = express.Router();
var CategoryDao = require('../controllers/category');

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
router.get("/del", function (req, res, next) {
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


module.exports = router;