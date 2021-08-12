var express = require('express');
var router = express.Router();
var DataSummaryDao = require('../controllers/dataSummary');
// 获取数据汇总
router.get("/list", function (req, res, next) {
    DataSummaryDao.getDataSummaryList(req, res, next);
})

module.exports = router;