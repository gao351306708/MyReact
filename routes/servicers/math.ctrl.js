/**
 * 服务端--获取数学真题
 * Created by gaoju on 2018/1/19.
 */
var fs = require('fs'),path = require('path');
var Math = require('../../database/math.db');
var doGetAllChildOfExam = require('../mathModule/getAllChildOfExam')

module.exports={
    init: function(app) {
        app.post('/math/allPapers',this.getAllPapers);
        app.post('/math/questionsOfPaper',this.getQuestionsOfPaper);
        app.post('/math/question',this.getQuestion);
        app.post('/math/sentUserPaperData',this.sentUserPaperData);
        app.post('/math/sentUserQuestionDataOfPaper',this.sentUserQuestionDataOfPaper);
        app.post('/math/firstDataOfPaper',this.getFirstDataOfPaper);
        app.post('/math/secendDataOfPaper',this.getSecendDataOfPaper);
        app.post('/math/allChildDetailsOfQuestion',this.getAllChildDetailsOfQuestion)
        app.post('/math/allChildOfQuestion',this.getAllChildOfQuestion);
        app.post('/math/contentOfChildItems',this.getContentOfChildItems);
        app.post('/math/contentOfChildItemsForQues',this.getContentOfChildItemsForQues);
        app.post('/math/childQuestionsForQuestion',this.getChildQuestionsForQuestion);
        app.post('/math/setCollection',this.doSetCollection);
        app.post('/math/allQuestionOfThematic',this.getAllQuestionOfThematic);
        app.post('/math/allKnowledgeOfChapter',this.getAllKnowledgeOfChapter);
        app.post('/math/knowledgeIdList',this.getKnowledgeIdList);
        app.post('/math/knowledgeIdListWithId',this.getKnowledgeIdListWithId);
        app.post('/math/knowledgeForQuestionInfo',this.sentKnowledgeForQuestionInfo);
        app.post('/math/everyQuestion',this.getEveryQuestion);
        app.post('/math/thematicQuestionAnswerInfo',this.setThematicQuestionAnswerInfo);
        app.post('/math/getAllChildOfExam',doGetAllChildOfExam);
    },
    getAllPapers: (req, res) => {
        let props = {};
        let math = new Math({props: props});
        math.getAllPapersList(function(err, data) {
            if(err){
                console.log(err)
                return res.send({
                    code: 501,
                    message: '出错了0.0'
                });
            }
            if (data.length>0) {
                return res.send({
                    code: 200,
                    data: data
                })
            } else {
                return res.send({
                    code: 500,
                    message: '未获取到数据^@^'
                })
            }
        })
    },
    getAllQuestionOfThematic:(req,res)=>{
        let props={};
        let math = new Math({props:props});
        math.getAllQuestionOfThematic(function(err,data){
            if(err){
                return res.send({
                    code:501,
                    message:'出错了0.0'
                })
            }
            if(data.length>0){
                return res.send({
                    code:200,
                    data:data
                })
            }else {
                return res.send({
                    code: 500,
                    message: '未获取到数据'
                })
            }
        })
    },
    getQuestionsOfPaper: (req,res) => {
        var props = {
            id:req.body.id
        };
        var math = new Math({props: props});
        math.getQuestionsOfPaperList(function(err, data) {
            if(err){
                console.log(err)
                return res.send({
                    code: 501,
                    message: '出错了0.0'
                });
            }
            if (data.length>0) {
                return res.send({
                    code: 200,
                    data: data
                })
            } else {
                return res.send({
                    code: 500,
                    message: '未获取到数据^@^'
                })
            }
        })
    },
    getQuestion: (req,res) => {
        let props = {
            id:req.body.id
        };
        let math = new Math({props: props});
        math.getQuestionItems(function(err, data) {
            if(!err){
                if (data.length>0) {
                    let olddata = data;
                    let props = {
                        id:data[0].questionid
                    };
                    let math = new Math({props: props});
                    math.getQuestionChild(function(err, data){
                        olddata[0].childs = data;
                        if(!err){
                            return res.send({
                                code: 200,
                                data: olddata
                            })
                        }else {
                            console.log(err);
                            return res.send({
                                code: 501,
                                message: '数据获取出错了^@^'
                            })
                        }
                    })
                } else {
                    console.log(err);
                    return res.send({
                        code: 500,
                        message: '未获取到数据^@^'
                    })
                }
            }else{
                console.log(err);
                return res.send({
                    code: 501,
                    message: '数据获取出错了^@^'
                })
            }
        })
    },
    getContentOfChildItems: (req,res) => {
        let props = {
            id:req.body.id
        };
        let math = new Math({props: props});
        math.getContentOfChildItems(function(err, data) {
            if(!err){
                if (data.length>0) {
                    return res.send({
                        code: 200,
                        data: data
                    })
                } else {
                    console.log(err);
                    return res.send({
                        code: 500,
                        message: '未获取到数据^@^'
                    })
                }
            }else{
                console.log(err);
                return res.send({
                    code: 501,
                    message: '数据获取出错了^@^'
                })
            }
        })
    },
    getContentOfChildItemsForQues: (req,res) => {
        let props = {
            id:req.body.id
        };
        let requestdata = req.body;
        let math = new Math({props: props});
        math.getContentOfChildItemsForQues(function(err, data) {
            if(!err){
                if (data.length>0) {
                    return res.send({
                        code: 200,
                        data: data,
                        reqdata:requestdata,//把请求的数据再返回去
                    })
                } else {
                    console.log(err);
                    return res.send({
                        code: 500,
                        message: '未获取到数据^@^'
                    })
                }
            }else{
                console.log(err);
                return res.send({
                    code: 501,
                    message: '数据获取出错了^@^'
                })
            }
        })
    },
    getChildQuestionsForQuestion: (req,res) => {
        let props = {
            id:req.body.id
        };
        let math = new Math({props: props});
        math.getQuestionChildItems(function(err, data) {
            if(!err){
                if (data.length>0) {
                    return res.send({
                        code: 200,
                        data: data
                    })
                } else {
                    console.log(err);
                    return res.send({
                        code: 500,
                        message: '未获取到数据^@^'
                    })
                }
            }else{
                console.log(err);
                return res.send({
                    code: 501,
                    message: '数据获取出错了^@^'
                })
            }
        })
    },
    getAllChildDetailsOfQuestion:(req,res)=>{
        let props = {
            id:req.body.id
        };
        let math = new Math({props: props});
    }
    ,
    getAllChildOfQuestion: (req,res) => {
        let props = {
            id:req.body.id
        };
        let math = new Math({props: props});
        math.getQuestionItems(function(err, data) {
            if(!err){
                if (data.length>0) {
                    let olddata = data;
                    let props = {
                        id:data[0].questionid
                    };
                    let math = new Math({props: props});
                    math.getQuestionChild(function(err, data){
                        if(!err){
                            olddata[0].childs = data;
                            let props = {
                                id:olddata[0].questionid
                            };
                            let math = new Math({props: props});
                            //查出其所有子题，
                            math.getQuestionChildItems(function(err, data){
                                olddata[0].childsid = data;
                                if(!err){
                                    return res.send({
                                        code: 200,
                                        data: olddata
                                    })
                                }else {
                                    console.log(err);
                                    return res.send({
                                        code: 501,
                                        message: '数据获取出错了^@^'
                                    })
                                }
                            })
                        }else {
                            console.log(err);
                            return res.send({
                                code: 501,
                                message: '数据获取出错了^@^'
                            })
                        }
                    })
                } else {
                    console.log(err);
                    return res.send({
                        code: 500,
                        message: '未获取到数据^@^'
                    })
                }
            }else{
                console.log(err);
                return res.send({
                    code: 501,
                    message: '数据获取出错了^@^'
                })
            }
        })
    },
    sentUserPaperData: (req,res)=>{
        var props = req.body;
        //props.DoExamInfo = JSON.stringify(req.body.DoExamInfo);
        props.ExamResult = JSON.stringify(req.body.ExamResult);
        props.userid = req.body.UserID;
        props.id = req.body.ExamPaperID;
        var math = new Math({props: props});
        //先判断数据库中有没有近期没有做完的试卷数据
        math.getDoingSecendDataOfPaper(function(err,data){
            if(!err){
                if(data.length>0){//有数据就更新
                    let props2 = req.body;
                    props2.ExamInfoID = data[0].ExamInfoID;
                    let math2 = new Math({props: props2});
                    math2.updateUserPaperData(function(err, data){
                        if(!err){
                            return res.send({
                                code: 200,
                                data: data,
                                message:'更新成功'
                            })
                        }else {
                            console.log(err);
                            return res.send({
                                code: 501,
                                message: '数据获取出错了^@^'
                            })
                        }
                    });
                }else {//否则就添加一条新的数据
                    math.addUserPaperData(function(err, data){
                        if(!err){
                            return res.send({
                                code: 200,
                                data: data,
                                message:'添加成功'
                            })
                        }else {
                            console.log(err);
                            return res.send({
                                code: 501,
                                message: '数据获取出错了^@^'
                            })
                        }
                    });
                }
            }else {
                console.log(err);
                return res.send({
                    code:501,
                    message:'数据获取出错了^@^'
                })
            }
        })
    },
    sentUserQuestionDataOfPaper:(req,res)=>{
        //先处理一测的情况
        let data = req.body;
        let props={},str = '';
        //('${this.props.ExamInfoID}','${this.props.UserID}','${this.props.ExamPaperID}','${this.props.ExamPaperTitle}',
        // '${this.props.StartDate}','${this.props.FinishDate}','${this.props.SpendTime}','${this.props.ExamType}',
        // '${this.props.Score}','${this.props.ExamResult}','${this.props.DoExamInfo}','${this.props.AllDone}')
        //(questionId,examInfoId,examPaperId,userId,examOrExercise,questionType,trueOrfalse,knowledge,questionScore,answerContent,url)
        let ExamResult = data.ExamResult;
        if(ExamResult.length>0){
            for(let i=0;i<ExamResult.length;i++){
                let everystr = "";
                if(ExamResult[i]){
                    let Contents = ExamResult[i].Contents;
                    let answer='';let trueOrfalse="true";let url='';
                    if(Contents.length>0){
                        for (let j in Contents){
                            if(!Contents[j].IsTrue){//如果以一个是false则结果为false
                                trueOrfalse = "false";
                            }
                            answer = answer + Contents[j].content + "|";//每一个答案用|分开
                            url = url + Contents[j].url + "@$";
                        }
                        answer = answer.substring(0, answer.lastIndexOf('|'));//最后一个|去掉
                        url = url.substring(0, url.lastIndexOf('@$'));//最后一个@$去掉
                    }
                    everystr = "("+ "'"+ExamResult[i].QuesID+"'" +","+"'"+data.ExamInfoID+"'"+","+"'"+data.ExamPaperID+"'"+","
                        +"'"+data.UserID+"'"+","+"'"+data.ExamOrExercise+"'"+"," + "'"+ExamResult[i].QuesType+"'"+","+"'"+trueOrfalse+"'"+","+"'"+ExamResult[i].knowledge+"'"+","
                        +ExamResult[i].score+"," + "'"+answer+"'"+","+"'"+url+"'"+")"
                }
                str = str + everystr + ",";
            }
            str = str.substring(0, str.lastIndexOf(','));//最后一个|去掉
        }
        props.list = str;
        let math2 = new Math({props: props});
        //添加试卷中每个试题的记录信息
        math2.addUserQuestionDataOfPaper(function(err, data){
            if(!err){
                return res.send({
                    code: 200,
                    data: data
                })
            }else {
                console.log(err);
                return res.send({
                    code: 501,
                    message: '数据获取出错了^@^'
                })
            }
        })
    },
    getFirstDataOfPaper: (req,res)=>{
        let props = {
            userid:req.body.userid,
            id:req.body.id
        };
        var math = new Math({props:props});
        math.getFirstDataOfPaper(function(err,data){
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
    getSecendDataOfPaper:(req,res)=>{
        let props = {
            userid:req.body.userid,
            id:req.body.id
        };
        var math = new Math({props:props});
        math.getDoingSecendDataOfPaper(function(err,data){
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
    doSetCollection: (req,res)=>{
        var props = req.body;
        var math = new Math({props:props});
        math.getThisCollection(function(err,data){
            if(!err){
                if(data.length>0){//此题已经存在
                    return res.send({
                        code:500,
                        message:'此题已经收藏过了'
                    })
                }else{
                    math.setCollection(function(err,data){
                        if(!err){
                            return res.send({
                                code:200,
                                data:data
                            })
                        }else{
                            return res.send({
                                code:501,
                                message:'数据出错了'
                            })
                        }
                    })
                }
            }else{
                return res.send({
                    code:501,
                    message:'数据出错了'
                })
            }
        })
    },
    getAllKnowledgeOfChapter:(req,res)=>{
        var props = req.body;
        var math = new Math({props:props});
        math.getAllKnowledgeOfChapter(function(err,data){
            if(!err){
                //let dealData = JSON.stringify(fun1(data));
                //fs.writeFile('src/data/knowledge.json',dealData,"utf-8",function(err){
                //    if(!err){
                //        console.log("write done!!!");
                //    }
                //})
                return res.send({
                    code:200,
                    data:fun1(data)
                })
            }else{
                return res.send({
                    code:501,
                    message:'数据出错了'
                })
            }
        })
        //处理返回的数据，生成目录树，方便前端使用
        function fun1(data){
            var chapter = [];
            for (let item in data){
                if(data[item].parentid == ''){
                    chapter.push(data[item])
                }
            }
            //排序
            chapter = chapter.sort(function(a,b){
                return a.ordersn- b.ordersn;
            })
            //获取每一个节点的子节点
            for(let i=0;i<chapter.length;i++){
                chapter[i] = getchild(chapter[i],data)
            }
            return chapter
        }
        function getchild(chapterList,AllList){
            chapterList.child = [];
            for(let i=0;i<AllList.length;i++){
                if(AllList[i] && AllList[i].parentid==chapterList.knowledgeid){
                    chapterList.child.push(getchild(AllList[i],AllList));
                }
            }
            chapterList.child = chapterList.child.sort(function(a,b){
                return a.ordersn- b.ordersn;
            })
            return chapterList
        }
    },
    getKnowledgeIdList:(req,res)=>{
        var props = req.body;
        var math = new Math({props:props});
        math.getKnowledgeIdList(function(err,data){
            if(!err){
                return res.send({
                    code:200,
                    data:data
                })
            }else{
                return res.send({
                    code:501,
                    message:'数据出错了'
                })
            }
        })
    },
    getKnowledgeIdListWithId:(req,res)=>{
        var props = req.body;
        var math = new Math({props:props});
        math.getKnowledgeIdListWithId(function(err,data){
            if(!err){
                return res.send({
                    code:200,
                    data:data
                })
            }else{
                return res.send({
                    code:501,
                    message:'数据出错了'
                })
            }
        })
    },
    getEveryQuestion:(req,res)=>{
        var props = req.body;
        var math = new Math({props:props});
        math.getEveryQuestion(function(err,data){
            if(!err){
                return res.send({
                    code:200,
                    data:data
                })
            }else{
                return res.send({
                    code:501,
                    message:'数据出错了'
                })
            }
        })
    },
    sentKnowledgeForQuestionInfo:(req,res)=>{
        var props = req.body;
        var infoList = req.body.infoList;//所有的做题信息；
        var questionNum = infoList.length;
        var rightNum = 0;
        for (let i in infoList){
            if(infoList[i].isTure || infoList[i].isTure == "true"){
                rightNum = rightNum + 1;
            }
        }
        props.questionNum = questionNum;
        props.errorNum = questionNum-rightNum;
        var math = new Math({props:props});
        math.setKnowledgeForQuestionInfo(function(err,data){
            if(!err){
                return res.send({
                    code:200,
                    data:data
                })
            }else{
                return res.send({
                    code:501,
                    message:'数据出错了'
                })
            }
        })
    },
    setThematicQuestionAnswerInfo:(req,res)=>{
        var props = req.body;
        var data = JSON.parse(req.body.questionData);
        props.questionId = data.questionid;
        props.questionType = data.questiontemplate;
        props.knowledge = data.knowledge;
        props.isobjective = data.isobjective;
        props.difficulty = data.difficulty;
        var math = new Math({props:props});
        math.setThematicQuestionAnswerInfo(function(err,data){
            if(!err){
                return res.send({
                    code:200,
                    data:data
                })
            }else{
                return res.send({
                    code:501,
                    message:'数据出错了'
                })
            }
        })
    }
}
