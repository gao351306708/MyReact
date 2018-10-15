/**
 * Created by gaoju on 2018/1/19.
 */

var helper = require('../routes/helper'),
    con = require('./config.db');

/*试题模块 构造方法*/
var Math = function(param) {
    this.props = param.props
};

/*查询全部练习试卷*/
Math.prototype.getAllPapersList = function(callback) {
    var _sql = "select * from tblExamPaper;";
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getAllPapersList',
        callback: callback
    })
}
Math.prototype.getAllQuestionOfThematic = function (callback) {
    var _sql = "select * from tblQuestion where isobjective!='材料' LIMIT 0,100";
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getAllQuestionOfThematic',
        callback: callback
    })
}
/*查询试卷的所有试题*/
Math.prototype.getQuestionsOfPaperList = function(callback) {
    var _sql = `select * from tblExamPaper2Question where examid='${this.props.id}' ORDER BY ordersn`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getQuestionsOfPaperList',
        callback: callback
    })
}
/*查询试题（可作为单独完整的试题用）*/
Math.prototype.getQuestionItems = function(callback){
    var _sql = `select * from tblQuestion where questionid='${this.props.id}'`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getQuestionItems',
        callback: callback
    })
}
/*查询试题,此处查询的是试题子试题的数据（不能说是一个完整的试题，即 观察，分析，考点部分的试题数据）*/
Math.prototype.getContentOfChildItems = function(callback){
    var _sql = `select itemid from tblQuestionPart2Item where partid='${this.props.id}' ORDER BY ordersn`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getContentOfChildItems',
        callback: callback
    })
}
Math.prototype.getContentOfChildItemsForQues = function(callback){
    var _sql = `select * from tblQuestionItem where itemid='${this.props.id}'`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getContentOfChildItemsForQues',
        callback: callback
    })
}
/*查询试题的子题（主题的问题1.2.。）*/
Math.prototype.getQuestionChild = function(callback){
    var _sql = `select * from tblQuestion where parentid='${this.props.id}' ORDER BY ordersn`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getQuestionChild',
        callback: callback
    })
}
/*查询试题的所有关联的子题（考点，扩展，分析。。。扩展、练习）*/
Math.prototype.getQuestionChildItems = function(callback){
    var _sql = `select t1.parttype,t2.itemid,t1.questionid from tblQuestion2Part t1,tblQuestionPart2Item t2 where t1.partid=t2.partid and t1.questionid='${this.props.id}' ORDER BY t2.ordersn`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getQuestionChildItems',
        callback: callback
    })
}
/*查询试题的小题的相关子题（考点，扩展，分析。。。）*/
Math.prototype.getChildQuestionsForQuestion = function(callback){
    var _sql = `select * from tblQuestion2Part where questionid='${this.props.id}' ORDER BY ordersn`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getChildQuestionsForQuestion',
        callback: callback
    })
}
/*添加用户试卷做题记录*/
Math.prototype.addUserPaperData = function (callback) {
    var _sql = `INSERT INTO tblStudentExamInfo (ExamInfoID,UserID,ExamPaperID,ExamPaperTitle,StartDate,FinishDate,SpendTime,ExamType,Score,ExamResult,DoExamInfo,IsDone)
                VALUES
                ('${this.props.ExamInfoID}','${this.props.UserID}','${this.props.ExamPaperID}','${this.props.ExamPaperTitle}','${this.props.StartDate}','${this.props.FinishDate}','${this.props.SpendTime}','${this.props.ExamType}','${this.props.Score}','${this.props.ExamResult}','${this.props.DoExamInfo}','${this.props.AllDone}');`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'addUserPaperData',
        callback: callback
    })
}
/*更新用户试卷做题记录*/
Math.prototype.updateUserPaperData = function (callback) {
    var _sql = `update tblStudentExamInfo set
                    Score='${this.props.Score}',
                    ExamResult='${this.props.ExamResult}',
                    IsDone='${this.props.AllDone}',
                    FinishDate='${this.props.FinishDate}',
                    SpendTime='${this.props.SpendTime}',
                    UpdateDate='${this.props.UpdateDate}',
                    DoExamInfo='${this.props.DoExamInfo}' where ExamInfoID='${this.props.ExamInfoID}';`
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'updateUserPaperData',
        callback: callback
    })
}
/*记录用户每题做题记录*/
Math.prototype.addUserQuestionDataOfPaper = function (callback) {
    var _sql = `INSERT INTO tblStudentExamQuestionInfo (questionId,examInfoId,examPaperId,userId,examOrExercise,questionType,trueOrfalse,knowledge,questionScore,answerContent,url)
                VALUES ${this.props.list};`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'addUserQuestionDataOfPaper',
        callback: callback
    })
}
/*获取用户一测数据的做题数据(最新的一条数据)*/
Math.prototype.getFirstDataOfPaper = function (callback) {
    var _sql = `select * from tblStudentExamInfo where UserID='${this.props.userid}' and ExamPaperID='${this.props.id}' and ExamType='一测' ORDER BY ExamInfoID DESC LIMIT 0,1;`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getFirstDataOfPaper',
        callback: callback
    })
}
/*获取用户最近二测数据的做题数据(最新的一条数据)*/
Math.prototype.getDoingSecendDataOfPaper = function (callback) {
    var _sql = `select * from tblStudentExamInfo where UserID='${this.props.userid}' and ExamPaperID='${this.props.id}' and ExamType='二测' and IsDone='no' ORDER BY ExamInfoID DESC LIMIT 0,1;`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getDoingSecendDataOfPaper',
        callback: callback
    })
}
Math.prototype.getThisCollection = function (callback) {
    var _sql = `select * from tblStudentCollectInfo where userid='${this.props.userId}' and questionid='${this.props.questionId}' `;
    helper.db_query({
        connect:con,
        sql:_sql,
        name:'getThisCollection',
        callback:callback
    })
}
Math.prototype.getChapterTree = function (callback) {
    var _sql = `select knowledgeid,knowledge,ordersn from tblKnowledgeArch where parentid='' ORDER BY ordersn`;
    helper.db_query({
        connect:con,
        sql:_sql,
        name:'getChapterTree',
        callback:callback
    })
}
Math.prototype.getAllKnowledgeOfChapter = function(callback){
    var _sql = `select * from tblKnowledgeArch`;
    helper.db_query({
        connect:con,
        sql:_sql,
        name:'getAllKnowledgeOfChapter',
        callback:callback
    })
}
Math.prototype.getKnowledgeIdList = function (callback) {
    var _sql = `select * from tblKnowledge2Question where knowledgeid=(select knowledgeid from tblKnowledgeArch where knowledge='${this.props.knowledgeName}')`;
    helper.db_query({
        connect:con,
        sql:_sql,
        name:'getKnowledgeIdList',
        callback:callback
    })
}
Math.prototype.getKnowledgeIdListWithId = function (callback) {
    var _sql = `select * from tblKnowledge2Question where knowledgeid=(select knowledgeid from tblKnowledgeArch where knowledgeid='${this.props.knowledgeId}')`;
    helper.db_query({
        connect:con,
        sql:_sql,
        name:'getKnowledgeIdListWithId',
        callback:callback
    })
}
/*存储知识点对应的题的做题情况*/
Math.prototype.setKnowledgeForQuestionInfo = function (callback) {
    var _sql = `INSERT INTO tblStudentKnowledgeInfo (userId,knowledgeId,knowledgeName,questionId,examPaperId,questionNum,errorNum)
                VALUES
                ('${this.props.userId}','${this.props.knowledgeId}','${this.props.knowledgeName}','${this.props.questionId}','${this.props.examPaperId}','${this.props.questionNum}','${this.props.errorNum}');`;
    helper.db_query({
        connect:con,
        sql:_sql,
        name:'setKnowledgeForQuestionInfo',
        callback:callback
    })
}
/*在tblQuestion、tblQuestionItem两个表中查找某个试题id的详情。因为不知道存在于某个表中*/
Math.prototype.getEveryQuestion = function (callback) {
    var _sql = `(select * from tblQuestion where questionid='${this.props.id}')
                UNION
                (SELECT * from tblQuestionItem where itemid='${this.props.id}')`;
    helper.db_query({
        connect:con,
        sql:_sql,
        name:'getEveryQuestion',
        callback:callback
    })
}
Math.prototype.setThematicQuestionAnswerInfo = function (callback) {
    var _sql = `INSERT INTO tblStudentThematicQuestionInfo (userid,questionid,wherefrom,questionType,knowledge,isobjective,difficulty,score,answercontent,trueorfalse,url)
                VALUES
                ('${this.props.userId}','${this.props.questionId}','${this.props.whereFrom}','${this.props.questionType}',
                '${this.props.knowledge}','${this.props.isobjective}','${this.props.difficulty}','${this.props.score}',
                '${this.props.answer}','${this.props.isRight}','${this.props.url}');`;
    helper.db_query({
        connect:con,
        sql:_sql,
        name:'setThematicQuestionAnswerInfo',
        callback:callback
    })
}
/*用户收藏试题*/
Math.prototype.setCollection = function (callback) {
    var _sql = `INSERT INTO tblStudentCollectInfo (userid,questionid,questiontype,parentid,content)
                VALUES
                ('${this.props.userId}','${this.props.questionId}','${this.props.questionType}','${this.props.parentId}','${this.props.title}');`;
    helper.db_query({
        connect:con,
        sql:_sql,
        name:'setCollection',
        callback:callback
    })
}
module.exports = Math