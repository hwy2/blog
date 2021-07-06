/**
 * article
 * 文章router
 */

var express = require('express');
var router = express.Router();

var articleDao = require('../controllers/article');

router.get("/info", function (req, res, next) {
    articleDao.getArticleInfo(req, res, next);
})

router.get("/list", function (req, res, next) {
    articleDao.getArticleList(req, res, next);
});

router.post("/create", function (req, res, next) {
    articleDao.createArticle(req, res, next);
})

router.put("/update", function (req, res, next) {
    articleDao.updateArticle(req, res, next);
})

router.get("/del", function (req, res, next) {
    articleDao.deleteArticle(req, res, next);
})


module.exports = router;