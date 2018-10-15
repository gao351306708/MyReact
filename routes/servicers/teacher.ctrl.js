/**
 * @desc 用户 控制器
 * @dateTime 2018-6-26
 **/

var Teacher = require('../../database/teacher.db');
var Helper = require('../helper');

module.exports =  {
    init: function(app) {
        app.post('/teacher', this.doGetUserInfo);
        app.post('/teacher/register',this.doRegister);
        app.post('/teacher/allPaperOfStudent',this.getAllPaperOfStudent);
        app.post('/teacher/dataOfPaper',this.getDataOfPaper);
        app.post('/teacher/updateMarkExamInfo',this.doUpdateMarkExamInfo);
        app.post('/teacher/updateMarkQuestionInfo',this.doUpdateMarkQuestionInfo)
    },
    doGetUserInfo:function(req,res){
        var props = req.body;
        var teacher = new Teacher({props: props});
        teacher.getTeacherInfo(function(err, data) {
            if(!err){
                if (data.length) {
                    console.log(data)
                    return res.send({
                        code: 200,
                        data: data
                    })
                } else {
                    return res.send({
                        code: 500,
                        message: '用户名不存在或密码错误'
                    })
                }
            }else {
                console.log(err)
                return res.send({
                    code: 501,
                    message: '报出错了'
                })
            }
        })
    },
    doRegister:function(req,res){
        const props = req.body;
        let teacher = new Teacher({props: props});
        //判断用户名是否存在
        teacher.getTeacherUserInfo(function(err, data){
            if(err){
                console.log(err)
                return res.send({
                    code: 501,
                    message: '出错了0.0'
                });
            }
            if(data.length<1){
                let teacher = new Teacher({ props: props });
                //添加新用户
                teacher.addUser(function(err, data) {
                    if(err){
                        console.log(err)
                        return res.send({
                            code: 501,
                            message: '出错了0.0'
                        });
                    }
                    if (data.insertId>0) {
                        return res.send({
                            code: 200,
                            data:data.insertId
                        })
                    } else {
                        console.log(err)
                        return res.send({
                            code: 500,
                            type:'register',
                            message: '注册出错了,请重新注册'
                        })
                    }
                })
            }else {
                return res.send({
                    code: 500,
                    type:'username',
                    message: '用户名已存在，请重新输入！'
                })
            }
        })
    },
    getDataOfPaper: (req,res)=>{
        let props = {
            id:req.body.id
        };
        var teacher = new Teacher({props: props});
        teacher.getDataOfPaper(function(err,data){
            if(!err){
                return res.send({
                    code:200,
                    data:data
                })
            }else {
                console.log(err);
                return res.send({
                    code:501,
                    message:'数据获取出错了^@^'
                })
            }
        })

    },
    getAllPaperOfStudent: function (req,res) {
        var props = req.body;
        var teacher = new Teacher({props:props});
        teacher.getAllPaperOfStudent(function (err,data) {
            if(!err){
                if(data.length){
                    return res.send({
                        code:200,
                        data:data
                    })
                }else {
                    return res.send({
                        code: 500,
                        message: '没有查到相应的数据'
                    })
                }
            }else {
                console.log(err)
                return res.send({
                    code: 501,
                    message: '报出错了'
                })
            }
        })
    },
    doUpdateMarkExamInfo: function (req,res) {
        var props = (req.body);
        props.ExamResult = JSON.stringify(req.body.ExamResult);
        var teacher = new Teacher({props:props});
        teacher.updateMarkExamInfo(function (err,data) {
            if(!err){
                return res.send({
                    code:200,
                    data:data
                })
            }else {
                console.log(err)
                return res.send({
                    code: 500,
                    message: '批改提交失败'
                })
            }
        })
    },
    doUpdateMarkQuestionInfo:function(req,res){
        var props = {};
        var data = req.body;
        var examinfoid = data.ExamInfoID;//试卷id
        var allquestion = data.ExamResult;//试卷包含的所有试题
        var questionlist = '';
        var markerContent = '';
        var markerscore = '';
        var markerUrl = '';
        for(let i in allquestion){
            if(allquestion[i].hasOwnProperty('teacherMark')){
                markerscore = markerscore + " WHEN " + "'"+allquestion[i].QuesID+"'" + " THEN " + allquestion[i].score;
                markerContent = markerContent + " WHEN " + "'"+allquestion[i].QuesID+"'" + " THEN " + "'"+allquestion[i].teacherMark+"'";
                markerUrl = markerUrl + " WHEN " + "'"+allquestion[i].QuesID+"'" + " THEN " + "'"+allquestion[i].teacherMarkUrl+"'";
                questionlist = questionlist + ", '"+allquestion[i].QuesID+"'";
            }
        }
        questionlist =  questionlist.replace(/,/,"");
        var sql = "markerscore = CASE questionid " + markerscore + " END, " +
                    "markerContent = CASE questionid " + markerContent + " END, " +
                    "markerUrl = CASE questionid " + markerUrl + " END " +
                    "WHERE examinfoid=" + "'"+examinfoid+"'" + " and questionid in " + "("+questionlist+")";

        console.log(sql);
        props.setList = sql;
        props.marker = data.marker;
        var teacher = new Teacher({props:props});
        teacher.updateMarkQuestionInfo(function (err,data) {
            if(!err){
                return res.send({
                    code:200,
                    data:data
                })
            }else {
                console.log(err)
                return res.send({
                    code: 500,
                    message: '批改试题信息提交失败'
                })
            }
        })
    }
}