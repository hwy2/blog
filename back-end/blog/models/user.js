/**
 * User 用户表
 */
var Sequelize = require('sequelize'); //引入sequelize
var Mysql = require('./mysql'); //引入mysql实例化
// console.log("User用户表");
//定义User用户表
var User = Mysql.define('user', {
    uuid: { //使用uuid 而不使用
        type: Sequelize.UUID, //设置类型
        allowNull: false, //是否允许为空
        primaryKey: true, //主键
        defaultValue: Sequelize.UUIDV1, //默认值
    }, //uuid
    name:{
        type:Sequelize.STRING,
        allowNull:false,
        defaultValue:'admin',
    },
    email: { //邮箱
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, //唯一
        validate: { //设置验证条件
            isEmail: true, // 检测邮箱格式 (foo@bar.com)
        },
    },
    password: { //密码
        type: Sequelize.STRING,
        allowNull: false,
    },
    state: { //状态 0未激活邮箱、1已激活邮箱
        type: Sequelize.STRING(2), //限制字符个数
        defaultValue: "0", //默认值
    },
    role: { //1管理员，2普通用户
        type: Sequelize.STRING(2),
        defaultValue: '2'
    },
    captcha:{
        type: Sequelize.STRING(8),
    }
}, {
    freezeTableName: true, //开启自定义表名
    tableName: 'User', //表名字
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    createdAt: 'createDate', // 将createdAt字段改个名
    updatedAt: 'updateDate', // 将updatedAt字段改个名
    indexes: [{ // 索引
        type: 'UNIQUE', //UNIQUE、 FULLTEXT 或 SPATIAL之一
        method: 'BTREE', //BTREE 或 HASH
        unique: true, //唯一 //设置索引是否唯一，设置后会自动触发UNIQUE设置//true:索引列的所有值都只能出现一次，即必须唯一
        fields: ['uuid'], //建立索引的字段数组。每个字段可以是一个字段名，sequelize 对象 (如 sequelize.fn)，或一个包含：attribute (字段名)、length (创建前缀字符数)、order (列排序方向)、collate (较验的字段集合 (排序))
    }],
    comment: "User Table", //数据库表描述
});
module.exports = User; //导出