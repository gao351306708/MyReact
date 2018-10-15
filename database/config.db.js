/**
 * 数据库连接基本信息设置，使用连接池来达到资源复用
 * Created by gaoju on 2017/11/15.
 */
var mysql = require('mysql')
var config = {
    host: '192.168.11.231',
    port: 3306,
    user: 'root',
    password: 'IDIILCenter',
    database: 'zhongkaodb'
};
var pool = mysql.createPool(config)//建立连接池

console.log("mysql is createPool Connection !!!")
module.exports = pool;
