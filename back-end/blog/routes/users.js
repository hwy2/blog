/**
 * @api {post} api/user 注册功能
 * @apiDescription 注册功能
 * @apiGroup user
 * @apiParam { string } username 账号
 * @apiParam { string } tel 手机号
 * @apiParam { string } password 密码
 * @apiSuccessExample { json } Success-Response:
 * {
 *  code: '10400',
 *  message: '请完善表单信息'
 * }
 * {
 *  code: '10666',
 *  message: '注册成功'
 * }
 * {
 *  code: '10606',
 *  message: '该用户已注册'
 * }
 * @apiSampleRequest /api/user
 * @apiVersion 1.0.0
 */



var express = require('express');
var router = express.Router();

var userDao = require('../controllers/user');
var checkToken = require('../middlewares/check').checkToken; //检查token的中间件
var checkAdminToken = require('../middlewares/check').checkAdminToken; //检验管理员token

/**
 * 注册 post
 */
router.post('/reg', function (req, res, next) {
    userDao.reg(req, res, next);
});

/**
 * 检测邮箱是否注册
 */
router.get('/checkEmail', function (req, res, next) {
    userDao.checkEmail(req, res, next);
});


/**
 * 登录
 */
router.post('/login', function (req, res, next) {
    userDao.login(req, res, next);
});
/**
 * 退出
 */
router.get('/logout', checkToken, function (req, res, next) {
    userDao.logout(req, res, next);
});
/**
 * 更新token 防止token过期
 */
router.put('/token', function (req, res, next) {
    userDao.updateAccessToken(req, res, next);
});
/**
 * 更新adminToken 防止token过期
 */
router.put('/adminToken', function (req, res, next) {
    userDao.updateAccessToken(req, res, next,true);
});
/**
 * 查询全部用户 支持 高级搜索、分页
 */
router.get('/list', checkAdminToken, function (req, res, next) {
    userDao.getUserList(req, res, next);
});
/**
 * 查询用户 byuuid
 */
router.get('/info', checkToken, function (req, res, next) {
    userDao.getUserInfo(req, res, next);
});

/**
 * 更新用户信息
 */
router.put('/upInfo', checkToken, function (req, res, next) {
    userDao.updateUserInfo(req, res, next);
});

/**
 * 修改密码
 */
router.put("/pwd", checkToken, function (req, res, next) {
    userDao.updateUserPwd(req, res, next);
})

/**
 * 删除账号
 */
router.get("/del", checkAdminToken, function (req, res, next) {
    userDao.deleteUser(req, res, next);
})


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;