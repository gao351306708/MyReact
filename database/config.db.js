/**
 * 数据库连接基本信息设置，使用连接池来达到资源复用
 * Created by gaoju on 2017/11/15.
 */
var mysql = require('mysql')
var config = {
    host: '***.***.***.***',//数据库的地址
    port: '****',//端口号
    user: '****',//用户名
    password: '****',//密码
    database: '****'//数据库名称
};
var pool = mysql.createPool(config)//建立连接池，防止链接过多卡死

console.log("mysql is createPool Connection !!!")
module.exports = pool;
