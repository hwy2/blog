/**
 * AdminUser 表
 */
var Sequelize = require('sequelize');
var Mysql = require('./mysql');

// console.log("AdminUser用户表");

//定义AdminUser管理员表
var adminUser = Mysql.define("adminUser", {
    uuid: { //使用uuid 而不使用
        type: Sequelize.UUID, //设置类型
        allowNull: false, //是否允许为空
        primaryKey: true, //主键
        defaultValue: Sequelize.UUIDV1, //默认值
    }, //uuid
    userName:{//管理员账号
        type:Sequelize.STRING,
        allowNull:false,
        unique: true, //唯一
    },
    password:{//管理员密码
        type:Sequelize.STRING,
        allowNull:false
    },
    role:{//1超级管理员，2普通管理员
        type:Sequelize.STRING(2),
        defaultValue:'1'
    }
}, {
    freezeTableName: true, //开启自定义表名
    tableName: 'AdminUser', //表名字
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    createdAt: 'createDate', // 将createdAt字段改个名
    updatedAt: 'updateDate', // 将updatedAt字段改个名
    indexes: [{ // 索引
        type: 'UNIQUE', 
        method: 'BTREE', 
        unique: true, 
        fields: ['uuid'],
    }],
    comment: "AdminUser Table", //数据库表描述
})

module.exports = adminUser;