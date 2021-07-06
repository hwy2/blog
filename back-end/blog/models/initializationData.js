var md5 = require('blueimp-md5'); //md5加密

module.exports = {
    init: async function (User, UserInfo, Category, AdminUser) {
        // 初始化添加数据
        console.log('数据初始化')
        var user = await User.create({
            email: "admin@admin.com",
            password: md5("123456")
        });
        UserInfo.create({
            userUuid: user.dataValues.uuid,
            nickName: '卖酱油的大灰狼',
            birth: "1997-01-01",
            sex: 1,
            face: '',
            city: '广州',
            address: '番禺'
        });
        Category.bulkCreate([{
            title: "未定义"
        }, {
            title: "nodejs"
        }, {
            title: "html"
        }]);
        AdminUser.create({
            userName: "admin@admin.com",
            password: md5("123456"),
            role: "1"
        })
    }
}