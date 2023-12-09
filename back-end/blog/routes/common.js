/**
 * commonAPI router
 */
var express = require('express');
var router = express.Router();
var commonDao = require('../controllers/common');
var fileService = require('../services/file'); //文件服务
/**
 * 上传附件
 * 支持单/多文件上传
 * file 为接受name参数名字
 */
router.post('/enclosure', fileService.setFileUpload({
    pathType: "default", //上传对应文件夹 默认
}).array('files', 5), function (req, res, next) {
    commonDao.uploadEnclosure(req, res, next);
});

/**
 * 返回一个随机的图片URL
 */
router.get('/wallpaper', function (req, res, next) {
    commonDao.returnRandomPictures(req, res, next);
})

/**
 * 获取全部附件信息
 */
router.get("/userList", async function (req, res, next) {
    var userUuid = (req.query || req.query || req.params).userUuid
    var token = req.headers.accesstoken;

    try {
        const result = await verifyAdminToken(token, userUuid)
        if (result == 'ok') {
            commonDao.getFileList(req, res, next)
        } else {
            commonDao.getUserFileList(req, res, next)
        }
    } catch (error) {
        commonDao.getUserFileList(req, res, next)
    }
})

module.exports = router;