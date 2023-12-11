/**
 * UserInfo 表
 */

var Sequelize = require('sequelize'); //引入sequelize
var Mysql = require('./mysql'); //引入sequelize
// console.log("UserInfo用户信息表");

//定义UserInfo用户表
var UserInfo = Mysql.define("userInfo", {
    uuid: { //使用uuid 而不使用
        type: Sequelize.UUID, //设置类型
        allowNull: false, //是否允许为空
        primaryKey: true, //主键
        defaultValue: Sequelize.UUIDV1, //默认值
    }, //uuid
    nickName: {
        type: Sequelize.STRING,
        allowNull: false
    }, //昵称
    birth: Sequelize.DATE, //出生日期
    sex: { //性别 1男 0女 
        type: Sequelize.STRING(2),
        defaultValue: "1"
    },
    face: Sequelize.STRING, //头像
    city: Sequelize.STRING, //所在城市
    address: Sequelize.STRING, //住址
    synopsis: { //简介
        type: Sequelize.STRING(256),
        defaultValue: "这个人很懒，没有留下任何信息！"
    },
}, {
    freezeTableName: true, //开启自定义表名
    tableName: 'UserInfo', //表名字
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    createdAt: 'createDate', // 将createdAt字段改个名
    updatedAt: 'updateDate', // 将updatedAt字段改个名
    indexes: [{ // 索引
        type: 'UNIQUE', //UNIQUE、 FULLTEXT 或 SPATIAL之一
        method: 'BTREE', //BTREE 或 HASH
        unique: true, //唯一 //设置索引是否唯一，设置后会自动触发UNIQUE设置//true:索引列的所有值都只能出现一次，即必须唯一
        fields: ['uuid'], //建立索引的字段数组。每个字段可以是一个字段名，sequelize 对象 (如 sequelize.fn)，或一个包含：attribute (字段名)、length (创建前缀字符数)、order (列排序方向)、collate (较验的字段集合 (排序))
    }],
    comment: "UserInfo Table", //数据库表描述
})

module.exports = UserInfo;