/**
 * 二测试题
 * Created by gaoju on 2017/11/29.
 */
import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import './question_style.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getFirstDataOfPaper,getSecendDataOfPaper,getAllChildOfExam,getAllChildOfQuestion,getContentOfChildItemsForQues,getQuestion,getChildQuestionsForQuestion,doSetCollection,sentUserPaperData} from '../../../../redux/actions/math'
import {getCoords,compareDifferent} from '../../../../method_public/public'
import {showConfirm} from '../../../../method_public/antd-modal'
import PureRenderMixin from '../../../../method_public/pure-render'
import SelectMenu from '../../../../components/selectMenu/selectMenu'
import NoThisPart from '../../../../components/defaultJPG/nothispart'
import {Storage_S,Storage_L} from '../../../../config'
import {EveryChildInfo} from '../../../../method_public/sentJson'
import moment from 'moment'
import {Icon,Button,Input,message,Row,Col,Spin,Anchor } from 'antd'
import {Pagination,Pagination2} from '../../../../components/pagination'
import MultipleChoice from '../../../../components/multipleChoice/index'
import {BaseEditor,MathJaxEditor} from '../../../../components/editer'
import UpLoadFile from '../../../../components/upload/index'
import DialogMask from '../../../../components/Alter/dialogMask/dialogmask'
import Loading from '../../../../components/loading'
import Knowledge from './knowledge.js'

