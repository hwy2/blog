var path = require('path'); //路径

var configs = {
    env: "dev", //当前环境
    mysql: { //mysql数据库
        host: '127.0.0.1',
        user: 'root', //数据库用户名
        password: '', //数据库密码
        database: 'blog', //数据库名
        port: 3306, //端口
    },
    cors: { //跨域请求
        origin: ['http://localhost:8080', 'http://localhost:5001'],
    },
    pwd: { //密码
        salt: 10, //密码强度
    },
    token: { //token https://github.com/auth0/node-jsonwebtoken
        secretOrPrivateKey: 'iboomer', // 秘钥
    },
    email: { //默认邮箱
        service: "xxxx@qq.com",
        spassword: "xxxx",
        admin: "xxxx@qq.com",
    },
    page: { //默认分页
        currPage: 1,
        pageSize: 10,
    },
    file: { //文件配置
        path: { //路径
            upload: { //上传路径
                default: path.join(__dirname, '../public/attchments/default/'), //默认
                face: path.join(__dirname, '../public/attchments/face/'), //头像
            },
        },
        limit: { //限制
            fileSize: { //单个文件最大
                default: 10 * 1024 * 1024, //10MB
                face: 5 * 1024 * 1024, //5MB
            },
            maxCount: {
                default: 9,
                face: 1,
            },
        },
    },
    filePrefix: "http://localhost:3000/attchments/", //文件前缀
    fileAbsolute: { //文件绝对路径
        default: 'http://localhost:3000/attchments/default/',
        face: 'http://localhost:3000/attchments/face/',
        wallpaper: 'http://localhost:3000/attchments/wallpaper/'
    },
    weather: {
        key: "xxxx",
        citycode: '440113' //番禺区
    },
    isFirstTimeInstall: false, //第一次运行之后请确保是false，否则会重建数据库
};

module.exports = configs;
