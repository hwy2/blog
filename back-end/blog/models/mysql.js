var config = require('config-lite');
var Sequelize = require('sequelize');

var Mysql = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
    host: config.mysql.host, //数据库主机ip
    dialect: "mysql", //使用mysql
    port: config.mysql.port,//端口
    operatorsAliases: 0, //去除Sequelize警告
    timezone: '+08:00', //东八时区
    pool: {//连接池
        max: 5,
        min: 0,
        idle: 10000
    }
})

module.exports = Mysql;