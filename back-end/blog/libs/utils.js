/**
 * 工具类
 */
var Promise = require("bluebird");
var config = require('config-lite'); //配置
var i18n = require('i18n'); //i18n
var underscore = require('underscore'); //js 工具函数
var md5 = require('blueimp-md5'); //md5加密
var config = require('../config/default'); //配置文件
var CryptoJS = require("crypto-js");
const IP2Region = require('ip2region').default;

let key = config.aes.key
key = CryptoJS.enc.Utf8.parse(key)
module.exports = {
    /**
     * 工具类
     * @type {[type]}
     */
    underscore: underscore,
    /**
     * 向前台返回JSON方法的简单封装
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    handleJson: function (opts) { //json
        //-1失败、200成功
        if (opts.result) {
            data = this.encryptedAES(opts.result)
            opts.response.json({
                code: "200",
                msg: opts.msg || i18n.__('doSuccess'),
                result: data
            });
        } else {
            opts.response.json({
                code: "-1",
                msg: opts.msg || i18n.__('doFail'),
                result: '',
            });
        }
    },
    /**
     * 处理错误error
     */
    handleError: function (opts) {
        var that = this;
        var error = opts.error || "error";
        // console.log(error);
        if (error == "break") {
            return;
        }
        //处理错误回执消息
        var failOptions = {
            response: opts.response,
            result: '',
        }
        if (typeof error === "string") {
            failOptions.msg = error;
        }
        //fail
        that.handleJson(failOptions);
    },
    /**
     * String 去头尾空格
     */
    trim: function (val) {
        if (val) {
            val = val + '';
            return val.replace(/(^\s+)|(\s+$)/g, '');
        } else {
            return "";
        }
    },
    /**
     * 处理查询参数
     * @param  {[type]} params [description]
     * @return {[type]}      [description]
     */
    handleCondition: function (params) {
        //组装查询条件
        var condition = {};
        for (var v in params) {
            if (v != 'currPage' && v != 'pageSize' && params[v]) {
                condition[v] = params[v];
            }
        }
        return condition;
    },
    /**
     * 处理当期页码
     * @param  {[type]} currPage [description]
     * @return {[type]}          [description]
     */
    handleCurrPage: function (currPage) {
        return +(currPage || config.page.currPage);
    },
    /**
     * 处理总页码
     * @param  {[type]} pageSize [description]
     * @return {[type]}          [description]
     */
    handlePageSize: function (pageSize) {
        return +(pageSize || config.page.pageSize);
    },
    /**
     * 处理分页
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    handlePage: function (opts) {
        return new Promise(function (resolve, reject) {
            var totalRow = opts.count || 0;
            var page = opts.page;
            var totalPage = Math.ceil(totalRow / page.pageSize);
            page.totalPage = totalPage;
            page.totalRow = totalRow;
            resolve(page);
        });
    },
    /**
     * 验证必填项
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    validateMandatory: function (params) {
        var that = this;
        //检验必传项是否存在遗漏
        var checkFlag = true;
        for (var v in params) {
            if (!that.trim(params[v])) {
                checkFlag = false;
            }
        }
        return checkFlag;
    },
    // 处理字符串数组
    handleArray: function (opt) {
        if (opt && opt.length) {
            if (opt.indexOf(",") != -1) {
                return opt.split(',')
            }
            return opt;
        }
        return "";
    },
    // 获取Gravatar图元
    getGravatarURL: function (email) {

        const address = String(email).trim().toLowerCase();
        const hash = md5(address);
        return `https://gravatar.loli.net/avatar/${hash}`;
    },
    // 加密
    encryptedAES: function (data) {
        const content = JSON.stringify(data);
        const encryptedContent = CryptoJS.AES.encrypt(content, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encryptedContent.ciphertext.toString();
    },
    // 解密
    declassificationAES: function (encryptedData) {
        const decryptedContent = CryptoJS.AES.decrypt(
            CryptoJS.format.Hex.parse(encryptedData),
            key,//注意：后面这里最好使用 CryptoJS.format.Utf8.parse(key) 
            {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }
        );
        return JSON.parse(CryptoJS.enc.Utf8.stringify(decryptedContent))
    },
    /**
     * 获取Ip定位
     * @param {*} ip 
     */
    getIP2Region: function (ip) {
        // 创建一个IP2Region实例
        const query = new IP2Region();
        const ipAddress = query.search(ip);
        // 打印查询结果
        console.log('>>> ipAddress: ', ipAddress);
        return ipAddress
    },
    /**
     * ipv6转ipv4
     * @param {*} ip 
     * @returns 
     */
    ipv6ToV4: function (ip) {
        if (ip.split(',').length > 0) {
            ip = ip.split(',')[0]
        }
        ip = ip.substr(ip.lastIndexOf(':') + 1, ip.length);
        return ip
    },
    getClientIp: function (req) {
        return req.headers['x-forwarded-for'] ||
            req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress ||
            '';
    },
};