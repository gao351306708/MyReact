/**
 * 查询用户信息基本信息
 * Created by gaoju on 2017/11/15.
 */


var helper = require('../routes/helper'),
    con = require('./config.db');

/*用户模块 构造方法*/
var User = function(user) {
    this.props = user.props
};

/*获取全部数据,正式上线时请关闭*/
User.prototype.getUserAllItems = function(callback) {
    var _sql = "select * from tblUser where rank=0";
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getUserAllItems',
        callback: callback
    })
}
/*获取当前最新的用户id*/
User.prototype.getMaxUserId = function(callback) {
    var _sql = "select userid from tblUser where id>0  ORDER BY userid DESC LIMIT 0,1";
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getMaxUserId',
        callback: callback
    })
}
/*根据用户名和密码匹配否正确*/
User.prototype.getUserItemByUserName = function(callback) {
    var _sql = `select username,userid,headimg from tblUser where username='${this.props.name}' and pwd='${this.props.password}'`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getUserItemByUserName',
        callback: callback
    })
}
/*根据用户手机号和密码匹配否正确*/
User.prototype.getUserItemByPhone = function(callback) {
    var _sql = `select * from tblUser where phone='${this.props.phone}' and pwd='${this.props.password}'`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getUserItemByPhone',
        callback: callback
    })
}
/*通过用户名和手机号查找用户*/
User.prototype.getUserWithNameAndPwd = function (callback) {
    var _sql = `select id from tblUser where username='${this.props.username}' and phone='${this.props.phone}';`
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getUserWithNameAndPwd',
        callback: callback
    })
}
/*修改用户登录密码*/
User.prototype.putUserPassword = function(callback) {
    var _sql = `update tblUser set pwd = '${this.props.new_password}' where id = ${this.props.id}`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'putUserPassword',
        callback: callback
    })
}
/*注册用户*/
User.prototype.addUser = function(callback) {
    var _sql = `INSERT INTO tblUser(userid,username,pwd,phone) VALUES ('${this.props.idiilumber}','${this.props.username}','${this.props.password}','${this.props.phone}');`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'addUser',
        callback: callback
    })
}
User.prototype.getUserBasicInfo = function (callback) {
    var _sql = `select * from tblUser where username='${this.props.username}';`
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getUserBasicInfo',
        callback: callback
    })
}
User.prototype.UpdateBasicInfo = function (callback) {
    var _sql = `update tblUser set
                    phone='${this.props.phone}',
                    actualname='${this.props.actualname}',
                    username='${this.props.username}',
                    sex='${this.props.sex}',
                    school='${this.props.school}',
                    grade='${this.props.grade}',
                    familyaddress='${this.props.familyaddress}',
                    birthday='${this.props.birthday}',
                    email='${this.props.email}' WHERE userid='${this.props.userid}'`
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'UpdateBasicInfo',
        callback: callback
    })
}
User.prototype.UpdateHeadImg = function (callback) {
    var _sql = `update tblUser set headimg='${this.props.head}' WHERE userid='${this.props.userid}'`
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'UpdateHeadImg',
        callback: callback
    })
}
User.prototype.getUserInfo = function(callback){
    var _sql = `select * from tblUser where username='${this.props.username}';`
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getUserBasicInfo',
        callback: callback
    })
}
/*获取用户收藏试题*/
User.prototype.getCollection = function (callback) {
    var _sql = `select * from tblStudentCollectInfo where userid='${this.props.userid}'`;
    helper.db_query({
        connect:con,
        sql:_sql,
        name:'getCollection',
        callback:callback
    })
}

module.exports = User