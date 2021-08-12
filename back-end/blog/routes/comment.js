var express = require('express');
var router = express.Router();
var commentDao = require('../controllers/comment');

/**
 * 创建评论
 */
router.post("/create", function (req, res, next) {
    commentDao.createComment(req, res, next);
});

/**
 * 修改评论
 */
router.put("/update", function (req, res, next) {
    commentDao.updateComment(req, res, next);
});


/**
 * 删除评论
 */
router.get("/del", function (req, res, next) {
    commentDao.deleteComment(req, res, next);
});

/**
 * 审核评论
 */
router.post("/approved", function (req, res, next) {
    commentDao.approvedComment(req, res, next);
});


/**
 * 评论列表
 */
router.get("/list", function (req, res, next) {
    commentDao.getCommentList(req, res, next);
});


module.exports = router;