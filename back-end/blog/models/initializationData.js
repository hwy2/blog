var md5 = require('blueimp-md5'); //md5加密
var config = require('../config/default');
var fs = require('fs'); //fs文件流
module.exports = {
    init: async function (User, UserInfo, Category, WebConfig, DataSummary, Article, ArticleCategory, Comment, Links) {
        // 初始化添加数据
        console.log('数据初始化');
        let articleContent = "";
        fs.readFile("./public/images/content.txt", function (err, data) {
            if (err) {
                console.error(err);
                return;
            }
            articleContent = data.toString();
        })
        var user = await User.create({
            email: "admin@admin.com",
            password: md5("123456"),
            role: "1",
            name:'admin'
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
        var articleList = await Article.bulkCreate([{
                title: "hello world",
                photo: "http://localhost:3000/common/wallpaper",
                content: "这是自动程序插入的数据库的内容，看到这个，代表你已经成功启动blog!",
                state: 1,
                abstract: "hello world",
                pageview: 0,
                ishot: false,
                userUuid: user.dataValues.uuid
            },
            {
                title: "友情链接",
                photo: "http://localhost:3000/common/wallpaper",
                content: "",
                state: 4,
                abstract: "",
                pageview: 0,
                ishot: false,
                template: 2,
                pageOrder: 0,
                userUuid: user.dataValues.uuid
            }, {
                title: "归档文章",
                photo: "http://localhost:3000/common/wallpaper",
                content: "",
                state: 4,
                abstract: "",
                pageview: 0,
                ishot: false,
                template: 1,
                pageOrder: 1,
                userUuid: user.dataValues.uuid
            },
            {
                title: "隐私政策",
                photo: "http://localhost:3000/common/wallpaper",
                content: articleContent,
                state: 4,
                abstract: "隐私政策",
                pageview: 0,
                ishot: false,
                template: 0,
                pageOrder: 0,
                userUuid: user.dataValues.uuid
            }
        ])
        await Comment.create({
            ip: "127.0.0.1",
            agent: "",
            nickName: "bolg",
            email: "admin@admin.com",
            comments: "这是由系统生成的评论",
            status: 0,
            faceUrl: "https://gravatar.loli.net/avatar/",
            articleUuid: articleList[0].dataValues.uuid,
            parentUuid: ''
        });
        await ArticleCategory.bulkCreate([{
            categoryUuid: categoryList[0].dataValues.uuid,
            articleUuid: articleList[0].dataValues.uuid
        }, {
            categoryUuid: categoryList[0].dataValues.uuid,
            articleUuid: articleList[1].dataValues.uuid
        }, {
            categoryUuid: categoryList[0].dataValues.uuid,
            articleUuid: articleList[2].dataValues.uuid
        }, {
            categoryUuid: categoryList[0].dataValues.uuid,
            articleUuid: articleList[3].dataValues.uuid
        }])
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
                value: 3,
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
            }, {
                name: "javascript",
                value: 0,
                type: 1
            }

        ]);
        await Links.create({
            name: "黄文勇的技术站",
            URL: "https://www.3dcw.cn",
            sort: "个人博客",
            image: 'https://www.3dcw.cn/usr/themes/Castle/static/img/avatar.jpg',
            state:1,
            description: "黄文勇的技术交流站是，一个技术分享个人博客，博主不定时更新，记录博主的技术问题"
        })

        console.log("初始化完成");
    }
}