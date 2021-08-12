/**
 * Article 文章表
 * @type {[type]}
 */
var Sequelize = require('sequelize');
var Mysql = require('./mysql');

// console.log("Article文章表")

var Article = Mysql.define('article', {
    uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1,
    }, //uuid
    title: { //标题
        type: Sequelize.STRING,
        allowNull: false,
    },
    photo: Sequelize.STRING, //头图
    content: { //文章内容
        type: Sequelize.TEXT,
        allowNull: false,
    },
    state: { //文章状态 （0已删除、1已发布）
        type: Sequelize.STRING(2),
        defaultValue: "1", //默认值
    },
    abstract: Sequelize.STRING,
    pageview: {
        type: Sequelize.INTEGER,
        defaultValue:0
    },
    ishot: { //是否热文
        type: Sequelize.BOOLEAN,
        defaultValue: false, //默认值
    },
}, {
    freezeTableName: true, // 自定义表名
    tableName: 'Article',
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    createdAt: 'createDate', // 将createdAt字段改个名
    updatedAt: 'updateDate', // 将updatedAt字段改个名
    indexes: [{ // 索引
        type: 'UNIQUE', //UNIQUE、 FULLTEXT 或 SPATIAL之一
        method: 'BTREE', //BTREE 或 HASH
        unique: true, //唯一 //设置索引是否唯一，设置后会自动触发UNIQUE设置//true:索引列的所有值都只能出现一次，即必须唯一
        fields: ['uuid'], //建立索引的字段数组。每个字段可以是一个字段名，sequelize 对象 (如 sequelize.fn)，或一个包含：attribute (字段名)、length (创建前缀字符数)、order (列排序方向)、collate (较验的字段集合 (排序))
    }],
    comment: "Article Table", //描述
});

module.exports = Article;