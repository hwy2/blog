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

router.get("/info", function (req, res, next) {
    articleDao.getArticleInfo(req, res, next);
})

router.get("/list", function (req, res, next) {
    articleDao.getArticleList(req, res, next);
});

router.post("/create",  function (req, res, next) {
    articleDao.createArticle(req, res, next);
})

router.put("/update", checkToken,function (req, res, next) {
    articleDao.updateArticle(req, res, next);
})

router.get("/del", function (req, res, next) {
    articleDao.deleteArticle(req, res, next);
})
router.get("/addPageViews", function (req, res, next) {
    articleDao.addeArticlePageViews(req, res, next);
})
router.get('/testimonialsArticle', function (req, res, next) {
    articleDao.testimonialsArticlePageViews(req, res, next);
})
router.get('/hotArticle', function (req, res, next) {
    articleDao.hotArticle(req, res, next);
})
router.post('/setArticleState', checkToken, (req, res, next) => {
    articleDao.setArticleState(req, res, next)
})
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
router.post('/setSticky', checkToken, function (req, res, next) {
    articleDao.setSticky(req, res, next);
})

module.exports = router;