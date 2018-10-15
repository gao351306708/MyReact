/**
 * Created by gaoju on 2018/6/26.
 */

var helper = require('../routes/helper'),
    con = require('./config.db');

/*用户模块 构造方法*/
var Teacher = function(param) {
    this.props = param.props
};

/*获取教师的信息*/
Teacher.prototype.getTeacherInfo = function(callback) {
    var _sql = `select username,userid from tblTeacher where username='${this.props.name}' and pwd='${this.props.password}'`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getTeacherInfo',
        callback: callback
    })
}
Teacher.prototype.getTeacherUserInfo = function(callback){
    var _sql = `select * from tblTeacher where username='${this.props.username}';`
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getTeacherUserInfo',
        callback: callback
    })
}
/*注册用户*/
Teacher.prototype.addUser = function(callback) {
    var _sql = `INSERT INTO tblTeacher(username,pwd) VALUES ('${this.props.username}','${this.props.password}');`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'addUser',
        callback: callback
    })
}
Teacher.prototype.getAllPaperOfStudent = function (callback) {
    var _sql = `select * from tblStudentExamInfo where userid='${this.props.id}' order by ExamType,FinishDate DESC`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getAllPaperOfStudent',
        callback: callback
    })
}
/*获取用户试卷做题数据*/
Teacher.prototype.getDataOfPaper = function (callback) {
    var _sql = `select * from tblStudentExamInfo where ExamInfoID='${this.props.id}';`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getDataOfPaper',
        callback: callback
    })
}
/*更新试卷批改信息*/
Teacher.prototype.updateMarkExamInfo = function (callback) {
    var _sql = `update tblStudentExamInfo set
                    ExamResult='${this.props.ExamResult}',
                    Score='${this.props.Score}',
                    markFlag='${this.props.markFlag}',
                    marker='${this.props.marker}' where ExamInfoID='${this.props.ExamInfoID}'`
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'updateMarkExamInfo',
        callback: callback
    })
};
Teacher.prototype.updateMarkQuestionInfo = function (callback) {
    var _sql = `UPDATE tblStudentExamQuestionInfo SET markFlag='1', marker = '${this.props.marker}', ${this.props.setList} `;
    console.log("updateMarkQuestionInfo====>>>",_sql)
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'updateMarkQuestionInfo',
        callback: callback
    })
}
module.exports = Teacher