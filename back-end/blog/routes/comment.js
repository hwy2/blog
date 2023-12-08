var express = require('express');
var router = express.Router();
var commentDao = require('../controllers/comment');
const utils = require('../libs/utils');
var checkToken = require('../middlewares/check').checkToken; //检查token的中间件
var checkAdminToken = require('../middlewares/check').checkAdminToken; //检验管
var verifyAdminToken = require('../services/token').verifyAdminToken;//验证管理员
/**
 * 创建评论
 */
router.post("/create", function (req, res, next) {
    let ip = utils.getClientIp(req)
    console.log(ip)
    let vestingPlace = utils.getIP2Region(ip)
    req.body.ip = ip
    req.body.vestingPlace = vestingPlace.country+vestingPlace.province+vestingPlace.city
    commentDao.createComment(req, res, next);
});
router.post("/recover", function (req, res, next) {
    let ip = utils.getClientIp(req)
    console.log(ip)
    let vestingPlace = utils.getIP2Region(ip)
    req.body.ip = ip
    req.body.vestingPlace = vestingPlace.country + vestingPlace.province + vestingPlace.city
    commentDao.recoverComment(req, res, next);
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

/**
 获取用户评论信息
 */
router.get("/userCommentList", async function (req, res, next) {
    var userUuid = (req.query || req.query || req.params).userUuid
    var token = req.headers.accesstoken;

    try {
        const result = await verifyAdminToken(token, userUuid)
        if (result == 'ok') {
            commentDao.getCommentList(req, res, next)
        }else{
            commentDao.getUserCommentList(req, res, next)
        }
    } catch (error) {
        commentDao.getUserCommentList(req, res, next)
    }
});

/**
 * 修改评论的状态
 */
router.post('/updateCommentStatus', function (req, res, next){
    commentDao.updateCommentStatus(req, res, next)
})



module.exports = router;