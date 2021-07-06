var express = require('express');
var router = express.Router();
var checkToken = require('../middlewares/check').checkToken;
var userInfoDao = require('../controllers/userInfo'); //
/**
 * Create
 * 创建用户信息
 */
router.post("/create", checkToken, function (req, res, next) {
    userInfoDao.createUserInfo(req, res, next);
});

/**
 * info
 * 查询用户信息
 */
router.get('/info', checkToken, function (req, res, next) {
    userInfoDao.readUserInfo(req, res, next);
});

/**
 * update
 * 更新信息
 */
router.put('/upinfo', function (req, res, next) {
    userInfoDao.updateUserInfo(req, res, next);
});

/**
 * delete
 * 删除用户
 */
router.get("/del",function(req,res,next){
    userInfoDao.deleteUserInfo(req, res, next);
})


module.exports = router;