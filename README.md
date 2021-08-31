# blog
back-end 是由 nodejs +express框架 + mysql + Sequelize框架 构成
front-end 是vue3.0(vite) + typescript + element UI + axios + vuex +router 构成

# 首次运行时需要
1.安装mysql数据库

2.创建一个blog数据库

3.找到配置文件back-end\blog\config\default.js并修改相应的数据库连接数据

4.天气功能需要到高德地图中申请key

5.发邮件功能需要在QQ邮箱开启POP3/SMTP服务并修改配置文件中的email设置项

6.首次运行需要确保配置文件中的isFirstTimeInstall字段为true，运行之后确保为false（否则会刷新数据库，导致数据丢失）