const { Link } = Anchor;
var num = 0;
var everyChildInfo = JSON.stringify(EveryChildInfo);
var newChildList = JSON.parse(everyChildInfo);
var DoExamInfo_foot = null;
var sentJson = {
    "ExamInfoID":"", "UserID":"", "ExamPaperID":"","ExamPaperTitle":"",
    "StartDate":null,"UpdateDate":null, "FinishDate":null, "SpendTime":0, "ExamType":"", "Score":0,
    "ExamResult":[],
    "DoExamInfo":null,
    "currentquesid":1,
    "AllDone":'no',
    "errorArray":[]
}
var allDoneFlag = false;//做完提交标志
var autoKnowledgeList=[];//每个试题 分析部分 小题或填空题的 相关考点。用来自动弹出知识点复习框的
class Question extends Component{
    constructor(props){
        super(props);
        //let activeId = window.location.pathname.split('/')[window.location.pathname.split('/').length-1];//如果点击锚点定位改变了location的值 可以使用 browserHistory，改为pathname获取
        let activeId = window.location.hash.split('/')[window.location.hash.split('/').length-1];//当前页面的id
        this.state={
            activeId:activeId,//试卷ID
            sentAllList: {},//组装答案列表，用来发送存储源数据
            current: null,//当前是第几题
            errorArray : [],//一测做错的题
            allQuestionetails:[],//一测所有试题做题结果
            allChildQuestionOfExam:[],//试卷的所有试题（包括所有子试题和相关的试题）
            currentQuesData:[],//当前试题的所有内容
            analysisLeftContent:[],//当前试题的分析部分
            exerciseContent:[],//当前试题的练习部分
            total:0,
            AnalysisFlag:true,//分析解答
            nowPart:'',//当前显示的是那一部分：解析，答案，巩固，拓展
            AnswerFlag:false,//标准答案
            Exercise1Flag:false,//巩固
            openKeys:['sub0'],
            showEditor:false,
            target_id:'',
            position:[],
            solution:false,
            DialogMaskFlag:false,
            knowledgeName:'',
            Pending : true,//加载转圈标志
        }
    }
    componentDidMount(){
        //先查看本地缓存
        let paperItems = JSON.parse(Storage_L.getItem(this.state.activeId +"-second"))//缓存中取出做题情况的对应数据
        if(!paperItems){//没有
            this.props.actions.getSecendDataOfPaper({//再查看数据库中最近二测考试的结果
                body:[{userid: Storage_S.getItem('userid'), id: this.state.activeId}],
                success:(datas)=>{
                    console.warn(datas)
                    if((datas[0].data).length>0){//有缓存的数据
                        let ExamResult = JSON.parse((datas[0].data)[0].ExamResult.replace(/\\/g,"@&@"));
                        let DoExamInfo = JSON.parse((datas[0].data)[0].DoExamInfo);
                        DoExamInfo_foot = (datas[0].data)[0].DoExamInfo;
                        this.getAllChildOfExamList(ExamResult,DoExamInfo,DoExamInfo.currentquesid,DoExamInfo.errorArray)
                    }else {
                        sentJson.ExamInfoID = moment().format('x');//当前时间戳作为此次做题id
                        sentJson.UserID =Storage_S.getItem('userid');
                        sentJson.ExamPaperID = this.state.activeId;
                        sentJson.StartDate = moment().format();
                        sentJson.ExamType = "二测";
                        sentJson.ExamPaperTitle = JSON.parse(Storage_S.getItem(this.state.activeId)).exampaper;
                        this.props.actions.getFirstDataOfPaper({//如果没有数据 就获取最近一测考试的结果
                            body:[{
                                userid: Storage_S.getItem('userid'),
                                id: this.state.activeId
                            }],
                            success:(data)=>{
                                let datajson = JSON.parse((data[0].data)[0].ExamResult.replace(/\\/g,"@&@"));
                                let DoExamInfo = sentJson;
                                DoExamInfo.ExamResult = datajson;
                                DoExamInfo_foot = JSON.stringify(DoExamInfo);
                                console.log("allQuestionetails--一测试题的信息->>>",datajson)
                                let errorArray=[];//错误题号
                                let ii=0;
                                for(let ss in datajson){
                                    if(datajson[ss] && datajson[ss]!= "null"){
                                        if(datajson[ss].Contents.length>0){
                                            if(!(datajson[ss].Contents[0].IsTrue)){//获取错题列表
                                                errorArray[ii] =  Number(ss)+1;
                                                ii = ii+1;
                                            };
                                        }
                                    }else {
                                        errorArray[ii] =  Number(ss)+1;
                                        ii = ii+1;
                                    }
                                }
                                this.getAllChildOfExamList(datajson,DoExamInfo,errorArray[0],errorArray)
                            },
                            error:(message)=>{
                                console.error(message)
                            }
                        })
                    }
                },
                error:(message)=>{console.error(message)}
            })
        }else {
            let currentquesid = paperItems.currentquesid;
            let errorArray = paperItems.errorArray;
            let ExamResult = paperItems.ExamResult;
            //let DoExamInfo = !paperItems.DoExamInfo ? sentJson : JSON.parse(paperItems.DoExamInfo);
            let DoExamInfo = paperItems;
            DoExamInfo_foot = JSON.stringify(paperItems);
            this.getAllChildOfExamList(ExamResult,DoExamInfo,currentquesid,errorArray)
        }

        //离开route的钩子处理事件
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
    }
    shouldComponentUpdate(nextProps,nextState){
        //当切换题的时候如果新的数据还没有加载出来则不需要render
        if(this.state.current != nextState.current){
            if(this.state.currentQuesData == nextState.currentQuesData){
                return false;
            }
        }
        return true;
    }
    componentDidUpdate(prevProps,prevState){
        //完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
        if(prevState.analysisLeftContent != this.state.analysisLeftContent){
            this.addEventFuc();//为分析部分添加事件处理
            this.addAnswer();//为解析部分添加已有的答案以及事件处理
        }
        if(prevState.currentQuesData != this.state.currentQuesData){
            this.addOldAnswer();//显示主题干一测试题的答案
        }
    }
    routerWillLeave=(nextLocation)=> {
        // 返回 false 会继续停留当前页面，否则，返回一个字符串，会显示给用户，让其自己决定
        //this.submitAllQuestion('cache');//退出的时候在发送数据库缓存一次
        UE.delEditor('questionContainer');//退出的时候删除实例化的编辑器
        return true;
    }
    getAllChildOfExamList(ExamResult,DoExamInfo,currentNum,errorArray){
        this.props.actions.getAllChildOfExam({
            body:{id : this.state.activeId},
            success:(data)=>{
                console.log("getAllChildOfExam--所有试题的信息->>>",data)
                this.setState({
                    total:ExamResult.length,
                    errorArray:errorArray,
                    sentAllList:DoExamInfo,
                    allQuestionetails:ExamResult,
                    current:currentNum,
                    allChildQuestionOfExam:data,
                })
                this.getData(ExamResult[currentNum-1],currentNum-1,data)
            },
            error:(mes)=>{console.error(mes)}
        })
    }
    requestQuestion(type,data){
        if(data.length<1){return}
        let childid = data[0].childsid;
        switch (type){
            case 'AnalyContent' :
                this.setState({AnalysisFlag:true, AnswerFlag:false, Exercise1Flag:false,showEditor:false,nowPart:type});
                break;
            case 'Answer' :
                this.setState({AnalysisFlag:false, AnswerFlag:true, Exercise1Flag:false,showEditor:false,nowPart:type});
                break;
            case 'Exercise1' :
                this.getDateOfPractice(type,childid);
                this.setState({AnalysisFlag:false, AnswerFlag:false, Exercise1Flag:true,showEditor:false,nowPart:type});
                break;
            case 'Exercise2':
                this.getDateOfPractice(type,childid);
                this.setState({AnalysisFlag:false, AnswerFlag:false, Exercise1Flag:true,showEditor:false,nowPart:type});
                break;
            default: break;
        }

    }
    addOldAnswer(){
        let _this = this;
        let oldcontent = this.state.sentAllList.ExamResult[this.state.current-1];//做过一次的数据
        let oldanswer = (oldcontent && (oldcontent.Contents).length>0) ? oldcontent.Contents: this.state.allQuestionetails[this.state.current-1].Contents;
        $("#Content_Qtxt").find('.div_input').each(function(i){
            let add_id = "question"+_this.state.current+i;
            if(oldanswer[i]){
                if(oldanswer[i].url){//有图片的话,添加img
                    $(this).append('<img src='+oldanswer[i].url+' data-latex='+oldanswer[i].content+'/>');
                }else{
                    $(this).text(oldanswer[i].content);
                }
            }
            $(this).attr("id",add_id);
            $(this).on('click',function(event){
                if(_this.state.solution){
                    _this.FocusHandle(this,add_id)
                }
            })
        });
    }
    addEventFuc(type){
        let _this = this;
        $('.mustText').on('click',function(e){
            _this.getKnowledge(e);
        });
        $("#Analysis_Qtxt").find('.div_input').each(function(i){
            let add_id='';
            add_id = "answer-"+_this.state.current+"-"+i;
            $(this).attr("id",add_id);
            $(this).on('click',function(event){
                _this.FocusHandle(this,add_id)
            })
        });
    }
    addAnswer(){
        let childsDom = this.state.sentAllList.ExamResult[this.state.current-1];
        $(".analysisContent").each(function(ii){
            let domTargetId = ($(this)[0].id).split('-');
            let childsNum = domTargetId[1];//属于第几问
            let childsType = domTargetId[0];//属于那一部分
            let childsTypeIndex = domTargetId[2];//属于某部分的第几题
            let ddd = !childsDom ? '':childsDom.childs[childsNum-1][childsType];
            $(this).find('.div_input').each(function(i){
                if(ddd && ddd.length>0){
                    let answers = null;
                    if(ddd[childsTypeIndex]){
                        answers = ddd[childsTypeIndex].content[i];
                    }
                    if(answers){
                        if(answers.url){//有图片的话,添加img
                            $(this).append('<img src='+answers.url+' data-latex='+answers.content+'/>');
                        }else{
                            $(this).text(answers.answer);
                        }
                    }
                }
            })
        })
    }
    FocusHandle(e,add_id){
        let tar_id,top='',left='';
        if($(e)[0].localName == 'img'){
            tar_id= ($(e)[0].offsetParent);
        }else {
            tar_id = $(e)[0];
        }
        let positions = getCoords(tar_id);//获取当前点击的元素在页面中的位置
        top = (positions.top-40) + "px";
        left = (positions.left+50) + "px";
        $(tar_id).addClass("inputfoucs-style");
        if(add_id != this.state.target_id){
            this.setState({showEditor:true,position:[top,left],target_id:add_id})
        }else {
            if(!this.state.showEditor){
                this.setState({showEditor:true,position:[top,left],target_id:add_id})
            }
        }
    }
    _childsList(data){
        if(data.length>0){
            return data.map(function(item,index){
                return <li key={index} dangerouslySetInnerHTML={{__html:item.content}}></li>
            })
        }
    }
    doCollection(){
        let ques = this.state.allQuestionetails[this.state.current-1];
        let setdata={
            userId: Storage_S.getItem('userid'),
            questionId:ques.QuesID,
            questionType:ques.QuesType,
            parentId: this.state.activeId,
            title: "我是题目"
        }
        this.props.actions.doSetCollection({
            body: setdata,
            success:()=>{alert("收藏成功！")},
            error:(mes)=>{alert("收藏失败！("+mes+")")}
        })
    }
    redoIt(){
        let answers = $("#mainTopic").find(".div_input");//选项;
        answers.each(function(){
            $(this).attr("contentEditable",true)
        })
        this.setState({solution: true})
    }
    //主试题重新做的提交按钮
    redoSubmit(data,items,index){
        let contents =[],istrue=false,score=0,isOrRight=true;
        if(items.questiontemplate == '选择题'){//选择题
            let answers = $("#mainTopic").find("input:checked");//选项;
            let answer = '';
            answers.each(function(ii){
                answer += $(this).val();//用户填写的答案
            });
            if(compareDifferent(data[0].answer,answer)){
                istrue =true;
                score = data[0].totalpoints;
            }
            contents[0] ={
                "content":answer,
                "isTrue":istrue,
                "url":''
            }
        }else{
            let mysrc = '',myvalue = '';
            let rightanswer = data[0].answer.trim().split(',')//处理填空题可能有两个答案的情况，每空平分总分
            if(items.questiontemplate == '简答题'){
                mysrc = $("#main-solution").find('img')[0].src;
                contents[0] = {
                    "content":'',
                    "isTrue":istrue,
                    "url":mysrc
                };
            }else {
                let answers = $("#mainTopic").find(".div_input");//选项;
                let  len = answers ? answers.length : 1 ;//有几个空，平均每个空的答案得分
                answers.each(function(ii){
                    if($(this).children('img').length>0){//先查找公式编辑器输入的内容即用编辑器输入的会产生一个img标签，没有则直接查text
                        mysrc = $(this).find('img')[0].src;
                        myvalue = $(this).find('img')[0].dataset.latex;
                    }else{
                        myvalue = $(this).text();
                    }
                    if(compareDifferent(rightanswer[ii],myvalue)){
                        istrue =true;
                        score += Number(data[0].totalpoints)/len;
                    }
                    contents[ii] = {
                        "content":myvalue,
                        "isTrue":istrue,
                        "url":mysrc
                    };
                })
            }
        }
        if(contents.length>0){//如果某道试题有多个空，则只要有错的 则此题为错
            for(let ii in contents){
                if(!(contents[ii].isTrue)){
                    isOrRight = false;
                }
            }}
        newChildList.Contents = contents;
        newChildList.score = score;
        newChildList.isOrRight = isOrRight;
        (this.state.sentAllList).ExamResult[index-1] = newChildList;
        (this.state.sentAllList).errorArray = this.state.errorArray;//把错误题号也缓存下来
        Storage_L.setItem(this.state.activeId+"-second",JSON.stringify(this.state.sentAllList))//每做完一个题缓存一个
        message.success("提交成功")
    }
    //获取分析、考点、解答、观察四个部分的数据
    getDateOfAnalysis(data){
        let dataArray = [];
        for(let i=0;i<data.length;i++){
            data[i].id = data[i].itemid;
            dataArray.push(data[i])
        }
        this.props.actions.getContentOfChildItemsForQues({
            body:dataArray,
            success:(data)=>{
                console.log("getContentOfChildItemsForQues=====>>>",data)
                let analysisEndData = [];
                for(let i in data){
                    if(data[i].code == 200){
                        let everydata = (data[i].data)[0];
                        everydata.parttype = data[i].reqdata.parttype;//题是属于那一部分的
                        everydata.childNum = data[i].reqdata.childNum;//题是第几问的
                        everydata.indexNum = data[i].reqdata.indexNum;//题的序列号，某一部分的第几个题
                        analysisEndData.push(everydata)
                    }
                }
                console.log("getContentOfChildItemsForQues===22222222222==>>>",analysisEndData)
                this.setState({analysisLeftContent:analysisEndData,showEditor:false});
            },
            error:(err)=>{console.error(err)}
        })
    }
    getDateOfPractice(type,data){
        let exerciseArray = [];
        for(let i=0;i<data.length;i++){
            if(data[i].parttype == type){//在返回值中查找对应部分的内容，有就查询数据
                exerciseArray.push({id:data[i].itemid})
            }
        }
        this.props.actions.getQuestion({
            body:exerciseArray,
            success:(data)=>{
                console.log("getQuestion---->>",data)
                let newdata = [];
                for(let i in data){
                    let content = data[i].data[0].content;
                    //去掉数据库查回来的无效数据
                    if(content.indexOf('巩固练习')==-1 && content.indexOf('拓展练习')==-1){
                        newdata.push(data[i])
                    }
                }
                console.log("练习的试题----》》》》》》》",newdata)
                this.setState({exerciseContent:newdata})
            },
            error:(err)=>{console.error(err)}
        })
    }
    //上传图片的回调函数，返回图片地址
    getEditContent(url,id){
        console.warn("getEditContent==>>",id,url)
        $("#"+id).find('img')[0].src = url;
        //$("#"+dom).text('').append(cont);
    }
    //巩固练习，拓展练习的提交答案
    submitAnwser(index,data){
        let target_value='',type = this.state.nowPart,url='';
        let target_exe = "exerciseTopic-"+type+"-"+index;//目标区块id
        if(data.questiontemplate == '选择题'){
            $("#"+target_exe).find("ul input:checked").each(function(ii){
                target_value += $(this).val();
            })
            if(!target_value){
                alert("请选择答案再提交！")
                return;
            }
            newChildList.childs[0][type][index] = {
                "itemid": data.questionid,
                "content":[{
                    "answer": target_value,
                    "url":url,
                    "isRight": compareDifferent(data.answer,target_value),
                    "knowledge":data.knowledge,
                    "isdone":true
                }]
            };
        }else {
            let tarid = "solution-"+type+"-"+index;
            url = $("#"+tarid).find('img')[0].src;//上传的图片的地址
            newChildList.childs[0][type][index] = {
                "itemid": data.questionid,
                "content":[{
                    "answer": '',
                    "url":url,
                    "isRight": false,
                    "knowledge":data.knowledge,
                    "isdone":true
                }]
            };
        }
        console.log("提交的答案",type,index,target_value,url);
        (this.state.sentAllList).currentquesid = this.state.current;
        (this.state.sentAllList).ExamResult[this.state.current-1] = newChildList;
        Storage_L.setItem(this.state.activeId+"-second",JSON.stringify(this.state.sentAllList))//每做完一个题缓存一个
        message.success("提交成功")
    }
    makeScore(index,total){
        let tar = "makescore"+index,score = '';
        score = $("#"+tar).val();
        if(score-total>0){
            alert("此题分数不能大于"+total+",请重新输入!")
        }
        console.log("打分",tar,$("#"+tar).val(),total)
    }
    //提交整套试卷的数据详情
    submitAllQuestion(flag){
        if(flag == 'cache'){//判断是不是缓存操作
            if(!allDoneFlag){
                (this.state.sentAllList).AllDone = "no";
            }
            this.sentAllJsonData(flag)
        }else{
            if(this.state.errorArray.length>0){
                let _this = this;
                showConfirm("还有错题没有做完呢！！！确定要全部提交吗？提交之后不能修改，只能重做！",function(){
                    allDoneFlag = true;
                    (_this.state.sentAllList).AllDone = "yes";
                    (_this.state.sentAllList).FinishDate = moment().format();//结束时间
                    _this.sentAllJsonData(flag)
                })
            }
        }
    }
    sentAllJsonData(flag){
        (this.state.sentAllList).UpdateDate = moment().format();//数据更新de时间
        let endalllist = (this.state.sentAllList).ExamResult;
        let endnewlist = [] ,allscore=0;
        let len = (this.state.allQuestionetails).length;
        for(let ii=0;ii<len;ii++){
            if(!endalllist[ii]){
                endnewlist[ii] = this.state.allQuestionetails[ii];
            }else {
                endnewlist[ii] = endalllist[ii];
            }
            allscore += Number(endnewlist[ii].score);
        }
        (this.state.sentAllList).ExamResult = endnewlist;
        (this.state.sentAllList).currentquesid = this.state.current;
        (this.state.sentAllList).errorArray = this.state.errorArray;//把错误题号也缓存下来
        (this.state.sentAllList).Score = allscore;
        Storage_L.setItem(this.state.activeId+"-second",JSON.stringify(this.state.sentAllList))//每做完一个题缓存一个

        let sentJson = JSON.stringify(this.state.sentAllList);
        let sentItems = JSON.parse(sentJson);
        sentItems.DoExamInfo = Storage_L.getItem(this.state.activeId +"-second");
        console.log("全部提交的内容：：====》》》》",sentItems);
        this.props.actions.sentUserPaperData({
            body:{data:sentItems},
            success:(data)=>{
                if(flag != 'cache'){
                    Storage_L.clear();
                    this.props.actions.push("/home/math/exams")
                }
            },
            error:(mes)=>{
                console.error('数据接收发生错误');
            }
        })
    }
    //解答分析部分中每个部分小题的提交按钮处理逻辑
    submitOne(e,data,questionType){
        let type = data.parttype;
        let index = data.indexNum;
        let childNum = data.childNum -1;//主题的第几问小题
        console.log("此题的信息：=======",data,this.state.current,type,index,questionType);
        if(!(newChildList.childs[childNum][type][index])){//先初始化每个部分小题答案信息，方便后面存储新的信息
            newChildList.childs[childNum][type][index] = {
                "itemid": "",
                "content":[]
            };
        }
        let isOrRight = false;//当前题的最终正确与否
        let lastKnowledge = [];//当前题的最终自动弹框需要的知识点
        if(questionType){//当前题目是选择题
            let value = '', isRight = false, knowledgesCont=[],knowledge_new = [];
            let knowledge = ((data.knowledge).replace(/\<B\>|\<\/B\>/g,"")).split("；");//知识点
            let rightanswer = (data.answer).trim().replace(/\s|，/g,"");//正确答案
            let inputList = $(e.target).parent().parent().find(".main_cont input:checked");//选项
            inputList.each(function(ii){
                value += $(this).val();//用户填写的答案
            })
            console.warn("答案：=======",value,rightanswer);
            isRight = compareDifferent(value,rightanswer);
            if(knowledge.length>0){
                for(let ss in knowledge){//每一个知识点独立出来，当知识点复习之后需要记录每一个知识点做题的情况，rightRank为知识点的正确率
                    knowledge_new[ss] = {
                        "name":knowledge[ss]?knowledge[ss]:"",
                        "rightRank":"0"
                    }
                }
            };
            newChildList.childs[childNum][type][index].content[0] = {
                "answer":value,
                "url":'',
                "isRight": isRight,
                "knowledges":knowledge_new
            };
            isOrRight = isRight;
            lastKnowledge = knowledge;
        }else{
            let knowledge = ((data.knowledge).replace(/["\[\]\s]|\<B\>|\<\/B\>/g,"")).split('；');//知识点
            let inputList = $(e.target).parent().parent().find(".div_input");
            let endRigth = true;//有多个空的时候 只要错一个就当这道题是错误的。
            inputList.each(function(ii){
                let value = '',mysrc='', isRight = false, knowledgesCont=[];
                let rightanswer = (data.answer).trim().replace(/\s/g,"").split("||");//正确答案
                let everyRightanswer = '';//每一个空的正确答案
                let knowledges = knowledge[ii] ? knowledge[ii].split('@#'):[];//每一个空所包含的知识点
                let knowledge_new = [];//要存储的知识点

                if($(this).children('img').length>0){//先查找公式编辑器输入的内容，即用编辑器输入的会产生一个img标签，没有则直接查text
                    mysrc = $(this).find('img')[0].src;
                    value = $(this).find('img')[0].dataset.latex;
                }else{
                    value = $(this).text();
                }
                everyRightanswer = rightanswer[ii].replace(/$/g,'');//格式化正确答案，去除多余的其他字符
                isRight = compareDifferent(everyRightanswer,value);
                if(!isRight){//有错误的空，则这道题为错
                    endRigth = false;
                    lastKnowledge = lastKnowledge.concat(knowledges);
                }
                if(knowledges.length>0){
                    for(let ss in knowledges){
                        knowledge_new[ss] = {
                            "name":knowledges[ss]?knowledges[ss]:"",
                            "rightRank":"0"
                        }
                    }
                };
                newChildList.childs[childNum][type][index].content[ii] = {
                    "answer":value,
                    "url":mysrc,
                    "isRight": isRight,
                    "knowledges":knowledge_new
                };
            });
            isOrRight = endRigth;
            //lastKnowledge = knowledge;
        }
        if(!isOrRight){//如果做错了 则自动弹框知识点复习
            autoKnowledgeList = lastKnowledge;
            if(autoKnowledgeList.length>0){
                this.autoGetKnowledge()
            }
        }
        newChildList.childs[childNum][type][index].itemid = data.itemid;
        (this.state.sentAllList).currentquesid = this.state.current;
        (this.state.sentAllList).ExamResult[this.state.current-1] = newChildList;
        (this.state.sentAllList).errorArray = this.state.errorArray;//把错误题号也缓存下来
        Storage_L.setItem(this.state.activeId+"-second",JSON.stringify(this.state.sentAllList))//每做完一个题缓存一个
        message.success("提交成功")
    }
    //点击显示知识点弹框
    getKnowledge(e){
        let knowledge = $(e.target)[0].innerText;
        console.log("knowledge----看这里----------->>>>>",knowledge)
        this.setState({DialogMaskFlag:true,knowledgeName:knowledge})
    }
    //当点击提交按钮 题目做错了之后 自动显示知识点弹框
    autoGetKnowledge(){
        console.log("autoGetKnowledge---------自动弹框的知识点列表---》",autoKnowledgeList)
        let knowledge = autoKnowledgeList[0];
        this.setState({DialogMaskFlag:true,knowledgeName:knowledge})
    }
    closeKnowledgeBox(){
        UE.delEditor('knowledgeContainer');
        this.setState({DialogMaskFlag:false})
    }
    _contentQtxt(data,index){
        console.log("_contentQtext------//////--------------------->>>>>",data)
        if(data.length<1){return}
        let items = data[0];
        let content = items.content;
        let questiontemplate = items.questiontemplate;
        let childs = items.childs;
        let questionType=false;
        //选择题的时候要处理返回的选项格式
        if(questiontemplate == '选择题'){
            questionType = true;
        }
        let oldcontent = this.state.sentAllList.ExamResult[index-1];//做过一次的数据
        let oldanswer = (oldcontent && (oldcontent.Contents).length>0) ? oldcontent.Contents: this.state.allQuestionetails[index-1].Contents;
        console.log("oldanswer=====>>>>>>>>",oldanswer)
        if(content){
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                let qqq =  '<span class="div_input"></span>';
                content = content.replace(/blank|BLANK|#blank#|#BLANK#/g,qqq);
            }
            return (
                <div>
                    <div className="displayflex QtxtContent_main_title">
                        <div className="QtxtContent_main_title_left" id="aaaaaa">{questiontemplate}：</div>
                        <div className="QtxtContent_main_title_right">
                            <Button onClick={()=>this.doCollection()}>收藏</Button>
                            <Button onClick={()=>this.redoIt()}>重做</Button>
                            <Button id="redosubimt" onClick={()=>this.redoSubmit(data,items,index)}>提交</Button>
                        </div>
                    </div>
                    <div>
                        <ul id="mainTopic" style={{padding:"8px 0"}}>
                            <li dangerouslySetInnerHTML={{__html:content}}></li>
                            {questionType?<MultipleChoice type={items.questiontype} answer={oldanswer.length>0?oldanswer[0].content:""} index={index} choiceList={items.optionselect} />:''}
                            {childs.length<1?"":this._childsList(childs)}
                        </ul>
                        <ul>
                            {items.isobjective == '主观'?(<div>
                                <li id="solition" style={{paddingTop:"5px"}}>解：<span id="main-solution">
                                     <img src={oldanswer[0].url} width="200px" />
                                </span></li>
                                <UpLoadFile id="main-solution" submitHandle={this.getEditContent.bind(this)} />
                            </div>):''}
                        </ul>
                    </div>
                </div>
            )
        }
    }
    _analysisQtxt(data){
        let num = this.state.current;
        let childsLen = this.state.sentAllList.ExamResult[num-1];
        return data.map(function(item,index){
            let content = item.content;
            let knowledge = item.knowledge;
            let questionType=false;
            let ddd = !childsLen ? '':childsLen.childs[item.childNum-1][item.parttype];//某一部分，是数组形式
            let ddd_content = [];
            if(ddd && ddd.length>0){
                if(ddd[item.indexNum]){
                    ddd_content = (ddd && ddd.length>0) ? ddd[item.indexNum].content : [];//解析的某部分的第几个content所有内容（比如考点中的第一个小题全部内容）
                }
            }
            let regex=/{@.+?@}/g;
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/<u>blank<\/u>|blank|BLANK|#blank#|#BLANK#/g,'<span contenteditable="true" class="div_input"></span>')
            }
            let knowledgelist = content.match(regex);//找出必填空的知识点
            if(knowledgelist && knowledgelist.length>0){
                for(let i in knowledgelist){
                    content = content.replace(/{@|@}/g,'');
                    let knowname = knowledgelist[i].replace(/\s|{@|@}/g,'');
                    let knownamelist = knowname.split('；');//处理一个空有多个知识点的情况
                    for(let j in knownamelist){
                        content = content.replace(new RegExp(knownamelist[j],'g'),'<span class="mustText">'+knownamelist[j]+'</span>')//标记必填空
                    }
                }
            }
            if(item.questiontemplate == '选择题'){
                questionType = true;
            }
            if(knowledge){
                knowledge = (knowledge.replace(/["\[\]\s]/g,""));
                knowledge = knowledge.replace(/；|\@\#|;|\|\|/g,"@&").split('@&');
            }
            return (
                <div className="analysisContent" style={{padding: "10px",borderBottom: '1px dashed gray'}} id={item.parttype+ "-" + item.childNum+ "-" + item.indexNum} key={index} >
                    <ul className="main_cont">
                        <li dangerouslySetInnerHTML={{__html:content}}></li>
                        {questionType?<MultipleChoice type="多选题" answer={ddd_content.length>0?ddd_content[0].answer:''} index={index} choiceList={item.optionselect} />:''}
                    </ul>
                    {(item.answer).length<1?"":(
                        <ul>
                            {knowledge.length>0 ? <span>知识点回顾：{knowledge.map((itm,index)=>{
                                return <a key={index} style={{marginLeft:"5px"}} onClick={(e)=>this.getKnowledge(e)} dangerouslySetInnerHTML={{__html:itm.replace(/\@\#/g,',')}}></a>
                            })}</span> :''}
                            <span style={{margin:"0 10px"}}>答案：<span dangerouslySetInnerHTML={{__html:item.answer}}></span></span>
                            <button className="marginl10" onClick={(e)=>{this.submitOne(e,item,questionType)}}>提交</button>
                        </ul>
                    )}
                </div>
            )
        },this)
    }
    _practicesQtxt(data){
        let num = this.state.current,type = this.state.nowPart;
        let childsLen = this.state.sentAllList.ExamResult[num-1];
        let ddd = !childsLen ? '':childsLen.childs[0][type];
        return data.map(function (item,index) {
            let items = (item.data)[0];
            let content = items.content;
            let questionType = false;
            let ddd_content = (ddd && ddd[index]) ? ddd[index] : '';//解析的某部分的第几个content所有内容（比如考点中的第一个小题全部内容）
            if (content.indexOf("blank") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/blank|BLANK|#blank#|#BLANK#/g,'<input type="text" class="input_blank"/>');
            }
            if(items.questiontemplate == '选择题'){
                questionType = true;//有两个选项以上
            }
            console.log("_practicesQtxt---->>>",index,ddd_content)
            if(content){
                return (
                    <div className="exercise2" key={index}>
                        <div className="exercise2-border">
                            <div className="exercise2_main_content">
                                <div id={"exerciseTopic-"+type+"-"+index}>
                                    <ul>
                                        <li style={{paddingTop:"6px"}} dangerouslySetInnerHTML={{__html:content}}></li>
                                        {questionType?<MultipleChoice type={items.questiontype} answer={ddd_content?(ddd_content.content)[0].answer:''} index={index} choiceList={items.optionselect} />:''}
                                        {items.childs.size<1?"":this._childsList(items.childs)}
                                        {items.isobjective == '主观'?(<div>
                                            <li className={"solution-"+type+"-"+index} style={{paddingTop:"5px"}}>解：
                                                <span id={"solution-"+type+"-"+index}>
                                                    <img src={ddd_content? (ddd_content.content)[0].url:''} width="200px" />
                                                </span>
                                                <UpLoadFile id={"solution-"+type+"-"+index} preview="false" submitHandle={this.getEditContent.bind(this)} />
                                            </li>
                                        </div>):''}
                                    </ul>
                                </div>
                                <div>
                                    <div className="submitAndscore">
                                        <Button type="primary" size="small" onClick={()=>this.submitAnwser(index,items)}>提交答案</Button>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        },this)
    }
    _AnswerFlag(type,data){
        if(data.length<1){return}
        return (
            <div>
                <div>答案为：</div>
                <div dangerouslySetInnerHTML={{__html:data[0].answer}}></div>
            </div>
        )
    }
    getData(data,page,data2){
        //let olddata =  this.state.sentAllList.ExamResult[page];
        let ChildQuestionOfExam = data2[page];
        if(!this.state.sentAllList.ExamResult[page]){//没有此题缓存，则取出一测的做题答案信息
            newChildList = JSON.parse(everyChildInfo)//先全部给空，初始化
            newChildList.Contents = data.Contents;
            newChildList.knowledge = data.knowledge;
            newChildList.isOrRight = data.isOrRight;
            newChildList.score = data.score;
        }else {
            newChildList = this.state.sentAllList.ExamResult[page];
            if(!newChildList.childs){
                if(ChildQuestionOfExam.childs.length>1){//判断有没有小问题
                    newChildList.childs = [];
                    for(let i in ChildQuestionOfExam.childs){
                        newChildList.childs[i] = JSON.parse(everyChildInfo).childs[0];
                    }
                }else {
                    newChildList.childs = JSON.parse(everyChildInfo).childs;
                }
            }
        }
        let allChildsItem = [];
        if(ChildQuestionOfExam.childs.length>0){//有小问的情况
            let childsNode = ChildQuestionOfExam.childs;
            for(let i in childsNode){//取出与本试题所有的相关联的 分析部分的题号，然后取出对应的所有题目内容（需要全部展示的）
                let childparts = childsNode[i].childparts;//小问的四个部分
                for(let j in childparts){//每个部分的所有小题题目
                    let childitems =  childparts[j].childs;
                    for(let m in childitems){
                        let minitem = childitems[m];//最小的单位 即最小单位的题，不能再深层遍历了
                        minitem.parttype = childparts[j].parttype;//属于那一部分的题
                        minitem.childNum = (Number(i)+1);//属于第几小问的题
                        minitem.indexNum = m;//某部分题的序列
                        allChildsItem.push(minitem);
                    }
                }
            }
        }else{
            let childparts = ChildQuestionOfExam.childparts;//小问的四个部分
            for(let j in childparts){//每个部分的所有小题题目
                let childitems =  childparts[j].childs;
                if(childparts[j].parttype != 'Exercise1' && childparts[j].parttype != 'Exercise2'){
                    for(let m in childitems){
                        let minitem = childitems[m];//最小的单位 即最小单位的题，不能再深层遍历了
                        minitem.parttype = childparts[j].parttype;//属于那一部分的题
                        minitem.childNum = 1;//属于第几小问的题
                        minitem.indexNum = m;//某部分题的序列
                        allChildsItem.push(minitem);
                    }
                }
            }
        }
        console.warn("看这里=====》》》",allChildsItem)
        if(data){
            this.props.actions.getAllChildOfQuestion({body:[{id:data.QuesID}],
                success:(data)=>{
                    console.log("currentQuesData-------===---->>>",(data[0].data));
                    newChildList.QuesID = (data[0].data)[0].questionid;
                    newChildList.QuesType = (data[0].data)[0].questiontemplate;
                    this.setState({
                        current: page+1,
                        analysisLeftContent:[],
                        exerciseContent:[],
                        showEditor:false,
                        solution: false,
                        currentQuesData:data[0].data,
                        Pending:false,
                    })
                    //查询此题分析部分的所有题目
                    this.getDateOfAnalysis(allChildsItem)
                }})
        }
    }
    updateErrorArray(){
        let errArray = [];
        let {errorArray,current,sentAllList} = this.state;
        errArray = errArray.concat(errorArray)//重新设置一个错误数组，不能直接复制指向this.state。否则无法render
        if($.inArray(current,errArray) != -1){//当前的试题在错误列表里面
            if(sentAllList.ExamResult[current-1]){
                if(sentAllList.ExamResult[current-1].isOrRight){
                    errArray.splice($.inArray(current,errArray),1)
                }
            }
        }
        (this.state.sentAllList).errorArray = errArray;//把错误题号也缓存下来
        this.submitAllQuestion('cache');//发送数据库缓存
        Storage_L.setItem(this.state.activeId+"-second",JSON.stringify(this.state.sentAllList))//本地缓存
        this.setState({errorArray:errArray})
    }
    nextQuestionHandle(){
        let current = this.state.current;
        this.updateErrorArray();
        this.getData(this.state.allQuestionetails[current],current,this.state.allChildQuestionOfExam)
    }
    onChange = (page) => {
        console.log("page--",page)
        this.updateErrorArray();
        this.getData(this.state.allQuestionetails[page-1],page-1,this.state.allChildQuestionOfExam)
    }
    exitBack(){
        UE.delEditor('questionContainer');//退出的时候删除实例化的编辑器
        this.submitAllQuestion('cache');//发送数据库缓存
        Storage_L.setItem(this.state.activeId+"-second",JSON.stringify(this.state.sentAllList))//本地缓存
        this.props.actions.push("/home/math/exams")
    }
    _menuList(currentQuesData){
        if(currentQuesData.length<1){return}
        let len = currentQuesData[0].childs.length;
        const menulist = (length)=>{
            const list = [];
            for(let i=0;i<length;i++){
                list.push(
                    <Link key={i} href={"javascript:void("+(i+1)+")"} title={'第'+(i+1)+'问'} >
                        <Link href={"#Objective-"+(i+1)+"-0"} title="观察" />
                        <Link href={"#Review-"+(i+1)+"-0"} title="考点" />
                        <Link href={"#Analysis-"+(i+1)+"-0"} title="分析" />
                        <Link href={"#Explain-"+(i+1)+"-0"} title="解法" />
                    </Link>
                )
            }
            return list;
        }
        if(len>0){
            return(
                <Anchor affix={false}>
                    <Link href="javascript:void(10)" title="页面导航:" />
                    <Link href="#Content_Qtxt" title="主题干" />
                    {menulist(len)}
                </Anchor>
            );
        }else {
            return (
                <Anchor affix={false}>
                    <Link href="javascript:void(5)" title="页面导航:" >
                        <Link href="#Content_Qtxt" title="主题干" />
                        <Link href="#Objective-1-0" title="观察" />
                        <Link href="#Review-1-0" title="考点" />
                        <Link href="#Analysis-1-0" title="分析" />
                        <Link href="#Explain-1-0" title="解法" />
                    </Link>
                </Anchor>
            );
        }
    }
    render(){
        num = num+1;
        console.log("-------------num-------------->",num)
        let {Pending,currentQuesData} = this.state;
        let title = JSON.parse(Storage_S.getItem(this.state.activeId)).exampaper;
        //获取各部分的高度
        let hh = ($(window).height()-$('.Question_content').height()-$('header').height() -130)+'px';
        console.log("----hh----hh--hh---hh--hh-----hh---hh---->",hh)
        const contH = {
            position:'relative',
            height:hh,
            minWidth: '800px',
            border: '1px solid #ddd',
            backgroundColor: 'white',
        };
        if(Pending){
            return (
                <div className="mask">
                    <div className="math-question-content">
                        <header>
                            <div className="exit" >
                                <button type="button" className="btn btn-default" onClick={()=>this.exitBack()}>退出</button>
                            </div>
                        </header>
                        <Loading size="large" tip="加载中。。。" style={{marginTop:'10px'}}></Loading>
                    </div>
                </div>
            )
        }
        return(
            <div className="mask">
                <div className="math-question-content">
                    <header>
                        <div className="title" id="title">{title+"（检测提升）"}</div>
                        <div className="exit" >
                            <button type="button" className="btn btn-default" onClick={()=>this.submitAllQuestion('allsubmit')}>全部提交</button>
                            <button type="button" className="btn btn-default" onClick={()=>this.exitBack()}>退出</button>
                        </div>
                    </header>
                    <center><hr width="90%" size={2}  color="black"></hr></center>
                    <div className="Question_content">
                        <div className="pagination_all">
                            <div className="widthPrecent5 margint10">题号:</div>
                            <div className="padding0">
                                <Pagination2 total={this.state.total} errorArray={this.state.errorArray} current={this.state.current}  onChange={this.onChange}/></div>
                        </div>
                        <div className="pagination_content">
                            <div className="btnContainer col-md-12" id="btnContainer">
                                <button id="Explain_exer" type="button" className="btn btn-primary"
                                        onClick={()=>this.requestQuestion("AnalyContent",currentQuesData)}>解答分析
                                </button>
                                <button id="Anwser_exer" type="button" className="btn btn-primary"
                                        onClick={()=>this.requestQuestion("Answer",currentQuesData)}>标准答案
                                </button>
                                <button id="Exercise1_exer" type="button" className="btn btn-primary"
                                        onClick={()=>this.requestQuestion("Exercise1",currentQuesData)}>巩固练习
                                </button>
                                <button id="Exercise2_exer" type="button" className="btn btn-primary"
                                        onClick={()=>this.requestQuestion("Exercise2",currentQuesData)}>拓展练习
                                </button>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                    <br/>
                    <hr/>
                    <section className="QtxtContent">
                        <MathJaxEditor position={this.state.position} editorId="questionContainer" target_id={this.state.target_id} showEditor={this.state.showEditor}/>
                        <div id="Analysis_Qtxt" className={this.state.AnalysisFlag?'':'displaynone'}>
                            <Row>
                                <Col span={3} className="QtxtContent-left">
                                    {this._menuList(currentQuesData)}
                                </Col>
                                <div className="nextQuestionBtn" onClick={()=>{this.nextQuestionHandle()}}>下一题</div>
                                <Col span={20} style={{overflow:'auto'}}>
                                    <div style={contH} id="QtxtContent_main">
                                        <div className="QtxtContent_main">
                                            <div id="Content_Qtxt">
                                                {this._contentQtxt(currentQuesData,this.state.current)}
                                            </div>
                                        </div>
                                        <div className="content_three_right">
                                            <p style={{fontSize:"16px"}}><b>解析部分：</b>
                                                <span style={{color:"darkgoldenrod",fontSize:"12px"}}>(标有红色的空必须填写奥！)</span></p>
                                            <div id="analysusQuesCont">
                                                {(this.state.analysisLeftContent).length>0?this._analysisQtxt(this.state.analysisLeftContent):<NoThisPart/>}
                                                {!this.state.DialogMaskFlag?"":<DialogMask title={this.state.knowledgeName} closeDialog={()=>this.closeKnowledgeBox()}><Knowledge questionId={this.state.allQuestionetails[this.state.current-1].QuesID} examPaperId={this.state.activeId} knowledgeName={this.state.knowledgeName} /></DialogMask>}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div id="AnswerFlag" className={this.state.AnswerFlag?'':'displaynone'} style={contH}>
                            <div className="content_three_right">
                                {this._AnswerFlag('Exercise1',currentQuesData)}
                            </div>
                            <div style={{clear:"both"}}></div>
                        </div>
                        <div id="Exercise1_Qtxt" className={this.state.Exercise1Flag?'':'displaynone'} style={contH}>
                            <div className="content_three_right">
                                {(this.state.exerciseContent).length>0?this._practicesQtxt(this.state.exerciseContent):''}
                            </div>
                            <div style={{clear:"both"}}></div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state, ownProps) {
    return {
        GetFirstDataOfPaper:state.GetFirstDataOfPaper
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,getFirstDataOfPaper,getSecendDataOfPaper,getAllChildOfExam,getAllChildOfQuestion,getContentOfChildItemsForQues,getQuestion,getChildQuestionsForQuestion,doSetCollection,sentUserPaperData}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
