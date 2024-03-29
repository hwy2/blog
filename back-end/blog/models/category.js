/**
 * category 表
 */

var Sequelize = require('sequelize');
var Mysql = require('./mysql');
// console.log("category文章类别表");

var category = Mysql.define('category', {
    uuid: { //使用uuid 而不使用id
        type: Sequelize.UUID, //设置类型
        allowNull: false, //是否允许为空
        primaryKey: true, //主键
        defaultValue: Sequelize.UUIDV1, //默认值
    }, //uuid
    title: {//类别名称
        type: Sequelize.STRING,
        allowNull: false
    },
    descriptions: {//描述
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true, //开启自定义表名
    tableName: 'Category', //表名字
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    createdAt: 'createDate', // 将createdAt字段改个名
    updatedAt: 'updateDate', // 将updatedAt字段改个名
    indexes: [{ // 索引
        type: 'UNIQUE', //UNIQUE、 FULLTEXT 或 SPATIAL之一
        method: 'BTREE', //BTREE 或 HASH
        unique: true, //唯一 //设置索引是否唯一，设置后会自动触发UNIQUE设置//true:索引列的所有值都只能出现一次，即必须唯一
        fields: ['uuid'], //建立索引的字段数组。每个字段可以是一个字段名，sequelize 对象 (如 sequelize.fn)，或一个包含：attribute (字段名)、length (创建前缀字符数)、order (列排序方向)、collate (较验的字段集合 (排序))
    }],
    comment: "Category Table", //数据库表描述
})

module.exports = category;