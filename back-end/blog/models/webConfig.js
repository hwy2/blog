/**
 * webConfig网站配置表
 */

var Sequelize = require('sequelize'); //引入sequelize
var Mysql = require('./mysql'); //引入sequelize

var WebConfig = Mysql.define('webConfig', {
    uuid: { //使用uuid 而不使用
        type: Sequelize.UUID, //设置类型
        allowNull: false, //是否允许为空
        primaryKey: true, //主键
        defaultValue: Sequelize.UUIDV1, //默认值
    }, //uuid
    siteName: {//站点名称   
        type: Sequelize.STRING,
        allowNull:false
    },
    siteAddress: {//站点地址
        type: Sequelize.STRING,
        allowNull: false
    },
    authorName: Sequelize.STRING,//网站作者
    runningTime: Sequelize.DATEONLY,//建站时间
    siteDescription: Sequelize.STRING,//站点描述
    keyWord: Sequelize.STRING,//关键词
    recordNumber: Sequelize.STRING,//工信部备案号
    internetAlert: Sequelize.STRING,//网警备案号
    isOpenCoverImage:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:0
    },//是否开启封面图
    isOpenCommentaries: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },//是否开启封面图
}, {
    freezeTableName: true, //开启自定义表名
    tableName: 'WebConfig', //表名字
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    createdAt: 'createDate', // 将createdAt字段改个名
    updatedAt: 'updateDate', // 将updatedAt字段改个名
    indexes: [{ // 索引
        type: 'UNIQUE', //UNIQUE、 FULLTEXT 或 SPATIAL之一
        method: 'BTREE', //BTREE 或 HASH
        unique: true, //唯一 //设置索引是否唯一，设置后会自动触发UNIQUE设置//true:索引列的所有值都只能出现一次，即必须唯一
        fields: ['uuid'], //建立索引的字段数组。每个字段可以是一个字段名，sequelize 对象 (如 sequelize.fn)，或一个包含：attribute (字段名)、length (创建前缀字符数)、order (列排序方向)、collate (较验的字段集合 (排序))
    }],
    comment: "WebConfig Table", //数据库表描述
})

module.exports = WebConfig;