var md5 = require('blueimp-md5'); //md5加密
var config = require('../config/default');
module.exports = {
    init: async function (User, UserInfo, Category, WebConfig, DataSummary, Article, ArticleCategory, Comment) {
        // 初始化添加数据
        console.log('数据初始化')
        var user = await User.create({
            email: "admin@admin.com",
            password: md5("123456"),
            role: "1"
        });
        await UserInfo.create({
            userUuid: user.dataValues.uuid,
            nickName: 'admin',
            birth: "1997-01-01",
            sex: 1,
            face: config.fileAbsolute.face + 'sidebar.jpg',
            city: '广州',
            address: '广州'
        });
        var categoryList = await Category.bulkCreate([{
            title: "默认"
        }, {
            title: "nodejs"
        }, {
            title: "html"
        }, {
            title: "javascript"
        }]);
        var article = await Article.create({
            title: "hello world",
            photo: "https://api.ohmyga.cn/wallpaper/?rand=645",
            content: "这是自动程序插入的数据库的内容，看到这个，代表你已经成功启动blog!",
            state: 1,
            abstract: "hello world",
            pageview:0,
            ishot: false,
            userUuid: user.dataValues.uuid
        })
        await Comment.create({
            ip: "127.0.0.1",
            agent: "",
            nickName: "bolg",
            email: "admin@admin.com",
            comments: "这是由系统生成的评论",
            status: 0,
            faceUrl: "https://gravatar.loli.net/avatar/",
            articleUuid: article.dataValues.uuid,
            parentUuid:''
        });
        await ArticleCategory.create({
            categoryUuid: categoryList[0].dataValues.uuid,
            articleUuid: article.dataValues.uuid
        })
        await WebConfig.create({
            siteName: "博客",
            siteAddress: "http://www.xxxx.com",
            siteDescription: "网站简介",
            authorName: "博客",
            keyWord: "站点关键词",
            recordNumber: "粤ICP备xxxxxx号",
            internetAlert: "粤公网安备 xxxxxxxxx号",
            runningTime: "2018-07-19"
        });
        await DataSummary.bulkCreate([{
                name: "articlesTotal",
                value: 1,
                type: 0
            },
            {
                name: "commentsTotal",
                value: 1,
                type: 0
            }, {
                name: "pagesTotal",
                value: 0,
                type: 0
            }, {
                name: "categoriesTotal",
                value: 4,
                type: 0
            }, {
                name: "默认",
                value: 1,
                type: 1
            }, {
                name: "nodejs",
                value: 0,
                type: 1
            }, {
                name: "html",
                value: 0,
                type: 1
            }

        ]);

        console.log("初始化完成");
    }
}