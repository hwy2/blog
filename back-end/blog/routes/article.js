/**
 * article
 * 文章router
 */

var express = require('express');
var router = express.Router();
var checkToken = require('../middlewares/check').checkToken; //检查token的中间件
var checkAdminToken = require('../middlewares/check').checkAdminToken; //检验管理员token
var verifyAdminToken = require('../services/token').verifyAdminToken;//验证管理员

var articleDao = require('../controllers/article');
/**
 * 获取文章详情
 */
router.get("/info", function (req, res, next) {
    articleDao.getArticleInfo(req, res, next);
})

/**
 * 获取文章列表
 */
router.get("/list", function (req, res, next) {
    articleDao.getArticleList(req, res, next);
});

/**创建文章 */
router.post("/create",  function (req, res, next) {
    articleDao.createArticle(req, res, next);
})

/**更新文章 */
router.put("/update", checkToken,function (req, res, next) {
    articleDao.updateArticle(req, res, next);
})
/** 删除文章 */
router.get("/del", function (req, res, next) {
    articleDao.deleteArticle(req, res, next);
})
/** 添加文章浏览量 */
router.get("/addPageViews", function (req, res, next) {
    articleDao.addeArticlePageViews(req, res, next);
})
/** 获取推荐文章 */
router.get('/testimonialsArticle', function (req, res, next) {
    articleDao.testimonialsArticlePageViews(req, res, next);
})
/** 获取热文 */
router.get('/hotArticle', function (req, res, next) {
    articleDao.hotArticle(req, res, next);
})
/** 设置文章状态 */
router.post('/setArticleState', checkToken, (req, res, next) => {
    articleDao.setArticleState(req, res, next)
})
/** 获取用户文章 */
router.get('/userArticleList', checkToken, async (req, res, next) => {
    // verifyAdminToken
    var userUuid = (req.query || req.query || req.params).userUuid
    var token = req.headers.accesstoken;
    try {
        const result = await verifyAdminToken(token, userUuid)
        if (result == 'ok'){
            articleDao.getArticleList(req, res, next)
        }
    } catch (error) {
        articleDao.getUserArticleList(req, res, next)
    }
})
/** 设置文章置顶 */
router.post('/setSticky', checkToken, function (req, res, next) {
    articleDao.setSticky(req, res, next);
})
/** 设置文章推荐 */
router.post('/setIshotArticle', checkToken, function (req, res, next) {
    articleDao.setIshotArticle(req, res, next);
})

module.exports = router;