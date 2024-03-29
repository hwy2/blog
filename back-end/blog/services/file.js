/**
 * 文件服务
 */
var fs = require('fs');
var path = require('path'); //路径
var uuid = require('node-uuid'); //uuid
var Promise = require("bluebird");
var multer = require('multer'); //文件上传
var config = require('../config/default'); //配置文件

module.exports = {
    /**
     * 获取年月
     */
    getYearMonth: function () {
        var fdate = new Date();
        return fdate.getFullYear() + '' + (fdate.getMonth() + 1) + '' + fdate.getDate();
    },
    /**
     * 连接文件存放路径
     * type文件对应类型 比如文章对应article
     * filename 文件名含后缀名
     */
    createFilePath: function (pathType, filename) {
        var that = this;
        var fpath = path.join(__dirname, '../public/attchments', (pathType || 'default'), that.getYearMonth());
        if (!fs.existsSync(fpath)) {
            fs.mkdirSync(fpath);
        }
        if (filename) {
            return fpath + '/' + filename;
        } else {
            return fpath;
        }
    },
    /**
     * 处理文件上传
     */
    setFileUpload: function (opts) {
        var that = this;
        var storage = multer.diskStorage({
            //设置上传后文件路径，uploads文件夹会自动创建。
            destination: function (req, file, cb) {
                cb(null, that.createFilePath(opts.pathType))
            },
            //给上传文件重命名，获取添加后缀名
            filename: function (req, file, cb) {
                var fileFormat = file.originalname.split(".");
                // cb(null, file.originalname + '_' + Math.ceil(Math.random()*9) + Date.now() + "." + fileFormat[fileFormat.length - 1]);
                cb(null, uuid() + "." + fileFormat[fileFormat.length - 1]);
            },
        });
        var upload = multer({
            limits: {
                fileSize: config.file.limit.fileSize[opts.pathType] || config.file.limit.fileSize.default, //允许最大
            },
            storage: storage,
        });

        return upload;
    },
    /**
     * 读取文件
     */
    readFileAsync: function (fpath, encoding) {
        return new Promise(function (resolve, reject) {
            fs.readFile(fpath, encoding || 'utf-8', function (err, content) {
                if (err) {
                    reject(err)
                } else {
                    resolve(content)
                }
            });
        });
    },
    /**
     * 写入文件
     */
    writeFileAsync: function (fpath, content) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(fpath, content, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve();
                }
            });
        });
    },
    /**
     * 获取文件存放路径
     */
    getFilePath: function (pathType, filename) {
        return config.fileAbsolute[pathType] + this.getYearMonth() + '/' + filename;
    },
    /**
     * 获取文件后缀名
     */
    getFileSuffix: function (fileName) {
        if (!fileName) {
            return '';
        } else {
            var result = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
            return result.toLowerCase();
        }
    },
    /**
     * 获取年月日
     */
    getYearMonth: function () {
        var fdate = new Date();
        return fdate.getFullYear() + '' + (fdate.getMonth() + 1) + '' + fdate.getDate();
    },
    /**
     * 处理文件类型
     * 例如：fileType:'image/jpeg'
     * 'image/gif,image/jpg,image/jpeg,image/png,audio/mpeg,audio/x-wav,video/mpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.template,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain',
     */
    handlerFileType: function (fileType) {
        var result = null;
        if (!fileType) {
            return result;
        }
        //1图片、2视频、3音频、4文档（doc、ppt、xls）、5文件...
        if (fileType.indexOf('image') > -1) {
            result = 1;
        } else if (fileType.indexOf('video') > -1) {
            result = 2;
        } else if (fileType.indexOf('audio') > -1) {
            result = 3;
        } else if (fileType.indexOf('application') > -1) {
            result = 4;
        } else {
            result = 5;
        }
        return result;
    },
    /**
     * 获取文件名称
     * @returns 
     */
    getFileName: function () {
        let components = [];
        var fpath = path.join(__dirname, '../public/attchments/wallpaper/')
        const files = fs.readdirSync(fpath);
        files.forEach(function (item, index) {
            let stat = fs.lstatSync(fpath + item)
            if (stat.isDirectory() !== true) {
                components.push(item)
            }
        })
        return components;
    },
    /**
     * 删除对应地址的文件
     * @param {*} url 
     */
    delFile: function (url, relativeUrl) {
        let newUrl = path.join(__dirname, '..', '/public', url)
        // console.log('newUrl',newUrl)
        var reg = new RegExp(relativeUrl, "g")
        var folderPath = newUrl.replace(reg, '')
        // console.log('folderPath',folderPath)
        fs.unlink(newUrl, (err) => {
            if (err) {
                console.error(err)
                return false
            }
            if (this.isDirectoryEmptySync(folderPath)) {
                this.deleteFolder(folderPath)
            }
            return true
        })


    },
    /**
     * 判断文件夹是否为空
     * @param {*} path 
     * @returns 
     */
    isDirectoryEmptySync: function (path) {
        const files = fs.readdirSync(path);
        return files.length === 0;
    },
    /** 删除文件夹 */
    deleteFolder: function (folderPath) {
        try {
            if (fs.existsSync(folderPath)) {
                fs.readdirSync(folderPath).forEach((file) => {
                    const currentPath = folderPath + '/' + file;
                    if (fs.statSync(currentPath).isDirectory()) {
                        // 递归删除子文件夹
                        deleteFolder(currentPath);
                    } else {
                        // 删除文件
                        fs.unlinkSync(currentPath);
                    }
                });
                fs.rmdirSync(folderPath);
                console.log('文件夹删除成功！');
            } else {
                console.log('文件夹不存在！');
            }
        } catch (err) {
            console.error('删除文件夹出错：', err);
        }
    }
};