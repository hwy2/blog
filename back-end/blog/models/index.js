/**
 * 数据库表关系建立
 */
var Mysql = require('./mysql');
var config = require('../config/default');
var fs = require('fs'); //fs文件流
var Initialization = require('./initializationData'); //数据初始化
//表
// var AdminUser = require('./adminUser'); //管理员表
var User = require('./user'); //用户表
var UserInfo = require('./userInfo'); //用户信息表
var Article = require('./article'); //文章表
var Comment = require('./comment'); //评论表
var Category = require('./category'); //文章类别表
var ArticleCategory = require('./articleCategory'); //文章类别中间表
var Links = require('./links'); //数据汇总表
var Attachment = require('./attachment'); //附件表
var WebConfig = require('./webConfig'); //网站配置表
var DataSummary = require('./dataSummary'); //数据汇总表
/**
 * 关系建立
 */
//用户-用户资料
User.hasOne(UserInfo); //1:1

//用户-文章
User.hasMany(Article); //1:N
Article.belongsTo(User); //1:1

// 文章-评论
Article.hasMany(Comment); //1:N
Comment.belongsTo(Article); //1:1


//文章-分类
Category.belongsToMany(Article, {
    through: ArticleCategory
}); //N:N
Article.belongsToMany(Category, {
    through: ArticleCategory
}); //N:N


//config配置文件确定是否首次配置，
//首次创建表之后将isFirstTimeInstall字段修改为false
//确保该代码只执行一次，不会破坏数据
if (config.isFirstTimeInstall) {
    console.log("isFirstTimeInstall", config.isFirstTimeInstall);
    // 删除所有表及数据
    fs.readFile("./config/default.js", function (err, data) {
        if (err) {
            console.error(err);
            return;
        }
        // console.log("读取完成", data.toString());
        let dataString = data.toString().replace(/isFirstTimeInstall: true/, "isFirstTimeInstall: false");
        fs.writeFile("./config/default.js", dataString, function (error, result) {
            if (error) {
                console.error(err);
                return;
            }
            console.log("修改状态成功");
        })
    });
    //基于sequelize自动创建表,会清空数据，保险起见第一次运行之后注释掉
    // drop()与sync()对于数据库是破坏性的，所以保险起见第一次运行之后注释掉
    Mysql.sync({
        force: true, //是否清空数据库表
    }).then(async function () {
        console.log('创建数据表 ok！');
        Initialization.init(User, UserInfo, Category, WebConfig, DataSummary, Article, ArticleCategory, Comment, Links);
    }).catch(function (error) {
        console.log("error", error)
    });
}


module.exports = {
    User: User,
    Article: Article,
    Comment: Comment,
    Attachment: Attachment,
    UserInfo: UserInfo,
    Category: Category,
    ArticleCategory: ArticleCategory,
    WebConfig: WebConfig,
    DataSummary: DataSummary,
    Links: Links,
};